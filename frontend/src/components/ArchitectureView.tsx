"use client";

import React, { useState } from "react";
import { NetworkIcon, ScanIcon, ChevronRightIcon, SlidersIcon, LayersIcon, ChartIcon, ContrastIcon } from "@/components/Icons";

export const ArchitectureView: React.FC = () => {
  const [densenet, setDensenet] = useState(60);
  const [effnet, setEffnet] = useState(30);
  const [xception, setXception] = useState(10);

  return (
    <div className="benchmark-layout">
      {/* Visual Pipeline Flow */}
      <div className="arch-diagram-card">
        <div className="panel-header">
          <span className="panel-title">
            <NetworkIcon size={16} />
            <span>Tri-Ensemble Deep Learning Pipeline Architecture</span>
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-cyan)" }}>
            Input Resolution: 350x350x3
          </span>
        </div>

        <div className="pipeline-flow">
          <div className="pipeline-node">
            <span className="pipeline-node-title">
              <ScanIcon size={16} />
              <span>1. Axial Thoracic CT</span>
            </span>
            <span className="pipeline-node-sub">
              Raw DICOM/PNG slices resized to 350x350 resolution to preserve micro-spiculation and ground-glass opacities (GGOs).
            </span>
          </div>

          <div className="pipeline-arrow"><ChevronRightIcon size={20} /></div>

          <div className="pipeline-node">
            <span className="pipeline-node-title">
              <SlidersIcon size={16} />
              <span>2. 5-View TTA</span>
            </span>
            <span className="pipeline-node-sub">
              Generates 5 augmented perspectives during inference: Original, Bilateral Flip, 5% Central Zoom, +15% Contrast, and -15% Contrast.
            </span>
          </div>

          <div className="pipeline-arrow"><ChevronRightIcon size={20} /></div>

          <div className="pipeline-node" style={{ borderColor: "var(--accent-cyan)", background: "rgba(56, 189, 248, 0.05)" }}>
            <span className="pipeline-node-title" style={{ color: "var(--accent-cyan)" }}>
              <LayersIcon size={16} />
              <span>3. Multi-Backbone</span>
            </span>
            <span className="pipeline-node-sub">
              &bull; <strong>DenseNet121 + CLAHE (60%)</strong>: Dense feature reuse<br/>
              &bull; <strong>EfficientNetV2-S (30%)</strong>: Fused-MBConv multi-scale<br/>
              &bull; <strong>Xception (10%)</strong>: Separable spatial gradients
            </span>
          </div>

          <div className="pipeline-arrow"><ChevronRightIcon size={20} /></div>

          <div className="pipeline-node">
            <span className="pipeline-node-title">
              <ChartIcon size={16} />
              <span>4. Soft Consensus</span>
            </span>
            <span className="pipeline-node-sub">
              Bayesian-weighted probability fusion yielding 90.16% holdout accuracy and 0 missed cancers across 315 test patients.
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Weight Consensus Sandbox */}
      <div className="studio-panel">
        <div className="panel-header">
          <span className="panel-title">
            <SlidersIcon size={16} />
            <span>Interactive Ensemble Weight Consensus Sandbox</span>
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
            Current: {densenet}% DenseNet + {effnet}% EffNet + {xception}% Xception
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, padding: "12px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>DenseNet121 + CLAHE Weight</span>
              <span className="mono-cell">{densenet}%</span>
            </div>
            <input 
              type="range" 
              min={10} 
              max={80} 
              value={densenet} 
              onChange={(e) => setDensenet(Number(e.target.value))} 
              style={{ accentColor: "var(--adeno-color)" }} 
            />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Captures soft-tissue contrast and low-level edge textures without gradient dilution.
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>EfficientNetV2-S Weight</span>
              <span className="mono-cell">{effnet}%</span>
            </div>
            <input 
              type="range" 
              min={10} 
              max={80} 
              value={effnet} 
              onChange={(e) => setEffnet(Number(e.target.value))} 
              style={{ accentColor: "var(--squamous-color)" }} 
            />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Fused-MBConv blocks with multi-scale receptive field analysis for lobe anatomy.
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>Xception Weight</span>
              <span className="mono-cell">{xception}%</span>
            </div>
            <input 
              type="range" 
              min={5} 
              max={50} 
              value={xception} 
              onChange={(e) => setXception(Number(e.target.value))} 
              style={{ accentColor: "var(--large-cell-color)" }} 
            />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Depthwise separable convolutions capturing peripheral nodule spiculations.
            </span>
          </div>
        </div>

        <div style={{ padding: 14, background: "rgba(21, 27, 39, 0.6)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-mono)", fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Mathematical Formulation:</span>
          <span style={{ color: "var(--accent-cyan)" }}>
            P_final = ({(densenet/100).toFixed(2)} &times; P_dense) + ({(effnet/100).toFixed(2)} &times; P_eff) + ({(xception/100).toFixed(2)} &times; P_xc)
          </span>
        </div>
      </div>

      {/* CLAHE & TTA Specs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="studio-panel">
          <div className="panel-header">
            <span className="panel-title">
              <ContrastIcon size={16} />
              <span>CLAHE Contrast Equalization</span>
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Standard 8-bit CT image exports frequently wash out soft-tissue density variations.
            PulmoVision AI transforms each axial slice into the <strong>LAB color space</strong>,
            applies Contrast-Limited Adaptive Histogram Equalization with a <strong>2.0 clip limit on an 8&times;8 tile grid</strong>
            to the L (Luminance) channel, and converts back to RGB before DenseNet ingestion.
          </p>
          <ul style={{ fontSize: 12, color: "var(--text-muted)", paddingLeft: 18, lineHeight: 1.6 }}>
            <li>Amplifies subtle ground-glass opacities (GGOs) characteristic of Adenocarcinoma.</li>
            <li>Delineates irregular spicular boundaries distinguishing benign from malignant margins.</li>
          </ul>
        </div>

        <div className="studio-panel">
          <div className="panel-header">
            <span className="panel-title">
              <SlidersIcon size={16} />
              <span>5-View Test-Time Augmentation (TTA)</span>
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            During diagnosis, each input CT scan undergoes 5 deterministic transformations:
          </p>
          <ul style={{ fontSize: 12, color: "var(--text-muted)", paddingLeft: 18, lineHeight: 1.6 }}>
            <li><strong>Original</strong>: Baseline unmanipulated scan.</li>
            <li><strong>Bilateral Flip</strong>: Leverages thoracic anatomical symmetry.</li>
            <li><strong>5% Central Zoom</strong>: Magnifies central bronchus & hilar lymphatics.</li>
            <li><strong>Contrast Plus (+15%)</strong>: Exposes dense calcified tumor cores.</li>
            <li><strong>Contrast Minus (-15%)</strong>: Reveals peripheral hazy infiltrates.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
