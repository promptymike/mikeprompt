"use client";
import { useState, useEffect } from "react";

const KEY = "mikeprompt_cookie_ok";

export default function CookieBanner({ lang }: { lang: "en" | "pl" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(KEY)) return;
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  const text =
    lang === "pl"
      ? "Ta strona używa wyłącznie technicznych cookies bezpieczeństwa (Cloudflare). Brak cookies reklamowych."
      : "This site uses only technical security cookies (Cloudflare). No advertising or tracking cookies.";

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      padding: "12px 20px",
      background: "var(--c-card, #fff)",
      borderTop: "1px solid var(--c-card-border, rgba(0,0,0,0.08))",
      fontSize: 12,
      color: "var(--c-text3, #7A6F68)",
      flexWrap: "wrap",
    }}>
      <span style={{ flex: 1, minWidth: 200 }}>{text}</span>
      <button
        onClick={dismiss}
        style={{
          padding: "5px 16px",
          borderRadius: 7,
          border: "1px solid var(--c-card-border, rgba(0,0,0,0.12))",
          background: "transparent",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          color: "var(--c-text2, #4A3F38)",
          flexShrink: 0,
        }}
      >
        OK
      </button>
    </div>
  );
}
