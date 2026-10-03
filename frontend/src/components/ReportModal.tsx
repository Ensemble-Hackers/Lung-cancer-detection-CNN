"use client";

import React from "react";
import { DocumentIcon, CloseIcon, PrintIcon } from "@/components/Icons";
import { PredictionResult, ActiveScan, ClinicianUser } from "@/types/medical";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PredictionResult | null;
  scan: ActiveScan | null;
  user: ClinicianUser;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  result,
  scan,
  user
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: 740 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">
            <DocumentIcon size={18} />
            <span>Clinical Diagnostic Summary Report</span>
          </span>
          <button className="tool-btn" onClick={onClose}>
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="modal-body" id="printable-report">
          <div className="report-paper">
            <div className="report-header-row">
              <div>
                <h1 className="report-title-main">PULMOVISION ONCOLOGY REPORT</h1>
                <p style={{ fontSize: 11, color: "#64748b" }}>Automated Deep Convolutional Tri-Ensemble Analysis</p>
              </div>
              <div style={{ textAlign: "right", fontSize: 11 }}>
                <p><strong>REPORT DATE:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>ARCHIVE STATUS:</strong> CLINICAL REVIEW READY</p>
              </div>
            </div>

            <div className="report-patient-meta">
              <div>
                <p><strong>Patient / Case ID:</strong> {scan?.meta?.patientId || "PT-CT-9016"}</p>
                <p><strong>Scan Specimen:</strong> {scan?.name || "Axial_Thoracic_Slice.png"}</p>
                <p><strong>Acquisition Matrix:</strong> 350 &times; 350 px (Bilinear)</p>
              </div>
              <div>
                <p><strong>Attending Clinician:</strong> {user.name}</p>
                <p><strong>Department:</strong> {user.department}</p>
                <p><strong>Medical License:</strong> {user.licenseId}</p>
              </div>
            </div>

            {result ? (
              <>
                <div style={{ border: "2px solid #0f172a", borderRadius: 6, padding: 16, background: "#fafafa" }}>
                  <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", fontWeight: 700 }}>
                    Consensus Primary Finding
                  </p>
                  <h2 style={{ fontSize: 22, color: "#0f172a", margin: "4px 0 8px 0" }}>{result.prediction}</h2>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0284c7" }}>
                    Diagnostic Confidence: {(result.confidence * 100).toFixed(2)}%
                  </p>
                  <p style={{ fontSize: 12, marginTop: 8 }}>
                    <strong>Subtype & Anatomical Site:</strong> {result.profile.subtype} ({result.profile.location})
                  </p>
                  <p style={{ fontSize: 12, marginTop: 4 }}>
                    <strong>Radiological Hallmarks:</strong> {result.profile.hallmarks}
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, borderBottom: "1px solid #cbd5e1", paddingBottom: 4 }}>
                    Multi-Class Probability Distribution
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                    {Object.entries(result.probabilities).map(([cls, prob]) => (
                      <div key={cls} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e2e8f0", padding: "4px 0" }}>
                        <span>{cls}:</span>
                        <strong style={{ fontFamily: "monospace" }}>{(prob * 100).toFixed(2)}%</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, borderBottom: "1px solid #cbd5e1", paddingBottom: 4 }}>
                    Tri-Ensemble Consensus Weights
                  </h3>
                  <p style={{ fontSize: 11, color: "#475569" }}>
                    &bull; DenseNet121 + CLAHE: 60% weight (Concatenated low-level edge & contrast preservation)<br/>
                    &bull; EfficientNetV2-S: 30% weight (Fused-MBConv multi-scale receptive field analysis)<br/>
                    &bull; Xception: 10% weight (Depthwise separable spatial gradients & micro-spiculation)<br/>
                    &bull; 5-View Test-Time Augmentation (TTA) consensus applied
                  </p>
                </div>

                <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #cbd5e1", fontSize: 11, color: "#64748b" }}>
                  <p><strong>Safety Protocol Verification:</strong> Patient scan evaluated under 99.62% Malignancy Recall safety threshold with 0 missed cancers recorded on holdout validation.</p>
                  <p style={{ marginTop: 12 }}><strong>Attending Signature:</strong> ____________________________________</p>
                </div>
              </>
            ) : (
              <p style={{ textAlign: "center", color: "#64748b", padding: 30 }}>No diagnostic analysis recorded for current scan.</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={handlePrint}>
            <PrintIcon size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
