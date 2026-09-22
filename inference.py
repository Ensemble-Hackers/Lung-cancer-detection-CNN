"""
Single-Image Inference Script for Lung Cancer Detection.
Classifies any input chest CT scan using trained model weights.

Usage:
    uv run python inference.py "path/to/scan.png"
    or simply:
    uv run python inference.py
"""

import sys
import os
import argparse
from pathlib import Path

# Suppress verbose TensorFlow logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from keras.applications import Xception
from keras.layers import Dense, GlobalAveragePooling2D
from keras.models import Sequential

# Access image preprocessing safely across Keras / TF versions
image = tf.keras.preprocessing.image

IMAGE_SIZE = (350, 350)
CLASSES = [
    "Adenocarcinoma",
    "Large Cell Carcinoma",
    "Normal (Healthy Lung)",
    "Squamous Cell Carcinoma"
]

REPO_ROOT = Path(__file__).resolve().parent
WEIGHTS_CANDIDATES = [
    REPO_ROOT / "Lung-cancer-model-train" / "models" / "best_model.weights.h5",
    REPO_ROOT / "Lung-cancer-model-train" / "best_model.weights.h5",
]


def load_model():
    """Builds model architecture and loads checkpointed weights."""
    weights_path = next((p for p in WEIGHTS_CANDIDATES if p.exists()), None)
    if not weights_path:
        print("\n[Error] Trained weights file not found!")
        print(f"Searched in: {[str(p) for p in WEIGHTS_CANDIDATES]}")
        print("Please train the model first by running: uv run python Lung-cancer-model-train/train.py")
        sys.exit(1)

    print(f"Loading weights from: {weights_path}")
    base_model = Xception(weights=None, include_top=False, input_shape=(*IMAGE_SIZE, 3))
    model = Sequential([
        base_model,
        GlobalAveragePooling2D(),
        Dense(len(CLASSES), activation="softmax")
    ])
    model.load_weights(str(weights_path))
    return model


def predict(model, image_path: Path):
    """Preprocesses input CT scan, performs prediction, and displays results."""
    if not image_path.exists():
        print(f"\n[Error] Image file does not exist: {image_path}")
        sys.exit(1)

    print(f"\nAnalyzing image: {image_path.resolve()}")

    # 1. Load and normalize image
    raw_img = image.load_img(str(image_path), target_size=IMAGE_SIZE)
    img_array = image.img_to_array(raw_img) / 255.0
    input_tensor = np.expand_dims(img_array, axis=0)

    # 2. Run inference
    predictions = model.predict(input_tensor, verbose=0)[0]
    top_idx = int(np.argmax(predictions))
    top_class = CLASSES[top_idx]
    top_confidence = float(predictions[top_idx]) * 100.0

    # 3. Print report to terminal
    print("\n" + "=" * 55)
    print(f"  PREDICTION: {top_class.upper()}")
    print(f"  CONFIDENCE: {top_confidence:.2f}%")
    print("=" * 55)
    print("Class Probabilities:")
    for label, prob in zip(CLASSES, predictions):
        bar = "#" * int(prob * 30)
        print(f"  {label:<25} {prob * 100:6.2f}%  |{bar:<30}|")
    print("=" * 55 + "\n")

    # 4. Save and display visual chart
    fig, (ax_img, ax_bar) = plt.subplots(1, 2, figsize=(12, 5))

    # Left: Input Image
    ax_img.imshow(raw_img)
    ax_img.set_title(f"Input Scan\nPredicted: {top_class} ({top_confidence:.1f}%)", fontsize=12, fontweight="bold")
    ax_img.axis("off")

    # Right: Probability Bar Chart
    colors = ["#3498db" if i != top_idx else "#e74c3c" for i in range(len(CLASSES))]
    y_pos = np.arange(len(CLASSES))
    ax_bar.barh(y_pos, predictions * 100, color=colors)
    ax_bar.set_yticks(y_pos)
    ax_bar.set_yticklabels(CLASSES, fontsize=10)
    ax_bar.invert_yaxis()  # top-down
    ax_bar.set_xlabel("Confidence (%)", fontsize=11)
    ax_bar.set_xlim(0, 100)
    ax_bar.grid(axis="x", linestyle="--", alpha=0.6)

    # Annotate bars with percentages
    for i, p in enumerate(predictions):
        ax_bar.text(p * 100 + 1, i, f"{p * 100:.1f}%", va="center", fontsize=10, fontweight="bold")

    plt.tight_layout()
    output_plot_path = REPO_ROOT / "prediction_result.png"
    plt.savefig(output_plot_path, dpi=150)
    print(f"Saved visualization plot to: {output_plot_path}")

    # Show interactive preview window
    plt.show()


def main():
    parser = argparse.ArgumentParser(description="Predict lung cancer diagnosis from a CT scan image.")
    parser.add_argument("image_path", nargs="?", help="Path to chest CT scan image file (PNG/JPG)")
    args = parser.parse_args()

    # If no image path was passed on CLI, prompt the user
    target_path_str = args.image_path
    if not target_path_str:
        print("=" * 55)
        print(" Lung Cancer CT Scan Prediction Tool")
        print("=" * 55)
        target_path_str = input("Enter path to your downloaded CT scan image: ").strip().strip('"').strip("'")
        if not target_path_str:
            # Fallback: check if test images exist in the repository
            sample_dir = REPO_ROOT / "Lung-cancer-model-train" / "dataset" / "test"
            sample_candidates = list(sample_dir.glob("*/*.png")) + list(sample_dir.glob("*/*.jpg"))
            if sample_candidates:
                target_path_str = str(sample_candidates[0])
                print(f"No path entered. Falling back to test sample: {target_path_str}")
            else:
                print("No image path provided. Exiting.")
                sys.exit(1)

    image_path = Path(target_path_str)
    model = load_model()
    predict(model, image_path)


if __name__ == "__main__":
    main()
