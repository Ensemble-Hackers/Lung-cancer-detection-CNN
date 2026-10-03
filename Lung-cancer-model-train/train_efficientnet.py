"""
Lung Cancer Training Pipeline: EfficientNetV2-S Backbone for Multi-Model Ensemble.

Architecture:
  - Input: (350, 350, 3) raw CT scans [0, 255] (internally scaled by EfficientNetV2S stem)
  - Backbone: Pretrained EfficientNetV2-S (ImageNet)
  - Head: GlobalAveragePooling2D -> BatchNormalization -> Dense(256, relu) -> Dropout(0.4) -> Dense(4, softmax)
  - Stage 1: Frozen backbone (LR = 1e-3, 20 epochs max)
  - Stage 2: Fine-tune top 35 layers (LR = 1e-5, 20 epochs max)
"""

import sys
import os
import warnings
from pathlib import Path

# Force UTF-8 stdout on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

warnings.filterwarnings("ignore")

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "1"

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf

from tensorflow.keras.applications import EfficientNetV2S
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.layers import BatchNormalization, Dense, Dropout, GlobalAveragePooling2D, Input
from tensorflow.keras.models import Model
from sklearn.utils.class_weight import compute_class_weight

ImageDataGenerator = tf.keras.preprocessing.image.ImageDataGenerator

# Directories
BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "dataset"
TRAIN_DIR = DATASET_DIR / "train"
VALID_DIR = DATASET_DIR / "valid"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

BEST_WEIGHTS_PATH = MODELS_DIR / "efficientnetv2s_best.weights.h5"
SAVED_MODEL_PATH = MODELS_DIR / "efficientnetv2s_model.h5"
CURVES_PLOT_PATH = MODELS_DIR / "efficientnetv2s_training_curves.png"

IMAGE_SIZE = (350, 350)
BATCH_SIZE = 16
NUM_CLASSES = 4

STAGE1_EPOCHS = 20
STAGE2_EPOCHS = 20
FINETUNE_LAYERS = 35


def create_generators(train_path, valid_path):
    # Note: EfficientNetV2S has an internal Rescaling layer (x/128 - 1), so we keep raw [0, 255]
    train_datagen = ImageDataGenerator(
        horizontal_flip=True,
        rotation_range=15,
        zoom_range=0.10,
        width_shift_range=0.10,
        height_shift_range=0.10,
        shear_range=0.05,
        brightness_range=[0.8, 1.2],
        fill_mode="nearest",
    )
    valid_datagen = ImageDataGenerator()

    print(f"Loading training data from: {train_path}")
    train_gen = train_datagen.flow_from_directory(
        str(train_path),
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        color_mode="rgb",
        class_mode="categorical",
        shuffle=True,
    )

    print(f"Loading validation data from: {valid_path}")
    valid_gen = valid_datagen.flow_from_directory(
        str(valid_path),
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        color_mode="rgb",
        class_mode="categorical",
        shuffle=False,
    )

    return train_gen, valid_gen


def compute_class_weights(train_gen):
    labels = train_gen.classes
    unique_classes = np.unique(labels)
    weights = compute_class_weight(
        class_weight="balanced",
        classes=unique_classes,
        y=labels,
    )
    weight_dict = dict(zip(unique_classes, weights))
    print(f"Computed Class Weights: {weight_dict}")
    return weight_dict


def build_efficientnet_model():
    inputs = Input(shape=(*IMAGE_SIZE, 3))
    backbone = EfficientNetV2S(weights="imagenet", include_top=False, input_tensor=inputs)
    backbone.trainable = False

    x = GlobalAveragePooling2D()(backbone.output)
    x = BatchNormalization()(x)
    x = Dense(256, activation="relu")(x)
    x = Dropout(0.4)(x)
    outputs = Dense(NUM_CLASSES, activation="softmax")(x)

    model = Model(inputs=inputs, outputs=outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model, backbone


def get_callbacks():
    return [
        ModelCheckpoint(
            filepath=str(BEST_WEIGHTS_PATH),
            monitor="val_loss",
            verbose=1,
            save_best_only=True,
            save_weights_only=True,
        ),
        EarlyStopping(
            monitor="val_loss",
            patience=6,
            verbose=1,
            mode="min",
            restore_best_weights=True,
        ),
        ReduceLROnPlateau(
            monitor="val_loss",
            patience=3,
            verbose=1,
            factor=0.5,
            min_lr=1e-7,
        ),
    ]


def plot_curves(history1, history2):
    combined = {}
    for key in history1.history:
        combined[key] = history1.history[key] + history2.history.get(key, [])

    plt.figure(figsize=(10, 8))
    plt.subplot(2, 1, 1)
    plt.plot(combined["loss"], label="Train Loss", color="royalblue")
    plt.plot(combined["val_loss"], label="Val Loss", color="orange")
    plt.title("EfficientNetV2-S Loss Progression")
    plt.ylabel("Loss")
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.subplot(2, 1, 2)
    plt.plot(combined["accuracy"], label="Train Accuracy", color="royalblue")
    plt.plot(combined["val_accuracy"], label="Val Accuracy", color="orange")
    plt.title("EfficientNetV2-S Accuracy Progression")
    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig(str(CURVES_PLOT_PATH), dpi=150)
    plt.close()
    print(f"Training curves saved to: {CURVES_PLOT_PATH}")


def main():
    print("=" * 60)
    print(" Training EfficientNetV2-S for Lung Cancer Ensemble")
    print("=" * 60)

    train_gen, valid_gen = create_generators(TRAIN_DIR, VALID_DIR)
    class_weights = compute_class_weights(train_gen)

    model, backbone = build_efficientnet_model()
    print(f"Total model parameters: {model.count_params():,}")

    print("\n" + "=" * 50)
    print(" Stage 1: Training Classification Head (Backbone Frozen)")
    print("=" * 50)
    h1 = model.fit(
        train_gen,
        epochs=STAGE1_EPOCHS,
        validation_data=valid_gen,
        callbacks=get_callbacks(),
        class_weight=class_weights,
    )

    print("\n" + "=" * 50)
    print(f" Stage 2: Fine-Tuning Top {FINETUNE_LAYERS} Layers (LR = 1e-5)")
    print("=" * 50)
    backbone.trainable = True
    for layer in backbone.layers[:-FINETUNE_LAYERS]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    h2 = model.fit(
        train_gen,
        epochs=STAGE2_EPOCHS,
        validation_data=valid_gen,
        callbacks=get_callbacks(),
        class_weight=class_weights,
    )

    plot_curves(h1, h2)
    model.save(str(SAVED_MODEL_PATH))
    print(f"Saved complete EfficientNetV2-S model to: {SAVED_MODEL_PATH}")
    print("EfficientNetV2-S training complete!")


if __name__ == "__main__":
    main()
