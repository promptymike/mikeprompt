"use client";
import React, { useState, useEffect } from "react";

type Lang = "en" | "pl";

export default function LegalPage({
  title,
  lang,
  onToggleLang,
  children,
}: {
  title: string;
  lang: Lang;
  onToggleLang: () => void;
  children: React.ReactNode;
}) {
  const nav = {
    back:     lang === "pl" ? "← Wróć do MikePrompt" : "← Back to MikePrompt",
    privacy:  lang === "pl" ? "Prywatność" : "Privacy",
    terms:    lang === "pl" ? "Regulamin"  : "Terms",
    security: lang === "pl" ? "Bezpieczeństwo" : "Security",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-bg, #FDFAF7)", padding: "40px 16px 80px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <a href="/" style={{ fontSize: 13, color: "#FF6E40", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 24 }}>
              ← MikePrompt
            </a>
            <h1 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(26px, 5vw, 38px)",
              fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.6px",
              color: "var(--c-text1, #1A1310)", margin: 0,
            }}>
              {title}
            </h1>
          </div>

          {/* Language toggle */}
          <button
            onClick={onToggleLang}
            style={{
              marginTop: 2,
              padding: "5px 12px",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "var(--c-card, #fff)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              color: "var(--c-text2, #4A3F38)",
              letterSpacing: "0.3px",
              flexShrink: 0,
            }}
          >
            {lang === "pl" ? "EN" : "PL"}
          </button>
        </div>

        {/* Content card */}
        <div style={{
          background: "var(--c-card, #FFFFFF)",
          border: "1px solid var(--c-card-border, rgba(0,0,0,0.07))",
          borderRadius: 20, padding: "36px 40px",
          fontSize: 15, lineHeight: 1.75,
          color: "var(--c-text2, #4A3F38)",
        }}>
          <style>{`
            .legal-content h2 {
              font-family: 'Fraunces', serif;
              font-size: 18px; font-weight: 700;
              color: var(--c-text1, #1A1310);
              margin: 32px 0 10px; letter-spacing: -0.3px;
            }
            .legal-content h2:first-child { margin-top: 0; }
            .legal-content p { margin: 0 0 12px; }
            .legal-content ul { margin: 8px 0 16px; padding-left: 22px; }
            .legal-content li { margin-bottom: 6px; }
            .legal-content a { color: #FF6E40; }
          `}</style>
          <div className="legal-content">{children}</div>
        </div>

        {/* Footer nav */}
        <div style={{
          marginTop: 32, paddingTop: 24,
          borderTop: "1px solid rgba(0,0,0,0.06)",
          display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13,
        }}>
          <a href="/"        style={{ color: "#FF6E40", textDecoration: "none" }}>{nav.back}</a>
          <a href="/privacy" style={{ color: "#A09890", textDecoration: "none" }}>{nav.privacy}</a>
          <a href="/terms"   style={{ color: "#A09890", textDecoration: "none" }}>{nav.terms}</a>
          <a href="/security"style={{ color: "#A09890", textDecoration: "none" }}>{nav.security}</a>
          <span style={{ color: "#C0B8B0" }}>hello@mikeprompt.com</span>
        </div>
      </div>
    </div>
  );
}
