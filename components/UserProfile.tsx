"use client";

import { useState, useEffect } from "react";

export interface Profile {
  name: string;
  role: string;
  industry: string;
  usage: string;
  challenge: string;
  aiPreferred: string;
  apps: string[];
  aiLevel: string;
}

export const EMPTY_PROFILE: Profile = {
  name: "", role: "", industry: "",
  usage: "", challenge: "",
  aiPreferred: "", apps: [], aiLevel: "",
};

const ROLES = [
  "Finance Manager", "Accountant", "Auditor", "Admin/EA",
  "Sales Rep", "Sales Manager", "HR", "Student", "CEO/Founder", "Other",
];
const AI_TOOLS = ["ChatGPT", "Claude", "Gemini", "Copilot", "Other"];
const AI_LEVELS = ["Just starting", "I use it sometimes", "Daily user", "Power user"];
const APP_CHIPS = ["Excel", "PowerPoint", "Google Sheets", "Word", "Salesforce", "Power BI", "SAP", "Other"];

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => void;
  initialProfile: Profile;
}

export default function UserProfile({ open, onClose, onSave, initialProfile }: UserProfileProps) {
  const [p, setP] = useState<Profile>(initialProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setP(initialProfile); }, [initialProfile]);

  const toggleApp = (app: string) => {
    setP((prev) => ({
      ...prev,
      apps: prev.apps.includes(app)
        ? prev.apps.filter((a) => a !== app)
        : [...prev.apps, app],
    }));
  };

  const handleSave = () => {
    onSave(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: 10,
    border: "1px solid var(--c-input-border)",
    fontSize: 13, color: "var(--c-text1)",
    background: "var(--c-input)", outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
  };

  const Field = ({ label, children }: { label?: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <div style={{ fontSize: 10, color: "var(--c-text3)", fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {label}
        </div>
      )}
      {children}
    </div>
  );

  const SectionLabel = ({ icon, text }: { icon: string; text: string }) => (
    <div style={{
      fontSize: 11, fontWeight: 700, color: "var(--c-text3)",
      textTransform: "uppercase", letterSpacing: "0.5px",
      margin: "20px 0 10px", display: "flex", alignItems: "center", gap: 6,
    }}>
      <span>{icon}</span> {text}
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: open ? "var(--c-overlay)" : "transparent",
          zIndex: open ? 100 : -1,
          transition: "background 0.3s",
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Sidebar */}
      <div style={{
        position: "fixed", top: 0, right: 0,
        width: 340, height: "100vh",
        background: "var(--c-sidebar)",
        borderLeft: "1px solid var(--c-card-border)",
        zIndex: 101,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        boxShadow: "-12px 0 40px rgba(0,0,0,0.15)",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid var(--c-sep)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--c-text1)", fontFamily: "'Fraunces', serif" }}>
              Your Profile
            </div>
            <div style={{ fontSize: 11, color: "var(--c-text3)", marginTop: 2 }}>
              Mike uses this to personalize your prompts
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8,
              border: "1px solid var(--c-card-border)",
              background: "var(--c-card)", cursor: "pointer",
              fontSize: 18, color: "var(--c-text3)", lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >×</button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 16px" }}>
          {/* About you */}
          <SectionLabel icon="👤" text="About you" />
          <Field label="Your name">
            <input
              type="text" value={p.name} maxLength={200}
              onChange={(e) => setP({ ...p, name: e.target.value })}
              placeholder="e.g. Anna"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
              onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
            />
          </Field>
          <Field label="Your role">
            <select
              value={p.role}
              onChange={(e) => setP({ ...p, role: e.target.value })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">Select role…</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Your industry">
            <input
              type="text" value={p.industry} maxLength={200}
              onChange={(e) => setP({ ...p, industry: e.target.value })}
              placeholder="e.g. SaaS, Manufacturing, Retail"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
              onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
            />
          </Field>

          {/* Goals */}
          <SectionLabel icon="🎯" text="Your goals" />
          <Field label="What do you use AI for?">
            <input
              type="text" value={p.usage} maxLength={200}
              onChange={(e) => setP({ ...p, usage: e.target.value })}
              placeholder="e.g. reports, emails, data analysis"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
              onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
            />
          </Field>
          <Field label="Your biggest challenge?">
            <input
              type="text" value={p.challenge} maxLength={200}
              onChange={(e) => setP({ ...p, challenge: e.target.value })}
              placeholder="e.g. saving time on month-end close"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
              onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
            />
          </Field>

          {/* Tools */}
          <SectionLabel icon="🛠️" text="Your tools" />
          <Field label="Which AI do you use most?">
            <select
              value={p.aiPreferred}
              onChange={(e) => setP({ ...p, aiPreferred: e.target.value })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">Select AI…</option>
              {AI_TOOLS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="Which apps do you work in?">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {APP_CHIPS.map((app) => {
                const active = p.apps.includes(app);
                return (
                  <button
                    key={app}
                    onClick={() => toggleApp(app)}
                    style={{
                      padding: "5px 11px", borderRadius: 100,
                      border: active ? "1px solid #FF8A65" : "1px solid var(--c-chip-border)",
                      background: active ? "rgba(255,110,64,0.08)" : "var(--c-chip-bg)",
                      fontSize: 12, fontWeight: active ? 600 : 400,
                      color: active ? "#FF6E40" : "var(--c-chip-color)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >{app}</button>
                );
              })}
            </div>
          </Field>

          {/* AI Experience */}
          <SectionLabel icon="📊" text="Your experience with AI" />
          <Field>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {AI_LEVELS.map((level) => {
                const active = p.aiLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => setP({ ...p, aiLevel: level })}
                    style={{
                      padding: "9px 14px", borderRadius: 10, textAlign: "left",
                      border: active ? "1px solid #FF8A65" : "1px solid var(--c-input-border)",
                      background: active ? "rgba(255,110,64,0.07)" : "var(--c-input)",
                      fontSize: 13, fontWeight: active ? 600 : 400,
                      color: active ? "#FF6E40" : "var(--c-text2)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >{level}</button>
                );
              })}
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--c-sep)", flexShrink: 0 }}>
          <button
            onClick={handleSave}
            style={{
              width: "100%", padding: "11px", borderRadius: 12, border: "none",
              background: saved
                ? "rgba(67,160,71,0.1)"
                : "linear-gradient(135deg, #FF6E40, #FF8A65)",
              color: saved ? "#43A047" : "white",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "all 0.3s",
            }}
          >{saved ? "✓ Profile saved!" : "Save profile"}</button>
          <p style={{ fontSize: 11, color: "var(--c-text3)", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
            Mike uses this to personalize your prompts.<br />Nothing leaves your browser.
          </p>
        </div>
      </div>
    </>
  );
}
