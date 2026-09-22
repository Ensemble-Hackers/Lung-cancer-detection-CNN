"""
Lung Cancer Training Pipeline using CNN and Transfer Learning (Xception).
"""

import os
import sys
import warnings
from pathlib import Path

warnings.filterwarnings('ignore')

import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf

from keras.applications import Xception
from keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from keras.layers import Dense, GlobalAveragePooling2D
from keras.models import Sequential
# Access preprocessing utilities via tf.keras to avoid static import resolution issues in TF 2.16+
image = tf.keras.preprocessing.image
ImageDataGenerator = tf.keras.preprocessing.image.ImageDataGenerator


# ==========================================
# 1. Directory and Path Configurationsj
# ==========================================
BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "dataset"

TRAIN_DIR = DATASET_DIR / "train"
VALID_DIR = DATASET_DIR / "valid"
TEST_DIR = DATASET_DIR / "test"

MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

BEST_MODEL_WEIGHTS = MODELS_DIR / "best_model.weights.h5"
SAVED_MODEL_PATH = MODELS_DIR / "trained_lung_cancer_model.h5"
MODEL_TRACKER_PATH = MODELS_DIR / "model_tracker.md"

# Specific class folder subpaths
NORMAL_FOLDER = "normal"
ADENOCARCINOMA_FOLDER = "adenocarcinoma_left.lower.lobe_T2_N0_M0_Ib"
LARGE_CELL_CARCINOMA_FOLDER = "large.cell.carcinoma_left.hilum_T2_N2_M0_IIIa"
SQUAMOUS_CELL_CARCINOMA_FOLDER = "squamous.cell.carcinoma_left.hilum_T1_N2_M0_IIIa"

# Model hyperparameters
IMAGE_SIZE = (350, 350)
BATCH_SIZE = 8
OUTPUT_SIZE = 4
EPOCHS = 50


# ==========================================
# 2. Data Generators
# ==========================================
def create_generators(train_path, valid_path, target_size=IMAGE_SIZE, batch_size=BATCH_SIZE):
    """Creates training and validation image data generators."""
    train_datagen = ImageDataGenerator(rescale=1.0 / 255, horizontal_flip=True)
    valid_datagen = ImageDataGenerator(rescale=1.0 / 255)

    print(f"Loading training data from: {train_path}")
    train_gen = train_datagen.flow_from_directory(
        str(train_path),
        target_size=target_size,
        batch_size=batch_size,
        color_mode="rgb",
        class_mode="categorical",
        shuffle=True
    )

    print(f"Loading validation data from: {valid_path}")
    valid_gen = valid_datagen.flow_from_directory(
        str(valid_path),
        target_size=target_size,
        batch_size=batch_size,
        color_mode="rgb",
        class_mode="categorical",
        shuffle=False
    )

    return train_gen, valid_gen


# ==========================================
# 3. Model Architecture
# ==========================================
def build_model(input_shape=(*IMAGE_SIZE, 3), num_classes=OUTPUT_SIZE):
    """Builds transfer learning model based on pre-trained Xception."""
    pretrained_model = Xception(weights="imagenet", include_top=False, input_shape=input_shape)
    pretrained_model.trainable = False

    model = Sequential([
        pretrained_model,
        GlobalAveragePooling2D(),
        Dense(num_classes, activation="softmax")
    ])

    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model


# ==========================================
# 4. Training Utilities
# ==========================================
def display_training_curves(training, validation, title, subplot):
    """Visualizes training and validation metrics."""
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


def train_model(model, train_gen, valid_gen, epochs=EPOCHS):
    """Trains the model with callbacks and plots history."""
    callbacks = [
        ReduceLROnPlateau(monitor="loss", patience=5, verbose=1, factor=0.5, min_lr=1e-6),
        EarlyStopping(monitor="loss", patience=6, verbose=1, mode="auto"),
        ModelCheckpoint(filepath=str(BEST_MODEL_WEIGHTS), verbose=1, save_best_only=True, save_weights_only=True)
    ]

    history = model.fit(
        train_gen,
        steps_per_epoch=max(1, len(train_gen)),
        epochs=epochs,
        callbacks=callbacks,
        validation_data=valid_gen,
        validation_steps=max(1, len(valid_gen))
    )

    print("Final training accuracy =", history.history["accuracy"][-1])
    if "val_accuracy" in history.history:
        print("Final validation accuracy =", history.history["val_accuracy"][-1])

    display_training_curves(history.history["loss"], history.history["val_loss"], "loss", 211)
    display_training_curves(history.history["accuracy"], history.history["val_accuracy"], "accuracy", 212)
    plt.show()

    # Save full model
    model.save(str(SAVED_MODEL_PATH))
    print(f"Model saved to: {SAVED_MODEL_PATH}")

    # Track model run metrics in model_tracker.md
    train_acc = history.history["accuracy"][-1]
    val_acc = history.history.get("val_accuracy", [None])[-1]
    val_loss = history.history.get("val_loss", [None])[-1]
    update_model_tracker(
        MODEL_TRACKER_PATH,
        BEST_MODEL_WEIGHTS.name,
        train_acc,
        val_acc,
        val_loss,
        epochs=len(history.history["loss"]),
        notes="Automated training run"
    )

    return history


def update_model_tracker(tracker_path, model_file, train_acc, val_acc, val_loss, epochs, notes=""):
    """Appends a training summary row to the table in model_tracker.md."""
    if not tracker_path.exists():
        return
    import datetime
    today = datetime.date.today().isoformat()
    val_loss_str = f"{val_loss:.4f}" if val_loss is not None else "N/A"
    val_acc_str = f"{val_acc*100:.2f}%" if val_acc is not None else "N/A"
    entry = (
        f"| {today} | `{model_file}` | Xception + GAP + Dense({OUTPUT_SIZE}) | "
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
# 5. Inference & Prediction Helpers
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
    confidence = predictions[0][predicted_class] * 100
    predicted_label = class_labels[predicted_class]

    print(f"\nImage: {img_path}")
    print(f"Predicted class: {predicted_label} ({confidence:.2f}% confidence)")

    plt.imshow(image.load_img(img_path, target_size=IMAGE_SIZE))
    plt.title(f"Predicted: {predicted_label} ({confidence:.1f}%)")
    plt.axis("off")
    plt.show()

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
    print(f"Dataset Directory: {DATASET_DIR}")

    if not DATASET_DIR.exists():
        print(f"Error: Dataset folder not found at {DATASET_DIR}")
        return

    # 1. Setup Generators
    train_generator, validation_generator = create_generators(TRAIN_DIR, VALID_DIR)
    class_labels = list(train_generator.class_indices.keys())
    print(f"Class labels detected: {class_labels}")

    # 2. Build Model
    model = build_model()
    model.summary()

    # 3. Load pre-existing weights if available, or train
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
            print(f"Could not load weights ({e}). Training will be required.")
            train_model(model, train_generator, validation_generator)
    else:
        print("\nNo pre-existing weights found. Starting training...")
        train_model(model, train_generator, validation_generator)

    # 4. Demonstration Predictions on Local Sample Images
    print("\n--- Running Sample Inferences ---")
    sample_subdirs = [
        NORMAL_FOLDER,
        ADENOCARCINOMA_FOLDER,
        LARGE_CELL_CARCINOMA_FOLDER,
        SQUAMOUS_CELL_CARCINOMA_FOLDER
    ]

    for subdir in sample_subdirs:
        sample_img = find_first_image_in_dir(VALID_DIR / subdir)
        if sample_img:
            predict_single_image(model, sample_img, class_labels)
        else:
            print(f"No sample image found in: {VALID_DIR / subdir}")


if __name__ == "__main__":
    main()
