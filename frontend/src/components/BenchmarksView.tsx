"use client";

import React from "react";
import { ChartIcon, ActivityIcon, ShieldCheckIcon } from "@/components/Icons";
import { BENCHMARK_EVOLUTION } from "@/lib/constants";

export const BenchmarksView: React.FC = () => {
  return (
    <div className="benchmark-layout">
      {/* Metric Tiles */}
      <div className="stats-grid-row">
        <div className="stat-metric-card">
          <span className="stat-label">Holdout Test Accuracy</span>
          <span className="stat-number" style={{ color: "var(--normal-color)" }}>90.16%</span>
          <span className="stat-subtext">284 of 315 independent patient scans</span>
        </div>
        <div className="stat-metric-card">
          <span className="stat-label">Malignancy Sensitivity</span>
          <span className="stat-number" style={{ color: "var(--accent-cyan)" }}>99.62%</span>
          <span className="stat-subtext">260 of 261 cancers detected (0 missed)</span>
        </div>
        <div className="stat-metric-card">
          <span className="stat-label">Healthy Specificity</span>
          <span className="stat-number" style={{ color: "var(--normal-color)" }}>98.15%</span>
          <span className="stat-subtext">53 of 54 healthy controls confirmed</span>
        </div>
        <div className="stat-metric-card">
          <span className="stat-label">False Normal Diagnoses</span>
          <span className="stat-number" style={{ color: "var(--accent-cyan)" }}>0 (Zero)</span>
          <span className="stat-subtext">Zero malignant scans mislabeled as healthy</span>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="studio-panel">
        <div className="panel-header">
          <span className="panel-title">
            <ChartIcon size={16} />
            <span>Multi-Class Holdout Confusion Matrix (315 Independent Patients)</span>
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>Macro F1: 90.87%</span>
        </div>

        <div className="table-container">
          <table className="cm-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Ground Truth \ Predicted</th>
                <th>Adeno</th>
                <th>Large Cell</th>
                <th>Normal (Healthy)</th>
                <th>Squamous</th>
                <th style={{ borderLeft: "2px solid var(--border-medium)" }}>Sensitivity (Recall)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: "left", fontWeight: 600 }}>Adenocarcinoma (120)</td>
                <td className="cm-cell-hit">104</td>
                <td className="cm-cell-err">5</td>
                <td className="cm-cell-zero">0</td>
                <td className="cm-cell-err">11</td>
                <td className="mono-cell" style={{ borderLeft: "2px solid var(--border-medium)", fontWeight: 600 }}>86.67% (104/120)</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", fontWeight: 600 }}>Large Cell Carcinoma (51)</td>
                <td className="cm-cell-err">4</td>
                <td className="cm-cell-hit">44</td>
                <td className="cm-cell-zero">0</td>
                <td className="cm-cell-err">3</td>
                <td className="mono-cell" style={{ borderLeft: "2px solid var(--border-medium)", fontWeight: 600 }}>86.27% (44/51)</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", fontWeight: 600 }}>Normal Healthy (54)</td>
                <td className="cm-cell-zero">0</td>
                <td className="cm-cell-err">1</td>
                <td className="cm-cell-hit">53</td>
                <td className="cm-cell-zero">0</td>
                <td className="mono-cell" style={{ borderLeft: "2px solid var(--border-medium)", fontWeight: 600, color: "var(--normal-color)" }}>98.15% (53/54)</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", fontWeight: 600 }}>Squamous Cell Carcinoma (90)</td>
                <td className="cm-cell-err">7</td>
                <td className="cm-cell-zero">0</td>
                <td className="cm-cell-zero">0</td>
                <td className="cm-cell-hit">83</td>
                <td className="mono-cell" style={{ borderLeft: "2px solid var(--border-medium)", fontWeight: 600 }}>92.22% (83/90)</td>
              </tr>
            </tbody>
            <tfoot>
              <tr style={{ background: "var(--bg-surface-elevated)", fontWeight: 700 }}>
                <td style={{ textAlign: "left" }}>Precision</td>
                <td className="mono-cell">90.43%</td>
                <td className="mono-cell">88.00%</td>
                <td className="mono-cell" style={{ color: "var(--normal-color)" }}>100.00%</td>
                <td className="mono-cell">85.57%</td>
                <td className="mono-cell" style={{ borderLeft: "2px solid var(--border-medium)", color: "var(--accent-cyan)" }}>Overall: 90.16%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Evolution Table */}
      <div className="studio-panel">
        <div className="panel-header">
          <span className="panel-title">
            <ActivityIcon size={16} />
            <span>Architectural Evolution: Step-by-Step Milestones</span>
          </span>
        </div>

        <div className="table-container">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Iteration</th>
                <th>Architectural Configuration</th>
                <th>Test Accuracy (315 Scans)</th>
                <th>Cancer Recall</th>
                <th>False Normal Miscalls</th>
                <th>Clinical Assessment</th>
              </tr>
            </thead>
            <tbody>
              {BENCHMARK_EVOLUTION.map((row) => (
                <tr 
                  key={row.iteration}
                  style={row.iteration.includes("Final") ? { background: "rgba(16, 185, 129, 0.08)", borderLeft: "3px solid var(--normal-color)" } : undefined}
                >
                  <td className="mono-cell" style={row.iteration.includes("Final") ? { fontWeight: 700, color: "var(--normal-color)" } : undefined}>
                    {row.iteration}
                  </td>
                  <td style={row.iteration.includes("Final") ? { fontWeight: 600 } : undefined}>{row.name}</td>
                  <td className="mono-cell" style={row.iteration.includes("Final") ? { fontWeight: 700, color: "var(--normal-color)" } : undefined}>
                    {row.accuracy}
                  </td>
                  <td className="mono-cell" style={row.iteration.includes("Final") ? { fontWeight: 700, color: "var(--normal-color)" } : undefined}>
                    {row.recall}
                  </td>
                  <td className="mono-cell" style={{ color: row.missed.startsWith("0") ? "var(--normal-color)" : "#f87171" }}>
                    {row.missed}
                  </td>
                  <td style={{ color: row.iteration.includes("Final") ? "var(--normal-color)" : "var(--text-muted)" }}>
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
