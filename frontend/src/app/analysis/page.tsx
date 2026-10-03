"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { DiagnosticStudio } from "@/components/DiagnosticStudio";
import { ReportModal } from "@/components/ReportModal";
import { AuthModal } from "@/components/AuthModal";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { PredictionResult, ActiveScan, ClinicianUser } from "@/types/medical";
import { SAMPLE_SCANS } from "@/lib/constants";

export default function AnalysisPage() {
  const [user, setUser] = useState<ClinicianUser>({
    name: "Dr. S. Mukherjee, MD",
    role: "Chief of Thoracic Radiology & Oncology",
    department: "Pulmonary Diagnostic Center",
    licenseId: "RAD-8820-ONC",
    badgeNumber: "HACK-2026-V1",
    isLoggedIn: true
  });

  const [activeScan, setActiveScan] = useState<ActiveScan | null>({
    name: `${SAMPLE_SCANS[0].patientId} (${SAMPLE_SCANS[0].title})`,
    dataUrl: SAMPLE_SCANS[0].path,
    isSample: true,
    sampleId: SAMPLE_SCANS[0].id,
    meta: SAMPLE_SCANS[0]
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Header 
        user={user} 
        onOpenAuth={() => setAuthOpen(true)} 
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      <main className="workstation-section">
        <div className="section-header-title">
          <span>PulmoVision Diagnostic Workstation</span>
          <span className="tag">Live Tri-Ensemble Consensus</span>
        </div>

        <DiagnosticStudio 
          onOpenReport={() => setReportOpen(true)}
          result={result}
          setResult={setResult}
          activeScan={activeScan}
          setActiveScan={setActiveScan}
        />
      </main>

      <NavigationDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />

      <ReportModal 
        isOpen={reportOpen} 
        onClose={() => setReportOpen(false)} 
        result={result}
        scan={activeScan}
        user={user}
      />

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        user={user}
        onSaveUser={setUser}
      />
    </>
  );
}
