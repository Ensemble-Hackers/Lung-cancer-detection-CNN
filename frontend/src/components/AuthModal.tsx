"use client";

import React, { useState } from "react";
import { LockIcon, CloseIcon, CheckIcon } from "@/components/Icons";
import { ClinicianUser } from "@/types/medical";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ClinicianUser;
  onSaveUser: (updated: ClinicianUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser
}) => {
  const [name, setName] = useState(user.name);
  const [licenseId, setLicenseId] = useState(user.licenseId);
  const [role, setRole] = useState(user.role);
  const [department, setDepartment] = useState(user.department);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveUser({
      ...user,
      name,
      licenseId,
      role,
      department
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">
            <LockIcon size={18} />
            <span>Clinician Access & Session Management</span>
          </span>
          <button className="tool-btn" onClick={onClose}>
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "var(--bg-surface-elevated)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-md)" }}>
            <div className="avatar-initials" style={{ width: 48, height: 48, fontSize: 16 }}>
              {name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{name}</span>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{role}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-cyan)" }}>
                {licenseId} &bull; {department}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="section-label">Clinician Identity & Permissions</span>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>FULL NAME & CREDENTIALS</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "8px 12px", fontSize: 13, color: "#fff" }} 
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>MEDICAL LICENSE / PACS OPERATOR ID</label>
              <input 
                type="text" 
                value={licenseId} 
                onChange={(e) => setLicenseId(e.target.value)} 
                style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "8px 12px", fontSize: 13, color: "#fff", fontFamily: "var(--font-mono)" }} 
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>CLINICAL ROLE / ACCESS TIER</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "8px 12px", fontSize: 13, color: "#fff" }}
              >
                <option value="Chief of Thoracic Radiology & Oncology">Chief of Thoracic Radiology & Oncology</option>
                <option value="Attending Pulmonologist">Attending Pulmonologist</option>
                <option value="Oncology Fellow / Resident">Oncology Fellow / Resident</option>
                <option value="Research Investigator">Research Investigator</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>DEPARTMENT / HOSPITAL SITE</label>
              <input 
                type="text" 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)} 
                style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "8px 12px", fontSize: 13, color: "#fff" }} 
              />
            </div>
          </div>

          <div style={{ padding: 12, background: "rgba(56, 189, 248, 0.05)", border: "1px dashed rgba(56, 189, 248, 0.25)", borderRadius: "var(--radius-sm)", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong>V1 Modular Authentication Architecture:</strong>
            Session state is preserved in reactive memory. Ready for plug-and-play connection with hospital Active Directory, OAuth 2.0, or DICOM PACS identity providers in upcoming milestones.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            <CheckIcon size={16} />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
