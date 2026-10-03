"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ArchitectureView } from "@/components/ArchitectureView";
import { AuthModal } from "@/components/AuthModal";
import { ClinicianUser } from "@/types/medical";

export default function ArchitecturePage() {
  const [user, setUser] = useState<ClinicianUser>({
    name: "Dr. S. Mukherjee, MD",
    role: "Chief of Thoracic Radiology & Oncology",
    department: "Pulmonary Diagnostic Center",
    licenseId: "RAD-8820-ONC",
    badgeNumber: "HACK-2026-V1",
    isLoggedIn: true
  });

  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Header user={user} onOpenAuth={() => setAuthOpen(true)} />
      <main className="main-content">
        <ArchitectureView />
      </main>
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        user={user}
        onSaveUser={setUser}
      />
    </>
  );
}
