"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LungIcon, 
  ScanIcon, 
  ActivityIcon,
  SettingsIcon,
  CheckIcon, 
  MenuIcon,
  ChevronDownIcon 
} from "@/components/Icons";
import { ClinicianUser } from "@/types/medical";

interface HeaderProps {
  user: ClinicianUser;
  onOpenAuth: () => void;
  onOpenDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onOpenAuth,
  onOpenDrawer 
}) => {
  const pathname = usePathname();
  const [isPythonOnline, setIsPythonOnline] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        if (res.ok && isMounted) {
          const data = await res.json();
          setIsPythonOnline(Boolean(data.python_backend));
        } else if (isMounted) {
          setIsPythonOnline(false);
        }
      } catch {
        if (isMounted) setIsPythonOnline(false);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        {onOpenDrawer && (
          <button 
            className="hamburger-btn" 
            onClick={onOpenDrawer}
            title="Open Navigation Menu"
            aria-label="Navigation Menu"
          >
            <MenuIcon size={20} />
          </button>
        )}

        <Link href="/" className="brand-badge">
          <div className="brand-icon-box">
            <LungIcon size={20} />
          </div>
          <div className="brand-info">
            <span className="brand-name">
              PulmoVision AI
              <span className="brand-version">v1.0</span>
            </span>
            <span className="brand-sub">Thoracic Oncology Workstation</span>
          </div>
        </Link>

        <nav className="header-nav">
          <Link 
            href="/" 
            className={`nav-tab-link ${pathname === "/" ? "active" : ""}`}
          >
            <ScanIcon size={16} />
            <span>Overview</span>
          </Link>

          <Link 
            href="/analysis" 
            className={`nav-tab-link ${pathname === "/analysis" ? "active" : ""}`}
          >
            <ActivityIcon size={16} />
            <span>Analysis</span>
          </Link>

          <Link 
            href="/settings" 
            className={`nav-tab-link ${pathname === "/settings" ? "active" : ""}`}
          >
            <SettingsIcon size={16} />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      <div className="header-right">
        <div 
          className={`system-status-indicator ${isPythonOnline ? "online" : ""}`}
          title={isPythonOnline ? "Tri-Ensemble Python DL Backend (Port 8001) Connected" : "Local Python Backend Offline - Edge Engine Active"}
        >
          {isPythonOnline ? <CheckIcon size={14} /> : <ActivityIcon size={14} />}
          <span>{isPythonOnline ? "LOCAL GPU/API CONNECTED" : "EDGE ENGINE READY"}</span>
        </div>

        <button 
          className="clinician-profile-btn" 
          onClick={onOpenAuth}
          title="Clinician Profile & Session Management"
        >
          <div className="avatar-initials">SM</div>
          <div className="clinician-text">
            <span className="clinician-name">{user.name}</span>
            <span className="clinician-role">{user.licenseId}</span>
          </div>
          <ChevronDownIcon size={14} />
        </button>
      </div>
    </header>
  );
};
