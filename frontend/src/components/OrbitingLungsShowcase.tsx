"use client";

import React from "react";

export const OrbitingLungsShowcase: React.FC = () => {
  return (
    <div className="orbit-showcase-wrapper">
      {/* Background Ambience & Orbital Guide Rings */}
      <div className="orbit-rings-layer">
        {/* Outer Guide Ring */}
        <div className="orbit-ring ring-outer" />
        {/* Mid Guide Ring */}
        <div className="orbit-ring ring-mid" />
        {/* Inner Lungs Glow Backdrop */}
        <div className="orbit-center-glow" />

        {/* Ambient Decorative Stars & Crosses from Reference Design */}
        <span className="orbit-sparkle sp-1">✦</span>
        <span className="orbit-sparkle sp-2">✦</span>
        <span className="orbit-sparkle sp-3">+</span>
        <span className="orbit-sparkle sp-4">+</span>
        <span className="orbit-sparkle sp-5">✦</span>

        {/* Stationary Orbital Satellite Dots */}
        <span className="orbit-dot dot-1" />
        <span className="orbit-dot dot-2" />
        <span className="orbit-dot dot-3" />
        <span className="orbit-dot dot-4" />
      </div>

      {/* STATIC CENTRAL LUNGS (Stationary - Does NOT Rotate) */}
      <div className="orbit-center-lungs">
        {/* Instant High-Definition Vector Lungs (Zero latency, never breaks) */}
        <div className="orbit-lungs-vector-wrap">
          <svg viewBox="0 0 160 160" fill="none" className="orbit-lungs-svg">
            <defs>
              <radialGradient id="orbitLungsCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="lungLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="lungRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="tracheaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Ambient Pulmonary Glow Core */}
            <circle cx="80" cy="88" r="54" fill="url(#orbitLungsCenterGlow)" />

            {/* Trachea & Primary Bronchial Tree */}
            <path d="M80 18 L80 64 M80 64 L62 90 M80 64 L98 90 M62 90 L48 114 M62 90 L70 112 M98 90 L112 114 M98 90 L90 112" 
              stroke="url(#tracheaGrad)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Tracheal Cartilage Rings */}
            <line x1="74" y1="24" x2="86" y2="24" stroke="#e0f2fe" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
            <line x1="74" y1="31" x2="86" y2="31" stroke="#e0f2fe" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
            <line x1="74" y1="38" x2="86" y2="38" stroke="#e0f2fe" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
            <line x1="74" y1="45" x2="86" y2="45" stroke="#e0f2fe" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
            <line x1="75" y1="52" x2="85" y2="52" stroke="#e0f2fe" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />

            {/* Left Pulmonary Lobe (Anatomical Margin) */}
            <path d="M72 44 C60 48 30 70 28 108 C26 138 48 152 68 142 C78 138 78 116 76 86 Z" 
              fill="url(#lungLeftGrad)" stroke="#38bdf8" strokeWidth="1.6" />
            
            {/* Right Pulmonary Lobe (Anatomical Margin) */}
            <path d="M88 44 C100 48 130 70 132 108 C134 138 112 152 92 142 C82 138 82 116 84 86 Z" 
              fill="url(#lungRightGrad)" stroke="#38bdf8" strokeWidth="1.6" />

            {/* Micro Bronchial Arbors & Vascular Trees */}
            <path d="M48 114 L38 126 M48 114 L52 130 M70 112 L66 128 M112 114 L122 126 M112 114 L108 130 M90 112 L94 128" 
              stroke="#e0f2fe" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />

            {/* Sub-alveolar Shimmer Nodes */}
            <circle cx="50" cy="100" r="2.2" fill="#bae6fd" opacity="0.9" />
            <circle cx="110" cy="100" r="2.2" fill="#bae6fd" opacity="0.9" />
            <circle cx="62" cy="125" r="1.8" fill="#bae6fd" opacity="0.8" />
            <circle cx="98" cy="125" r="1.8" fill="#bae6fd" opacity="0.8" />
          </svg>
        </div>

        {/* 3D Photorealistic Glassmorphic Lungs Texture Overlay */}
        <img 
          src="/lungs_bg.png" 
          alt="Thoracic Lung Anatomy" 
          className="orbit-lungs-image" 
          loading="eager"
          decoding="async"
        />
        <div className="orbit-lungs-breath-glow" />
      </div>

      {/* ROTATING ORBITAL LAYER (Carries the 5 cards around the circle) */}
      <div className="orbit-rotating-ring">
        {/* 1. TOP: CT Scan Analysis */}
        <div className="orbit-card-slot slot-top">
          <div className="orbit-card-content">
            <div className="orbit-card-icon icon-scanner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1.5" fill="#0284c7" />
                <line x1="12" y1="3" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="21" />
              </svg>
            </div>
            <div className="orbit-card-text">
              <span className="card-title">CT Scan</span>
              <span className="card-subtitle">Analysis</span>
            </div>
          </div>
        </div>

        {/* 2. TOP-RIGHT: Risk Prediction */}
        <div className="orbit-card-slot slot-top-right">
          <div className="orbit-card-content">
            <div className="orbit-card-icon icon-risk">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
                <path d="M4 20h16" />
              </svg>
            </div>
            <div className="orbit-card-text">
              <span className="card-title">Risk</span>
              <span className="card-subtitle">Prediction</span>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM-RIGHT: Clinical Insights */}
        <div className="orbit-card-slot slot-bottom-right">
          <div className="orbit-card-content">
            <div className="orbit-card-icon icon-clinical">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <div className="orbit-card-text">
              <span className="card-title">Clinical</span>
              <span className="card-subtitle">Insights</span>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM-LEFT: Tri-Ensemble AI Models */}
        <div className="orbit-card-slot slot-bottom-left">
          <div className="orbit-card-content">
            <div className="orbit-card-icon icon-ensemble">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <circle cx="5" cy="6" r="2.5" />
                <circle cx="19" cy="6" r="2.5" />
                <circle cx="6" cy="18" r="2.5" />
                <circle cx="18" cy="18" r="2.5" />
                <line x1="7.2" y1="7.5" x2="10" y2="10.2" />
                <line x1="16.8" y1="7.5" x2="14" y2="10.2" />
                <line x1="8" y1="16.5" x2="10.2" y2="13.8" />
                <line x1="16" y1="16.5" x2="13.8" y2="13.8" />
              </svg>
            </div>
            <div className="orbit-card-text">
              <span className="card-title">Tri-Ensemble</span>
              <span className="card-subtitle">AI Models</span>
            </div>
          </div>
        </div>

        {/* 5. TOP-LEFT: Nodule Detection */}
        <div className="orbit-card-slot slot-top-left">
          <div className="orbit-card-content">
            <div className="orbit-card-icon icon-nodule">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <circle cx="11" cy="11" r="3.5" stroke="#38bdf8" strokeDasharray="2 2" />
              </svg>
            </div>
            <div className="orbit-card-text">
              <span className="card-title">Nodule</span>
              <span className="card-subtitle">Detection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Curvilinear Callout Annotations (matching reference) */}
      <div className="orbit-callout callout-top-right">
        <span className="callout-text">
          Earlier<br />
          Detection<br />
          Brighter<br />
          Tomorrows
        </span>
        <svg width="32" height="38" viewBox="0 0 32 38" fill="none" className="callout-arrow">
          <path d="M4 4 C18 4, 28 16, 24 32" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M19 26 L24 32 L30 28" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="orbit-callout callout-bottom-left">
        <svg width="32" height="38" viewBox="0 0 32 38" fill="none" className="callout-arrow">
          <path d="M26 34 C12 34, 4 22, 8 6" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M3 12 L8 6 L14 10" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="callout-text">
          AI<br />
          for<br />
          Lungs<br />
          for<br />
          Lives
        </span>
      </div>
    </div>
  );
};
