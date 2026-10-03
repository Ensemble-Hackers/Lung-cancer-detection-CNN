"""
Lung Cancer Training Pipeline using CNN and Transfer Learning (Xception).

Improvements over baseline to reduce overfitting and boost validation accuracy:
  1. Aggressive data augmentation (rotation, zoom, brightness, shear, width/height shift)
  2. Richer classification head: GAP -> BatchNorm -> Dense(256) -> Dropout(0.4) -> Dense(4)
  3. Two-stage fine-tuning: frozen backbone first, then unfreeze top 30 Xception layers
  4. Class weights to handle dataset imbalance (Adeno:195 vs LargeCell:115)
"""

import os
import sys
import warnings
from pathlib import Path

warnings.filterwarnings('ignore')

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf

from keras.applications import Xception
from keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from keras.layers import (
    BatchNormalization, Dense, Dropout, GlobalAveragePooling2D, Input
)
from keras.models import Model
from sklearn.utils.class_weight import compute_class_weight

# Access preprocessing utilities via tf.keras to avoid static import resolution issues in TF 2.16+
image = tf.keras.preprocessing.image
ImageDataGenerator = tf.keras.preprocessing.image.ImageDataGenerator


# ==========================================
# 1. Directory and Path Configurations
# ==========================================
BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "dataset"

TRAIN_DIR = DATASET_DIR / "train"
VALID_DIR = DATASET_DIR / "valid"
TEST_DIR  = DATASET_DIR / "test"

MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

BEST_MODEL_WEIGHTS  = MODELS_DIR / "best_model.weights.h5"
SAVED_MODEL_PATH    = MODELS_DIR / "trained_lung_cancer_model.h5"
MODEL_TRACKER_PATH  = MODELS_DIR / "model_tracker.md"

# Specific class folder subpaths
NORMAL_FOLDER                 = "normal"
ADENOCARCINOMA_FOLDER         = "adenocarcinoma_left.lower.lobe_T2_N0_M0_Ib"
LARGE_CELL_CARCINOMA_FOLDER   = "large.cell.carcinoma_left.hilum_T2_N2_M0_IIIa"
SQUAMOUS_CELL_CARCINOMA_FOLDER = "squamous.cell.carcinoma_left.hilum_T1_N2_M0_IIIa"

# Model hyperparameters
IMAGE_SIZE  = (350, 350)
BATCH_SIZE  = 8
OUTPUT_SIZE = 4

# Stage 1: train classification head only (backbone frozen)
STAGE1_EPOCHS = 30
# Stage 2: fine-tune top layers of backbone (lower LR)
STAGE2_EPOCHS = 30
# How many Xception layers to unfreeze from the top in Stage 2
FINETUNE_LAYERS = 30


# ==========================================
# 2. Data Generators  (IMPROVEMENT 1: aggressive augmentation)
# ==========================================
def create_generators(train_path, valid_path, target_size=IMAGE_SIZE, batch_size=BATCH_SIZE):
    """
    Creates training and validation image data generators.

    Training augmentations applied:
      - Horizontal flip            : mirror bilateral lung symmetry
      - Rotation (±15°)            : handles tilted scan acquisitions
      - Zoom (±10%)                : simulates varying FOV
      - Width/Height shift (±10%)  : accounts for off-center positioning
      - Shear (±5°)                : subtle geometric variance
      - Brightness (0.8–1.2)       : handles scanner exposure differences
    """
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        horizontal_flip=True,
        rotation_range=15,
        zoom_range=0.10,
        width_shift_range=0.10,
        height_shift_range=0.10,
        shear_range=0.05,
        brightness_range=[0.8, 1.2],
        fill_mode="nearest",
    )
    # Validation: no augmentation, only rescale
    valid_datagen = ImageDataGenerator(rescale=1.0 / 255)

    print(f"Loading training data from: {train_path}")
    train_gen = train_datagen.flow_from_directory(
        str(train_path),
        target_size=target_size,
        batch_size=batch_size,
        color_mode="rgb",
        class_mode="categorical",
        shuffle=True,
    )

    print(f"Loading validation data from: {valid_path}")
    valid_gen = valid_datagen.flow_from_directory(
        str(valid_path),
        target_size=target_size,
        batch_size=batch_size,
        color_mode="rgb",
        class_mode="categorical",
        shuffle=False,
    )

    return train_gen, valid_gen


# ==========================================
# 3. Class Weights  (IMPROVEMENT 4: handle imbalance)
# ==========================================
def compute_class_weights(train_gen):
    """
    Computes inverse-frequency class weights to penalise misclassification
    of under-represented classes (e.g. Large Cell Carcinoma: 115 samples)
    more heavily than over-represented ones (e.g. Adenocarcinoma: 195).
    """
    class_indices = train_gen.class_indices          # {class_name: index}
    labels = train_gen.classes                       # integer label per sample
    unique_classes = np.unique(labels)

    weights = compute_class_weight(
        class_weight="balanced",
        classes=unique_classes,
        y=labels,
    )
    class_weight_dict = dict(zip(unique_classes, weights))
    print(f"Class weights: {class_weight_dict}")
    return class_weight_dict


# ==========================================
# 4. Model Architecture  (IMPROVEMENT 2: richer head)
# ==========================================
def build_model(input_shape=(*IMAGE_SIZE, 3), num_classes=OUTPUT_SIZE):
    """
    Two-stage transfer learning model based on Xception.

    Head architecture (replaces bare Dense(4)):
        GAP -> BatchNormalization -> Dense(256, relu) -> Dropout(0.4) -> Dense(4, softmax)

    Rationale:
      - BatchNorm after GAP stabilises the 2048-dim feature distribution before the head.
      - Dense(256) gives the head capacity to learn lung-specific decision boundaries
        without overfitting (controlled by Dropout).
      - Dropout(0.4) is the primary regulariser — randomly zeroes 40% of activations
        each training step, forcing redundant feature learning.
    """
    inputs = Input(shape=input_shape)

    # --- Backbone (starts frozen for Stage 1) ---
    backbone = Xception(weights="imagenet", include_top=False, input_tensor=inputs)
    backbone.trainable = False

    # --- Classification Head ---
    x = GlobalAveragePooling2D()(backbone.output)
    x = BatchNormalization()(x)
    x = Dense(256, activation="relu")(x)
    x = Dropout(0.4)(x)
    outputs = Dense(num_classes, activation="softmax")(x)

    model = Model(inputs=inputs, outputs=outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model, backbone


# ==========================================
# 5. Training Utilities
# ==========================================
def display_training_curves(training, validation, title, subplot):
    """Visualises training and validation metrics."""
    if subplot % 10 == 1:
        plt.subplots(figsize=(10, 10), facecolor="#F0F0F0")
        plt.tight_layout()
    ax = plt.subplot(subplot)
    ax.set_facecolor("#F8F8F8")
    ax.plot(training)
    ax.plot(validation)
    ax.set_title("model " + title)
    ax.set_ylabel(title)
    ax.set_xlabel("epoch")
    ax.legend(["train", "valid."])


def get_callbacks(stage: int):
    """Returns the callback set for a given training stage."""
    monitor = "val_loss"
    callbacks = [
        # Save the best weights by val_loss (not train loss — tracks generalisation)
        ModelCheckpoint(
            filepath=str(BEST_MODEL_WEIGHTS),
            monitor=monitor,
            verbose=1,
            save_best_only=True,
            save_weights_only=True,
        ),
        EarlyStopping(
            monitor=monitor,
            patience=8,
            verbose=1,
            mode="min",
            restore_best_weights=True,
        ),
        ReduceLROnPlateau(
            monitor=monitor,
            patience=4,
            verbose=1,
            factor=0.5,
            min_lr=1e-7,
        ),
    ]
    return callbacks


def train_stage(model, train_gen, valid_gen, epochs, stage_label, class_weight_dict):
    """Runs one training stage and returns the history object."""
    print(f"\n{'='*55}")
    print(f"  {stage_label}")
    print(f"{'='*55}")

    history = model.fit(
        train_gen,
        steps_per_epoch=max(1, len(train_gen)),
        epochs=epochs,
        callbacks=get_callbacks(stage=1),
        validation_data=valid_gen,
        validation_steps=max(1, len(valid_gen)),
        class_weight=class_weight_dict,
    )

    train_acc = history.history["accuracy"][-1]
    val_acc   = history.history.get("val_accuracy", [None])[-1]
    print(f"\n[{stage_label}] Final train acc = {train_acc*100:.2f}%")
    if val_acc is not None:
        print(f"[{stage_label}] Final val acc   = {val_acc*100:.2f}%")

    return history


def train_model(model, backbone, train_gen, valid_gen, class_weight_dict):
    """
    Two-stage training:

    Stage 1 — Head Only (backbone frozen, lr=1e-3)
        Quickly learns lung-specific feature representations in the new head
        using high-level ImageNet features from the frozen backbone.

    Stage 2 — Fine-Tuning (IMPROVEMENT 3: unfreeze top FINETUNE_LAYERS backbone layers, lr=1e-5)
        Thaws the top 30 Xception layers so the depthwise separable convolutions
        can adapt to CT scan textures (parenchyma, ground-glass, spiculations)
        which differ from natural ImageNet images.
        A very low learning rate prevents catastrophic forgetting of ImageNet weights.
    """

    # ---- Stage 1: frozen backbone ----
    history1 = train_stage(
        model, train_gen, valid_gen,
        epochs=STAGE1_EPOCHS,
        stage_label="Stage 1 — Head Training (Backbone Frozen)",
        class_weight_dict=class_weight_dict,
    )

    # ---- Stage 2: unfreeze top FINETUNE_LAYERS backbone layers ----
    print(f"\nUnfreezing top {FINETUNE_LAYERS} Xception layers for fine-tuning...")
    backbone.trainable = True
    for layer in backbone.layers[:-FINETUNE_LAYERS]:
        layer.trainable = False

    # Recompile at a much lower LR to avoid overwriting learned features
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    print(f"Trainable layers: {sum(1 for l in model.layers if l.trainable)}")

    history2 = train_stage(
        model, train_gen, valid_gen,
        epochs=STAGE2_EPOCHS,
        stage_label=f"Stage 2 — Fine-Tuning (Top {FINETUNE_LAYERS} Xception Layers)",
        class_weight_dict=class_weight_dict,
    )

    # ---- Merge histories for plotting ----
    combined = {}
    for key in history1.history:
        combined[key] = history1.history[key] + history2.history.get(key, [])

    display_training_curves(combined["loss"], combined["val_loss"], "loss", 211)
    display_training_curves(combined["accuracy"], combined["val_accuracy"], "accuracy", 212)
    curves_path = MODELS_DIR / "training_curves.png"
    plt.savefig(str(curves_path), dpi=150, bbox_inches="tight")
    plt.close()
    print(f"\nTraining curves saved to: {curves_path}")

    # Save full model
    model.save(str(SAVED_MODEL_PATH))
    print(f"\nFull model saved to: {SAVED_MODEL_PATH}")

    # Update model tracker
    final_train_acc = combined["accuracy"][-1]
    final_val_acc   = combined.get("val_accuracy", [None])[-1]
    final_val_loss  = combined.get("val_loss", [None])[-1]
    update_model_tracker(
        MODEL_TRACKER_PATH,
        BEST_MODEL_WEIGHTS.name,
        final_train_acc,
        final_val_acc,
        final_val_loss,
        epochs=len(combined["loss"]),
        notes=(
            f"Stage1={STAGE1_EPOCHS}ep frozen | "
            f"Stage2={STAGE2_EPOCHS}ep finetune top{FINETUNE_LAYERS} | "
            "AugV2 + Dropout(0.4) + BN + ClassWeights"
        ),
    )

    return history1, history2


def update_model_tracker(tracker_path, model_file, train_acc, val_acc, val_loss, epochs, notes=""):
    """Appends a training summary row to the table in model_tracker.md."""
    if not tracker_path.exists():
        return
    import datetime
    today = datetime.date.today().isoformat()
    val_loss_str = f"{val_loss:.4f}" if val_loss is not None else "N/A"
    val_acc_str  = f"{val_acc*100:.2f}%" if val_acc is not None else "N/A"
    arch_str = f"Xception(top{FINETUNE_LAYERS} FT) + BN + Dense(256) + Drop(0.4) + Dense({OUTPUT_SIZE})"
    entry = (
        f"| {today} | `{model_file}` | {arch_str} | "
        f"{epochs} | {BATCH_SIZE} | {train_acc*100:.2f}% | {val_acc_str} | "
        f"{val_loss_str} | {notes} |\n"
    )
    content = tracker_path.read_text(encoding="utf-8")
    if "---" in content:
        parts = content.split("---", 1)
        new_content = parts[0].rstrip() + "\n" + entry + "\n---" + parts[1]
    else:
        new_content = content + "\n" + entry
    tracker_path.write_text(new_content, encoding="utf-8")
    print(f"Model tracker updated at: {tracker_path}")


# ==========================================
# 6. Inference & Prediction Helpers
# ==========================================
def load_and_preprocess_image(img_path, target_size=IMAGE_SIZE):
    """Loads and rescales an image for model input."""
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    return img_array


def predict_single_image(model, img_path, class_labels):
    """Runs prediction on a single image and displays the result."""
    img = load_and_preprocess_image(img_path, IMAGE_SIZE)
    predictions = model.predict(img)
    predicted_class = np.argmax(predictions[0])
    confidence      = predictions[0][predicted_class] * 100
    predicted_label = class_labels[predicted_class]

    print(f"\nImage: {img_path}")
    print(f"Predicted class: {predicted_label} ({confidence:.2f}% confidence)")

    plt.figure()
    plt.imshow(image.load_img(img_path, target_size=IMAGE_SIZE))
    plt.title(f"Predicted: {predicted_label} ({confidence:.1f}%)")
    plt.axis("off")
    pred_path = MODELS_DIR / f"prediction_{predicted_label}_{Path(img_path).stem}.png"
    plt.savefig(str(pred_path), dpi=150, bbox_inches="tight")
    plt.close()
    print(f"Sample prediction saved to: {pred_path}")

    return predicted_label


def find_first_image_in_dir(directory):
    """Finds the first supported image file in a directory."""
    if not directory.exists():
        return None
    for ext in ("*.png", "*.jpg", "*.jpeg"):
        matches = list(directory.glob(ext))
        if matches:
            return matches[0]
    return None


# ==========================================
# Main Execution
# ==========================================
def main():
    print(f"Using Base Directory: {BASE_DIR}")
    print(f"Dataset Directory:    {DATASET_DIR}")

    if not DATASET_DIR.exists():
        print(f"Error: Dataset folder not found at {DATASET_DIR}")
        return

    # 1. Setup Generators
    train_generator, validation_generator = create_generators(TRAIN_DIR, VALID_DIR)
    class_labels = list(train_generator.class_indices.keys())
    print(f"Class labels detected: {class_labels}")

    # 2. Compute class weights
    class_weight_dict = compute_class_weights(train_generator)

    # 3. Build Model
    model, backbone = build_model()
    model.summary()

    # 4. Load pre-existing weights if available, or run full two-stage training
    candidate_weights = [
        BEST_MODEL_WEIGHTS,
        BASE_DIR / "best_model.weights.h5",
    ]
    weights_path = next((p for p in candidate_weights if p.exists()), None)
    if weights_path:
        print(f"\nFound existing best weights at {weights_path}. Loading weights...")
        try:
            model.load_weights(str(weights_path))
            print("Weights loaded successfully!")
        except Exception as e:
            print(f"Could not load weights ({e}). Starting two-stage training...")
            train_model(model, backbone, train_generator, validation_generator, class_weight_dict)
    else:
        print("\nNo pre-existing weights found. Starting two-stage training...")
        train_model(model, backbone, train_generator, validation_generator, class_weight_dict)

    # 5. Demonstration Predictions on Local Sample Images
    print("\n--- Running Sample Inferences ---")
    sample_subdirs = [
        NORMAL_FOLDER,
        ADENOCARCINOMA_FOLDER,
        LARGE_CELL_CARCINOMA_FOLDER,
        SQUAMOUS_CELL_CARCINOMA_FOLDER,
    ]

    for subdir in sample_subdirs:
        sample_img = find_first_image_in_dir(VALID_DIR / subdir)
        if sample_img:
            predict_single_image(model, sample_img, class_labels)
        else:
            print(f"No sample image found in: {VALID_DIR / subdir}")


if __name__ == "__main__":
    main()
