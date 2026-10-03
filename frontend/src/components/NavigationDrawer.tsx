"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ScanIcon, 
  ActivityIcon, 
  SettingsIcon, 
  CloseIcon, 
  LungIcon,
  ChevronRightIcon 
} from "@/components/Icons";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside 
        className="drawer-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <div className="brand-badge-box" style={{ padding: "6px 10px" }}>
              <span className="brand-badge-title" style={{ fontSize: 16 }}>Pulmo</span>
              <span className="brand-badge-sub" style={{ fontSize: 7 }}>CLINICAL AI</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>PulmoVision</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>v1.0 Workstation</span>
            </div>
          </div>

          <button 
            className="tool-btn" 
            onClick={onClose}
            title="Close Menu"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Top Primary Pages: Overview & Analysis */}
          <div className="drawer-section">
            <span className="drawer-section-label">Primary Navigation</span>

            <nav className="drawer-nav-list">
              <Link 
                href="/" 
                className={`drawer-nav-item ${pathname === "/" ? "active" : ""}`}
                onClick={onClose}
              >
                <div className="drawer-item-icon">
                  <ScanIcon size={18} />
                </div>
                <div className="drawer-item-text">
                  <span className="drawer-item-title">Overview</span>
                  <span className="drawer-item-desc">Hero overview & static clinical showcase</span>
                </div>
                <ChevronRightIcon size={14} className="drawer-chevron" />
              </Link>

              <Link 
                href="/analysis" 
                className={`drawer-nav-item ${pathname === "/analysis" ? "active" : ""}`}
                onClick={onClose}
              >
                <div className="drawer-item-icon">
                  <ActivityIcon size={18} />
                </div>
                <div className="drawer-item-text">
                  <span className="drawer-item-title">Analysis</span>
                  <span className="drawer-item-desc">Interactive CT workstation & consensus diagnosis</span>
                </div>
                <ChevronRightIcon size={14} className="drawer-chevron" />
              </Link>
            </nav>
          </div>

          {/* Clean Divider */}
          <div className="drawer-divider" />

          {/* Bottom Settings Group */}
          <div className="drawer-section">
            <span className="drawer-section-label">System Preferences</span>

            <nav className="drawer-nav-list">
              <Link 
                href="/settings" 
                className={`drawer-nav-item ${pathname === "/settings" ? "active" : ""}`}
                onClick={onClose}
              >
                <div className="drawer-item-icon">
                  <SettingsIcon size={18} />
                </div>
                <div className="drawer-item-text">
                  <span className="drawer-item-title">Settings</span>
                  <span className="drawer-item-desc">Clinician profile, PACS config & telemetry</span>
                </div>
                <ChevronRightIcon size={14} className="drawer-chevron" />
              </Link>
            </nav>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="avatar-initials" style={{ width: 28, height: 28, fontSize: 11 }}>SM</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Dr. S. Mukherjee</span>
              <span style={{ fontSize: 10, color: "var(--accent-blue)", fontFamily: "var(--font-mono)" }}>RAD-8820-ONC</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
