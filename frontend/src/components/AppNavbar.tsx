"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  useEffect(() => {
    setCurrentSection(activeSection);
  }, [activeSection]);

  // Track active section on scroll if on home page
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = ["overview", "analysis", "benchmarks", "benchmark"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setCurrentSection(sectionId === "benchmark" ? "benchmarks" : sectionId);
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
        const el = document.getElementById(sectionId) || (sectionId === "benchmarks" ? document.getElementById("benchmark") : null);
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
          {/* Left: Brand Pill */}
          <div className="navbar-left-group">
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

          {/* Center Navigation Links: Overview, Analysis, Benchmarks */}
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
              href="/#benchmarks"
              onClick={(e) => handleNavClick(e, "benchmarks")}
              className={`navbar-link ${pathname === "/" && (currentSection === "benchmarks" || currentSection === "benchmark") ? "active" : ""}`}
            >
              Benchmarks
            </Link>
          </nav>

          {/* Extreme Right: Launch Studio Action */}
          <div className="navbar-actions">
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
    </>
  );
};
