"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "@/components/Icons";
import { NavigationDrawer } from "@/components/NavigationDrawer";

interface AppNavbarProps {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  activeSection = "overview",
  onSelectSection
}) => {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{
    connected: boolean;
    backbones?: number;
    latency?: number;
  }>({ connected: false });

  // Monitor backend health
  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      try {
        const t0 = performance.now();
        const res = await fetch("/api/health");
        const t1 = performance.now();
        if (res.ok && isMounted) {
          const data = await res.json();
          setBackendStatus({
            connected: Boolean(data.python_backend),
            backbones: data.total_backbones_active || (data.python_backend ? 3 : 0),
            latency: Math.round(t1 - t0)
          });
        } else if (isMounted) {
          setBackendStatus({ connected: false });
        }
      } catch {
        if (isMounted) setBackendStatus({ connected: false });
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setCurrentSection(activeSection);
  }, [activeSection]);

  // Track active section on scroll if on home page
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = ["overview", "analysis", "benchmark"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (pathname === "/") {
      e.preventDefault();
      setCurrentSection(sectionId);
      if (onSelectSection) {
        onSelectSection(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  return (
    <>
      <header className="site-navbar">
        <div className="navbar-container">
          {/* Left: Hamburger Button + Brand Pill */}
          <div className="navbar-left-group">
            <button 
              type="button"
              className="navbar-hamburger-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open Navigation Drawer"
            >
              <MenuIcon size={18} />
            </button>

            <Link 
              href="/#overview" 
              onClick={(e) => handleNavClick(e, "overview")}
              className="navbar-brand-pill"
            >
              <div className="navbar-brand-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v16M12 8c-3 0-6 2-6 6a6 6 0 0 0 6 6M12 8c3 0 6 2 6 6a6 6 0 0 1-6 6"/>
                </svg>
              </div>
              <div className="navbar-brand-text">
                <span className="navbar-brand-title">Pulmo</span>
                <span className="navbar-brand-sub">CLINICAL AI</span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links: Overview, Analysis, Settings */}
          <nav className="navbar-links">
            <Link
              href="/#overview"
              onClick={(e) => handleNavClick(e, "overview")}
              className={`navbar-link ${pathname === "/" && currentSection === "overview" ? "active" : ""}`}
            >
              Overview
            </Link>
            <Link
              href="/#analysis"
              onClick={(e) => handleNavClick(e, "analysis")}
              className={`navbar-link ${pathname === "/" && currentSection === "analysis" ? "active" : ""}`}
            >
              Analysis
            </Link>
            <Link
              href="/settings"
              className={`navbar-link ${pathname === "/settings" ? "active" : ""}`}
            >
              Settings
            </Link>
          </nav>

          {/* Backend Connection Status & Launch Studio Action */}
          <div className="navbar-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "5px 11px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                background: backendStatus.connected 
                  ? "rgba(16, 185, 129, 0.12)" 
                  : "rgba(245, 158, 11, 0.12)",
                border: backendStatus.connected 
                  ? "1px solid rgba(16, 185, 129, 0.35)" 
                  : "1px solid rgba(245, 158, 11, 0.35)",
                color: backendStatus.connected ? "#34d399" : "#fbbf24",
                boxShadow: backendStatus.connected 
                  ? "0 0 12px rgba(16, 185, 129, 0.15)" 
                  : "none"
              }}
              title={
                backendStatus.connected
                  ? `Python Tri-Ensemble Backend Connected on Port 8001 (${backendStatus.backbones ?? 3} backbones active)`
                  : "Python backend disconnected. Ensure api_server.py is running on port 8001."
              }
            >
              <span 
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: backendStatus.connected ? "#10b981" : "#f59e0b",
                  boxShadow: backendStatus.connected 
                    ? "0 0 8px #10b981" 
                    : "0 0 4px #f59e0b"
                }}
              />
              <span>
                {backendStatus.connected
                  ? `AI SERVER : 8001 CONNECTED`
                  : `AI SERVER : CONNECTING...`}
              </span>
            </div>

            <a 
              href="/#analysis"
              onClick={(e) => handleNavClick(e, "analysis")}
              className="navbar-launch-btn"
            >
              <span>Launch Studio</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Slide-Out Drawer Navigation */}
      <NavigationDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />
    </>
  );
};
