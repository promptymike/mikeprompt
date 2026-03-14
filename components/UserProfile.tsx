"use client";

import { useState, useEffect } from "react";
import { type Profile, EMPTY_PROFILE, saveProfile as persistProfile } from "@/lib/profile";

export type { Profile };
export { EMPTY_PROFILE };

type Lang = "en" | "pl";

const ROLES = [
  "Finance Manager", "Accountant", "Auditor", "Admin/EA",
  "Sales Rep", "Sales Manager", "HR", "Student", "CEO/Founder", "Other",
];
const AI_TOOLS = ["ChatGPT", "Claude", "Gemini", "Copilot", "Other"];
const AI_LEVELS_EN = ["Just starting", "I use it sometimes", "Daily user", "Power user"];
const AI_LEVELS_PL = ["Dopiero zaczynam", "Używam od czasu do czasu", "Użytkownik dzienny", "Zaawansowany użytkownik"];
const APP_CHIPS = ["Excel", "PowerPoint", "Google Sheets", "Word", "Salesforce", "Power BI", "SAP", "Other"];

const T = {
  en: {
    header_title: "Your Profile",
    header_sub: "Mike uses this to personalize your prompts",
    cloud_title: "☁️ Save profile to cloud",
    cloud_sub: "Sign in with email — access your profile on any device",
    cloud_email_placeholder: "your@email.com",
    cloud_send_code: "Send code",
    cloud_sending: "Sending…",
    cloud_code_placeholder: "6-digit code",
    cloud_verify: "Verify",
    cloud_verifying: "Verifying…",
    cloud_code_hint: "Enter the 6-digit code sent to your email",
    cloud_dev_hint: (token: string) => `[DEV] Code: ${token}`,
    cloud_error_invalid: "Invalid or expired code. Try again.",
    cloud_error_send: "Failed to send code. Try again.",
    cloud_logged_as: "Signed in as",
    cloud_sign_out: "(sign out)",
    section_about: "About you",
    section_goals: "Your goals",
    section_tools: "Your tools",
    section_ai: "Your experience with AI",
    label_name: "Your name",
    label_role: "Your role",
    label_industry: "Your industry",
    label_usage: "What do you use AI for?",
    label_challenge: "Your biggest challenge?",
    label_ai: "Which AI do you use most?",
    label_apps: "Which apps do you work in?",
    placeholder_name: "e.g. Anna",
    placeholder_industry: "e.g. SaaS, Manufacturing, Retail",
    placeholder_usage: "e.g. reports, emails, data analysis",
    placeholder_challenge: "e.g. saving time on month-end close",
    select_role: "Select role…",
    select_ai: "Select AI…",
    save_btn: "Save profile",
    saved_btn: "✓ Profile saved!",
    footer: "Mike uses this to personalize your prompts.",
    footer2: "Nothing leaves your browser.",
    ai_levels: AI_LEVELS_EN,
  },
  pl: {
    header_title: "Twój profil",
    header_sub: "Mike używa tego, aby personalizować twoje prompty",
    cloud_title: "☁️ Zapisz profil w chmurze",
    cloud_sub: "Zaloguj się emailem — profil dostępny na każdym urządzeniu",
    cloud_email_placeholder: "twoj@email.com",
    cloud_send_code: "Wyślij kod",
    cloud_sending: "Wysyłanie…",
    cloud_code_placeholder: "6-cyfrowy kod",
    cloud_verify: "Weryfikuj",
    cloud_verifying: "Weryfikowanie…",
    cloud_code_hint: "Wpisz 6-cyfrowy kod wysłany na twój email",
    cloud_dev_hint: (token: string) => `[DEV] Kod: ${token}`,
    cloud_error_invalid: "Nieprawidłowy lub wygasły kod. Spróbuj ponownie.",
    cloud_error_send: "Nie udało się wysłać kodu. Spróbuj ponownie.",
    cloud_logged_as: "Zalogowany jako",
    cloud_sign_out: "(wyloguj)",
    section_about: "O tobie",
    section_goals: "Twoje cele",
    section_tools: "Twoje narzędzia",
    section_ai: "Twoje doświadczenie z AI",
    label_name: "Twoje imię",
    label_role: "Twoja rola",
    label_industry: "Twoja branża",
    label_usage: "Do czego używasz AI?",
    label_challenge: "Twoje największe wyzwanie?",
    label_ai: "Którego AI używasz najczęściej?",
    label_apps: "W jakich aplikacjach pracujesz?",
    placeholder_name: "np. Anna",
    placeholder_industry: "np. SaaS, Produkcja, Handel",
    placeholder_usage: "np. raporty, emaile, analiza danych",
    placeholder_challenge: "np. oszczędność czasu przy zamknięciu miesiąca",
    select_role: "Wybierz rolę…",
    select_ai: "Wybierz AI…",
    save_btn: "Zapisz profil",
    saved_btn: "✓ Profil zapisany!",
    footer: "Mike używa tego, aby personalizować twoje prompty.",
    footer2: "Nic nie opuszcza twojej przeglądarki.",
    ai_levels: AI_LEVELS_PL,
  },
};

type AuthStep = "idle" | "code_sent" | "verified";

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => void;
  initialProfile: Profile;
  lang?: Lang;
}

export default function UserProfile({ open, onClose, onSave, initialProfile, lang = "en" }: UserProfileProps) {
  const [p, setP] = useState<Profile>(initialProfile);
  const [saved, setSaved] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>("idle");
  const [authEmail, setAuthEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [devToken, setDevToken] = useState("");
  const t = T[lang];

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
    persistProfile(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleLogout = () => {
    const updated = { ...p, email: undefined, plan: undefined, createdAt: undefined };
    setP(updated);
    onSave(updated);
    persistProfile(updated);
    setAuthStep("idle");
    setAuthEmail("");
    setAuthCode("");
    setAuthError("");
    setDevToken("");
  };

  const handleSendCode = async () => {
    if (!authEmail.includes("@")) return;
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail }),
      });
      const data = await res.json() as { success?: boolean; devToken?: string; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Send failed");
      if (data.devToken) setDevToken(data.devToken);
      setAuthStep("code_sent");
    } catch {
      setAuthError(t.cloud_error_send);
    }
    setAuthLoading(false);
  };

  const handleVerify = async () => {
    if (authCode.length < 6) return;
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, token: authCode }),
      });
      const data = await res.json() as { success?: boolean; user?: { email: string; plan: string; createdAt: string }; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Verify failed");
      const updated: Profile = {
        ...p,
        email: authEmail,
        plan: (data.user?.plan ?? "free") as "free" | "pro",
        createdAt: data.user?.createdAt,
      };
      setP(updated);
      onSave(updated);
      persistProfile(updated);
      setAuthStep("verified");
      setDevToken("");
    } catch {
      setAuthError(t.cloud_error_invalid);
    }
    setAuthLoading(false);
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
              {t.header_title}
            </div>
            <div style={{ fontSize: 11, color: "var(--c-text3)", marginTop: 2 }}>
              {t.header_sub}
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
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 16px" }}>
          {/* Cloud login section */}
          {!p.email ? (
            <div style={{
              background: "rgba(255,110,64,0.06)",
              border: "1px solid rgba(255,110,64,0.2)",
              borderRadius: 12, padding: "14px 16px", marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--c-text1)", marginBottom: 4 }}>
                {t.cloud_title}
              </div>
              <div style={{ fontSize: 12, color: "var(--c-text3)", marginBottom: 12 }}>
                {t.cloud_sub}
              </div>

              {authStep === "idle" && (
                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder={t.cloud_email_placeholder}
                    style={{ ...inputStyle, flex: 1, fontSize: 12 }}
                    onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                    onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={authLoading || !authEmail.includes("@")}
                    style={{
                      padding: "8px 12px", borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                      color: "white", fontSize: 12, fontWeight: 600,
                      cursor: authEmail.includes("@") ? "pointer" : "default",
                      opacity: authEmail.includes("@") ? 1 : 0.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {authLoading ? t.cloud_sending : t.cloud_send_code}
                  </button>
                </div>
              )}

              {authStep === "code_sent" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--c-text3)" }}>{t.cloud_code_hint}</div>
                  {devToken && (
                    <div style={{ fontSize: 11, color: "#FF6E40", fontFamily: "monospace" }}>
                      {t.cloud_dev_hint(devToken)}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      type="text"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder={t.cloud_code_placeholder}
                      maxLength={6}
                      style={{ ...inputStyle, flex: 1, fontSize: 16, letterSpacing: "0.2em", textAlign: "center" }}
                      onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                      onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
                    />
                    <button
                      onClick={handleVerify}
                      disabled={authLoading || authCode.length < 6}
                      style={{
                        padding: "8px 12px", borderRadius: 10, border: "none",
                        background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                        color: "white", fontSize: 12, fontWeight: 600,
                        cursor: authCode.length === 6 ? "pointer" : "default",
                        opacity: authCode.length === 6 ? 1 : 0.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {authLoading ? t.cloud_verifying : t.cloud_verify}
                    </button>
                  </div>
                </div>
              )}

              {authError && (
                <div style={{ fontSize: 11, color: "#E53935", marginTop: 6 }}>{authError}</div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#43A047", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              ✅ {t.cloud_logged_as} <strong>{p.email}</strong>
              {p.plan === "pro" && (
                <span style={{ fontSize: 10, background: "#FF6E40", color: "white", borderRadius: 100, padding: "1px 7px", fontWeight: 700 }}>PRO</span>
              )}
              <span
                style={{ color: "var(--c-text4)", cursor: "pointer", marginLeft: "auto" }}
                onClick={handleLogout}
              >
                {t.cloud_sign_out}
              </span>
            </div>
          )}

          {/* About you */}
          <SectionLabel icon="👤" text={t.section_about} />
          <Field label={t.label_name}>
            <input
              type="text" value={p.name} maxLength={200}
              onChange={(e) => setP({ ...p, name: e.target.value })}
              placeholder={t.placeholder_name}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
              onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
            />
          </Field>
          <Field label={t.label_role}>
            <select
              value={p.role}
              onChange={(e) => setP({ ...p, role: e.target.value })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">{t.select_role}</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label={t.label_industry}>
            <input
              type="text" value={p.industry} maxLength={200}
              onChange={(e) => setP({ ...p, industry: e.target.value })}
              placeholder={t.placeholder_industry}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
              onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
            />
          </Field>

          {/* Goals */}
          <SectionLabel icon="🎯" text={t.section_goals} />
          <Field label={t.label_usage}>
            <input
              type="text" value={p.usage} maxLength={200}
              onChange={(e) => setP({ ...p, usage: e.target.value })}
              placeholder={t.placeholder_usage}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
              onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
            />
          </Field>
          <Field label={t.label_challenge}>
            <input
              type="text" value={p.challenge} maxLength={200}
              onChange={(e) => setP({ ...p, challenge: e.target.value })}
              placeholder={t.placeholder_challenge}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
              onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
            />
          </Field>

          {/* Tools */}
          <SectionLabel icon="🛠️" text={t.section_tools} />
          <Field label={t.label_ai}>
            <select
              value={p.aiPreferred}
              onChange={(e) => setP({ ...p, aiPreferred: e.target.value })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">{t.select_ai}</option>
              {AI_TOOLS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <Field label={t.label_apps}>
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
          <SectionLabel icon="📊" text={t.section_ai} />
          <Field>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {t.ai_levels.map((level, i) => {
                const enLevel = AI_LEVELS_EN[i];
                const active = p.aiLevel === enLevel;
                return (
                  <button
                    key={enLevel}
                    onClick={() => setP({ ...p, aiLevel: enLevel })}
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
          >{saved ? t.saved_btn : t.save_btn}</button>
          <p style={{ fontSize: 11, color: "var(--c-text3)", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
            {t.footer}<br />{t.footer2}
          </p>
        </div>
      </div>
    </>
  );
}
