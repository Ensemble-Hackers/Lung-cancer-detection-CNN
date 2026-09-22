# Lung Cancer Prediction using CNN and Transfer Learning

This repository provides an end-to-end deep learning pipeline for detecting and classifying lung cancer from chest CT scan images into four distinct categories using Convolutional Neural Networks (CNN) and Transfer Learning with **Xception**.

---

## Table of Contents
- [Overview](#overview)
- [Classes & Dataset](#classes--dataset)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [How to Run](#how-to-run)
  - [Option 1: Training Pipeline Script (`train.py`)](#option-1-training-pipeline-script-trainpy-recommended)
  - [Option 2: Test Any Custom CT Scan (`inference.py`)](#option-2-test-any-custom--downloaded-ct-scan-inferencepy)
  - [Option 3: Interactive Training Notebook (`train.ipynb`)](#option-3-interactive-experimentation-notebook-trainipynb)
- [Model Architecture & Training Details](#model-architecture--training-details)
- [Results & Model Tracker](#results--model-tracker)
- [Acknowledgements](#acknowledgements)

---

## Overview

Lung cancer is one of the leading causes of cancer-related mortality globally. Early detection and precise classification of pulmonary lesions significantly improve patient prognosis and clinical treatment planning. This project utilizes transfer learning with a pre-trained **Xception** backbone on ImageNet, coupled with Global Average Pooling and dense classification layers, to classify chest CT scans.

---

## Classes & Dataset

The dataset classifies scans into four distinct categories:
1. **Normal** – Healthy lung tissue with no malignant abnormalities.
2. **Adenocarcinoma** – Common non-small cell lung cancer originating in peripheral mucus-secreting glands (`adenocarcinoma_left.lower.lobe_T2_N0_M0_Ib`).
3. **Large Cell Carcinoma** – Fast-growing, undifferentiated non-small cell carcinoma (`large.cell.carcinoma_left.hilum_T2_N2_M0_IIIa`).
4. **Squamous Cell Carcinoma** – Non-small cell carcinoma typically developing in the central bronchial airways (`squamous.cell.carcinoma_left.hilum_T1_N2_M0_IIIa`).

The images are organized under `Lung-cancer-model-train/dataset/` into `train/`, `valid/`, and `test/` splits.

> **Dataset Source**: Based on the [Chest CT-Scan Images Dataset on Kaggle](https://www.kaggle.com/datasets/mohamedhanyyy/chest-ctscan-images).

---

## Project Structure

```text
Lung-cancer-detection-CNN/
├── inference.py                           # Standalone CLI / visual inference on any custom scan
├── pyproject.toml                         # Project configuration and dependency specifications
├── uv.lock                                # Locked dependency versions for reproducible installs
├── README.md                              # Main project documentation and guides
└── Lung-cancer-model-train/
    ├── train.py                           # Standalone training script (smart load / train / infer)
    ├── train.ipynb                        # Interactive Jupyter Notebook for experiments & EDA
    ├── dataset/
    │   ├── train/                         # Training images (4 classes)
    │   ├── valid/                         # Validation images (4 classes)
    │   └── test/                          # Holdout testing images (4 classes)
    └── models/
        ├── best_model.weights.h5          # Checkpointed best model weights (Keras 3 weights format)
        ├── trained_lung_cancer_model.h5   # Full trained Keras model (architecture + weights)
        └── model_tracker.md               # Training experiment log and performance tracker
```

---

## Environment Setup

### Prerequisites
- **Python**: `>= 3.10, < 3.12`
- Supported OS: Windows, Linux, macOS

### Using `uv` (Recommended)
If you use [uv](https://github.com/astral-sh/uv):
```bash
# Clone the repository
git clone https://github.com/Stellar-merge/Lung-cancer-detection-CNN.git
cd Lung-cancer-detection-CNN

# Install all dependencies into a virtual environment
uv sync
```


---

## How to Run

You have two primary options to run this project: a **Python script** for automated execution and a **Jupyter Notebook** for interactive exploration.

### Option 1: Training Pipeline Script (`train.py`) *(Recommended)*

Use **`train.py`** for automated training, evaluation, and headless execution:

```bash
# From repository root
uv run python Lung-cancer-model-train/train.py
```

#### What it does:
1. **Verifies Environment & Dataset**: Automatically checks paths and ensures class subdirectories exist.
2. **Builds Pipeline**: Constructs data generators with rescale (`1/255`) and horizontal flip augmentations.
3. **Smart Weight Loading**:
   - Checks if `models/best_model.weights.h5` already exists on disk.
   - If found, it **loads existing weights instantly** and skips the long 50-epoch training phase.
   - If weights are absent (or deleted), it triggers the full training routine with callbacks (`ReduceLROnPlateau`, `EarlyStopping`, `ModelCheckpoint`).
4. **Runs Sample Demonstrations**: Runs inference across sample CT scans for each of the 4 classes and presents prediction confidence along with visual Matplotlib displays.

---

### Option 2: Test Any Custom / Downloaded CT Scan (`inference.py`)

Test any downloaded chest CT scan image with visual confidence breakdown:

```bash
# Provide image path directly:
uv run python inference.py "path/to/downloaded_scan.png"

# Or run interactively (it will prompt you for the path):
uv run python inference.py
```
Outputs a terminal breakdown and generates an interactive/saved visual plot (`prediction_result.png`).

---

### Option 3: Interactive Training Notebook (`train.ipynb`)

Use **`train.ipynb`** for **hands-on experimentation, step-by-step EDA, and retraining**.

```bash
# Launch Jupyter with uv
uv run jupyter lab
# or open in VS Code / Cursor and select the .venv kernel
```

#### Why use the Notebook?
- **Interactive Prototyping**: Run individual cells independently to inspect intermediate generator batches, layer shapes, and class distribution.
- **Exploratory Data Analysis (EDA)**: Visualize samples and examine dataset characteristics before fitting.
- **Controlled Retraining**: Execute Cell 12 (`model.fit(...)`) when you want to experiment with new hyperparameters, learning rates, or backbones.
- **Individual Sample Testing**: Inspect single CT images interactively with immediate inline display and prediction confidence.

---

## Model Architecture & Training Details

| Parameter | Specification |
| :--- | :--- |
| **Base Model** | Pre-trained **Xception** (ImageNet weights, frozen base) |
| **Input Shape** | `(350, 350, 3)` |
| **Pooling** | `GlobalAveragePooling2D()` |
| **Classification Head** | `Dense(4, activation="softmax")` |
| **Optimizer** | Adam |
| **Loss Function** | Categorical Crossentropy |
| **Batch Size** | 8 |
| **Max Epochs** | 50 (with Early Stopping) |
| **Callbacks** | `EarlyStopping(patience=6)`, `ReduceLROnPlateau(patience=5, factor=0.5)`, `ModelCheckpoint` |

---

## Results & Model Tracker

The project logs all training iterations in [`models/model_tracker.md`](Lung-cancer-model-train/models/model_tracker.md).

### Baseline Run Summary
- **Model Architecture**: Xception + GlobalAveragePooling2D + Dense(4)
- **Training Accuracy**: `93.00%`
- **Validation Accuracy**: `65.62%`
- **Validation Loss**: `0.6547`
- **Checkpoint**: Checkpointed at best validation loss at epoch 42, early stopped at epoch 47.

---

## Acknowledgements

- Dataset provided by the [Chest CT-Scan Images Dataset](https://www.kaggle.com/datasets/mohamedhanyyy/chest-ctscan-images) on Kaggle.
- Built with [TensorFlow](https://www.tensorflow.org/) and [Keras](https://keras.io/).
