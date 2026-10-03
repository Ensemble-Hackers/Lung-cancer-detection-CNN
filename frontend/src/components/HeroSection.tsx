"use client";

import React from "react";
import Link from "next/link";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onLearnMore,
}) => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero-wrapper" id="overview">
      {/* Background Diagonal Cut - Angled slice into Dark Obsidian */}
      <div className="hero-diagonal-cut" />

      {/* Atmospheric Left Radiography Art & Stacked Typography */}
      <div className="hero-side-art left-art" aria-hidden="true">
        {/* Subtle dot matrix grid */}
        <div className="side-dot-grid">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="dot-node" />
          ))}
        </div>

        <div className="side-graphic-lungs">
          <svg viewBox="0 0 240 280" fill="none" className="lungs-xray-svg">
            <defs>
              <radialGradient id="lungGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="bronchialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            <circle cx="120" cy="140" r="100" fill="url(#lungGlow)" />
            {/* Left Lobe */}
            <path d="M110 50 C90 60 40 100 40 170 C40 230 75 255 105 240 C115 235 118 200 118 150 Z" fill="rgba(56, 189, 248, 0.22)" stroke="#38bdf8" strokeWidth="1.6" strokeOpacity="0.7"/>
            {/* Right Lobe */}
            <path d="M130 50 C150 60 200 100 200 170 C200 230 165 255 135 240 C125 235 122 200 122 150 Z" fill="rgba(56, 189, 248, 0.22)" stroke="#38bdf8" strokeWidth="1.6" strokeOpacity="0.7"/>
            {/* Bronchial Tree */}
            <path d="M120 30 L120 95 M120 95 L95 145 M120 95 L145 145 M95 145 L75 190 M95 145 L105 185 M145 145 L165 190 M145 145 L135 185" stroke="url(#bronchialGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Target Nodule Indicator */}
            <rect x="135" y="145" width="46" height="46" fill="rgba(244, 63, 94, 0.08)" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3 3"/>
            <circle cx="158" cy="168" r="9" fill="#f43f5e" fillOpacity="0.5" />
            <circle cx="158" cy="168" r="4" fill="#f43f5e" />
          </svg>
        </div>
      </div>

      {/* Atmospheric Right CT Radiography Art & Stacked Typography */}
      <div className="hero-side-art right-art" aria-hidden="true">
        <div className="side-graphic-ct">
          <svg viewBox="0 0 280 280" fill="none" className="ct-scan-svg">
            <defs>
              <radialGradient id="ctGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#0e7490" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="140" cy="140" r="130" fill="url(#ctGlow)" />
            <circle cx="140" cy="140" r="125" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
            <circle cx="140" cy="140" r="100" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.2" strokeDasharray="4 4"/>
            <circle cx="140" cy="140" r="75" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1"/>
            
            {/* Lungs Contour Axial Slice */}
            <path d="M85 140 C85 95 118 85 140 85 C162 85 195 95 195 140 C195 185 162 205 140 205 C118 205 85 185 85 140 Z" fill="rgba(6, 182, 212, 0.08)" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="1.2"/>
            
            {/* Malignancy Target Box Indicator */}
            <rect x="150" y="105" width="40" height="40" fill="rgba(239, 68, 68, 0.1)" stroke="#f43f5e" strokeWidth="1.5"/>
            <circle cx="170" cy="125" r="7" fill="#f43f5e" fillOpacity="0.75"/>
            <line x1="150" y1="125" x2="190" y2="125" stroke="#f43f5e" strokeWidth="0.8" strokeOpacity="0.7"/>
            <line x1="170" y1="105" x2="170" y2="145" stroke="#f43f5e" strokeWidth="0.8" strokeOpacity="0.7"/>
          </svg>
        </div>
      </div>

      {/* Main Headline & Subtitle */}
      <div className="hero-content">
        <h1 className="hero-headline">
          <div className="hero-title-row">THE DEFINITIVE</div>
          <div className="hero-title-row">
            <span className="hero-headline-highlight">TRI-ENSEMBLE HUB</span>
            <span>FOR NEXT-GEN</span>
          </div>
          <div className="hero-title-row">DIAGNOSTICS</div>
        </h1>

        <p className="hero-subheadline">
          Created by medical AI experts for precision cancer care. Three top deep-learning networks unite with enhanced imaging to hit 90.16% accuracy—leaving zero malignancies behind.
        </p>

        {/* CTA Buttons in Clinical Teal & Obsidian Dark */}
        <div className="hero-actions">
          <a 
            href="#analysis" 
            onClick={(e) => handleScrollTo(e, "analysis")}
            className="hero-btn-teal"
          >
            <span>Get Started</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/>
              <polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>

          <a 
            href="#benchmark" 
            onClick={(e) => handleScrollTo(e, "benchmark")}
            className="hero-btn-obsidian"
          >
            <span>Learn More</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/>
              <polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
        </div>
      </div>

      {/* ====================================================================
          STATIC SHOWCASE DASHBOARD MOCKUP (Exact Match to Clinical Reference)
          ==================================================================== */}
      <div className="showcase-stage-wrapper">
        {/* Floating Top-Left Pill */}
        <div className="floating-stat-card top-pill">
          <div className="up-arrow-circle">&uarr;</div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: "#091a24" }}>347.23%</span>
            <span style={{ fontSize: 9.5, color: "#64748b", fontWeight: 500 }}>vs last month</span>
          </div>
        </div>

        {/* Floating Right Malignancy Risk Card (Exact Match) */}
        <div className="floating-stat-card right-pill-card">
          <div className="floating-stat-label">
            <span>Malignancy Risk (Avg.)</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="12" cy="12" r="9"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          
          <div className="floating-stat-body-split">
            <div className="floating-stat-left-metrics">
              <div className="floating-stat-value">3.7%</div>
              <div className="floating-stat-pill-badge">
                <span className="down-arrow-circle">&darr;</span>
                <span className="badge-perc">-41.22%</span>
              </div>
            </div>

            {/* Smooth Red Area Sparkline */}
            <div className="floating-stat-sparkline-area">
              <svg width="86" height="38" viewBox="0 0 86 38" fill="none">
                <defs>
                  <linearGradient id="redRiskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0 24 C14 26 24 12 40 18 C54 24 66 8 86 14 L86 38 L0 38 Z" 
                  fill="url(#redRiskGradient)" 
                />
                <path 
                  d="M0 24 C14 26 24 12 40 18 C54 24 66 8 86 14" 
                  stroke="#f43f5e" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  fill="none" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* The Dashboard Mockup Window */}
        <div className="static-showcase-window">
          {/* Left Sidebar */}
          <aside className="mockup-sidebar">
            <div className="mockup-user-box">
              <div className="mockup-avatar-circle" style={{ background: "#0c1b24", color: "#38bdf8" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4v16M12 8c-3 0-6 2-6 6a6 6 0 0 0 6 6M12 8c3 0 6 2 6 6a6 6 0 0 1-6 6"/>
                </svg>
              </div>
              <div className="mockup-user-info">
                <span className="mockup-user-name" style={{ fontSize: 12, fontWeight: 700 }}>Pulmo Clinical AI <span style={{ fontSize: 9, opacity: 0.6 }}>&#9662;</span></span>
                <span className="mockup-user-role" style={{ fontSize: 10, color: "#64748b" }}>Research/Clinical</span>
              </div>
            </div>

            <nav className="mockup-nav">
              <div className="mockup-nav-item active" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                <span>Overview</span>
              </div>
              <div className="mockup-nav-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                </svg>
                <span>CT Scans</span>
              </div>
              <div className="mockup-nav-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10M12 20V4M6 20v-6"/>
                </svg>
                <span>Analysis</span>
              </div>
              <div className="mockup-nav-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
                <span>Integrations</span>
              </div>
              <div className="mockup-nav-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <span>Settings</span>
              </div>
            </nav>
          </aside>

          {/* Main Dashboard Canvas */}
          <main className="mockup-main">
            {/* Top Bar inside Mockup */}
            <div className="mockup-header-row">
              <div className="mockup-title-pills">
                <span className="mockup-page-title" style={{ fontSize: 16, fontWeight: 800, color: "#091a24" }}>Overview</span>
                <div className="mockup-tab-pill active" style={{ background: "#e0f2fe", color: "#0369a1", fontWeight: 700 }}>CT Scan Analysis</div>
                <div className="mockup-tab-pill">Nodule Detection</div>
                <div className="mockup-tab-pill">Model Ensemble</div>
                <div className="mockup-tab-pill">Clinical Report</div>
              </div>

              <div className="mockup-date-range">
                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "var(--font-mono)" }}>📅 2024-08-06 → 2024-08-12</span>
                <div className="mockup-period-pill">1D</div>
                <div className="mockup-period-pill" style={{ background: "#e0f2fe", color: "#0369a1", fontWeight: 700 }}>7D</div>
                <div className="mockup-period-pill">1M</div>
              </div>
            </div>

            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#091a24", margin: "14px 0 10px" }}>
              Lung Cancer Detection Report
            </div>

            {/* 6 Key Clinical Cards Grid (2 rows x 3 columns) */}
            <div className="mockup-metrics-grid">
              {/* Card 1: CT Scans Analyzed */}
              <div className="mockup-stat-cell">
                <div className="mockup-stat-header">
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16M12 8c-3 0-6 2-6 6a6 6 0 0 0 6 6M12 8c3 0 6 2 6 6a6 6 0 0 1-6 6"/></svg>
                  </div>
                  <div>
                    <span className="cell-label">CT SCANS ANALYZED</span>
                    <div className="cell-value">3,639</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>&uarr; +234.45%</span>
                  <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
                    <path d="M0 12 Q15 4 30 10 T60 6" stroke="#0284c7" strokeWidth="1.8" fill="none"/>
                  </svg>
                </div>
              </div>

              {/* Card 2: Nodules Detected */}
              <div className="mockup-stat-cell">
                <div className="mockup-stat-header">
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  </div>
                  <div>
                    <span className="cell-label">NODULES DETECTED</span>
                    <div className="cell-value">412</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>&uarr; +187.32%</span>
                  <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
                    <path d="M0 14 Q20 2 40 8 T60 4" stroke="#088395" strokeWidth="1.8" fill="none"/>
                  </svg>
                </div>
              </div>

              {/* Card 3: High Malignancy Risk */}
              <div className="mockup-stat-cell">
                <div className="mockup-stat-header">
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div>
                    <span className="cell-label">HIGH MALIGNANCY RISK</span>
                    <div className="cell-value" style={{ color: "#e11d48" }}>86</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: "#64748b" }}>2.37% of scans</span>
                  <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
                    <path d="M0 10 Q15 14 30 6 T60 12" stroke="#e11d48" strokeWidth="1.8" fill="none"/>
                  </svg>
                </div>
              </div>

              {/* Card 4: Detection Confidence */}
              <div className="mockup-stat-cell">
                <div className="mockup-stat-header">
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div>
                    <span className="cell-label">DETECTION CONFIDENCE</span>
                    <div className="cell-value" style={{ color: "#059669" }}>90.16%</div>
                  </div>
                </div>
                <span style={{ fontSize: 9.5, color: "#64748b", marginTop: 6 }}>Tri-Ensemble (Xception + EffNetV2-S + DenseNet121)</span>
              </div>

              {/* Card 5: Avg. Processing Time */}
              <div className="mockup-stat-cell">
                <div className="mockup-stat-header">
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center", color: "#0d9488" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </div>
                  <div>
                    <span className="cell-label">AVG. PROCESSING TIME</span>
                    <div className="cell-value">2.3s</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 9.5, color: "#64748b" }}>per CT scan</span>
                  {/* Mini Equalizer Bars */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16 }}>
                    <div style={{ width: 3, height: 8, background: "#a5f3fc", borderRadius: 1 }} />
                    <div style={{ width: 3, height: 12, background: "#38bdf8", borderRadius: 1 }} />
                    <div style={{ width: 3, height: 16, background: "#0284c7", borderRadius: 1 }} />
                    <div style={{ width: 3, height: 10, background: "#38bdf8", borderRadius: 1 }} />
                    <div style={{ width: 3, height: 6, background: "#a5f3fc", borderRadius: 1 }} />
                  </div>
                </div>
              </div>

              {/* Card 6: Model Ensemble */}
              <div className="mockup-stat-cell">
                <div className="mockup-stat-header">
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  </div>
                  <div>
                    <span className="cell-label">MODEL ENSEMBLE</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 2, fontSize: 10, color: "#334155" }}>
                      <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span><b style={{ color: "#ef4444" }}>&bull;</b> Xception</span>
                        <b style={{ fontFamily: "var(--font-mono)" }}>89.4%</b>
                      </span>
                      <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span><b style={{ color: "#f59e0b" }}>&bull;</b> EfficientNetV2-S</span>
                        <b style={{ fontFamily: "var(--font-mono)" }}>90.1%</b>
                      </span>
                      <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span><b style={{ color: "#0d9488" }}>&bull;</b> DenseNet121</span>
                        <b style={{ fontFamily: "var(--font-mono)" }}>91.0%</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};
