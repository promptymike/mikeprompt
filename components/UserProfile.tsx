"use client";

import { useState, useEffect } from "react";
import { type Profile, EMPTY_PROFILE, saveProfile as persistProfile } from "@/lib/profile";
import { signUp, signIn, signOut, resetPassword, getCurrentUser } from "@/lib/auth";
import { supabase, hasSupabase } from "@/lib/supabase";

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

type SupabaseUser = Awaited<ReturnType<typeof getCurrentUser>>;

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
  const [authMode, setAuthMode] = useState<"login" | "register" | "reset">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState<SupabaseUser>(null);
  const t = T[lang];

  useEffect(() => { setP(initialProfile); }, [initialProfile]);

  useEffect(() => {
    if (!hasSupabase) return;
    getCurrentUser().then((user) => { if (user) setCurrentUser(user); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) loadProfileFromDB(session.user.id);
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfileFromDB = async (userId: string) => {
    if (!hasSupabase) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("profiles") as any).select("*").eq("id", userId).single() as { data: Record<string, unknown> | null };
    if (data) {
      const updated: Profile = {
        ...p,
        name: (data.name as string) ?? "",
        role: (data.role as string) ?? "",
        industry: (data.industry as string) ?? "",
        usage: (data.usage as string) ?? "",
        challenge: (data.challenge as string) ?? "",
        aiPreferred: (data.ai_preferred as string) ?? "",
        apps: (data.apps as string[]) ?? [],
        aiLevel: (data.ai_level as string) ?? "",
        email: data.email as string | undefined,
      };
      setP(updated);
      onSave(updated);
    }
  };

  const saveProfileToDB = async (profile: Profile) => {
    if (!hasSupabase || !currentUser) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any).upsert({
      id: currentUser.id,
      email: currentUser.email,
      name: profile.name,
      role: profile.role,
      industry: profile.industry,
      usage: profile.usage,
      challenge: profile.challenge,
      ai_preferred: profile.aiPreferred,
      apps: profile.apps,
      ai_level: profile.aiLevel,
      updated_at: new Date().toISOString(),
    });
  };

  const toggleApp = (app: string) => {
    setP((prev) => ({
      ...prev,
      apps: prev.apps.includes(app)
        ? prev.apps.filter((a) => a !== app)
        : [...prev.apps, app],
    }));
  };

  const handleSave = async () => {
    onSave(p);
    persistProfile(p);
    await saveProfileToDB(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
    const updated = { ...p, email: undefined, plan: undefined, createdAt: undefined };
    setP(updated);
    onSave(updated);
    persistProfile(updated);
    setAuthMode("login");
    setAuthEmail("");
    setAuthPassword("");
    setAuthError("");
    setAuthSuccess("");
  };

  const handleAuth = async () => {
    setAuthLoading(true);
    setAuthError("");
    setAuthSuccess("");

    if (authMode === "reset") {
      const { error } = await resetPassword(authEmail);
      if (error) setAuthError(error.message);
      else setAuthSuccess(lang === "pl" ? "Sprawdź email — wysłaliśmy link do resetowania hasła" : "Check your email — we sent a reset link");
      setAuthLoading(false);
      return;
    }

    if (authMode === "register") {
      if (authPassword.length < 8) {
        setAuthError(lang === "pl" ? "Hasło musi mieć min. 8 znaków" : "Password must be at least 8 characters");
        setAuthLoading(false);
        return;
      }
      const { error } = await signUp(authEmail, authPassword, authName);
      if (error) setAuthError(error.message);
      else setAuthSuccess(lang === "pl" ? "✅ Sprawdź email i kliknij link potwierdzający!" : "✅ Check your email and click the confirmation link!");
      setAuthLoading(false);
      return;
    }

    // Login
    const { error } = await signIn(authEmail, authPassword);
    if (error) {
      setAuthError(lang === "pl" ? "Nieprawidłowy email lub hasło" : "Invalid email or password");
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
          {!currentUser ? (
            <div style={{
              background: "rgba(255,110,64,0.04)",
              border: "1px solid rgba(255,110,64,0.18)",
              borderRadius: 14,
              padding: "16px",
              marginBottom: 16,
            }}>
              {/* Header z przełącznikiem Login/Zarejestruj */}
              <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                {(["login", "register"] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => { setAuthMode(mode); setAuthError(""); setAuthSuccess(""); }}
                    style={{
                      flex: 1, padding: "6px", borderRadius: 8, border: "none",
                      background: authMode === mode ? "linear-gradient(135deg, #FF6E40, #FF8A65)" : "var(--c-card)",
                      color: authMode === mode ? "white" : "var(--c-text3)",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    {mode === "login"
                      ? (lang === "pl" ? "Zaloguj się" : "Sign in")
                      : (lang === "pl" ? "Zarejestruj się" : "Sign up")}
                  </button>
                ))}
              </div>

              {/* Imię — tylko przy rejestracji */}
              {authMode === "register" && (
                <input
                  type="text"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  placeholder={lang === "pl" ? "Imię (opcjonalnie)" : "Name (optional)"}
                  style={{ ...inputStyle, marginBottom: 8, fontSize: 13 }}
                />
              )}

              {/* Email */}
              <input
                type="email"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="email@example.com"
                style={{ ...inputStyle, marginBottom: 8, fontSize: 13 }}
              />

              {/* Hasło — login i register */}
              {authMode !== "reset" && (
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder={lang === "pl" ? "Hasło (min. 8 znaków)" : "Password (min. 8 chars)"}
                  onKeyDown={e => e.key === "Enter" && handleAuth()}
                  style={{ ...inputStyle, marginBottom: 10, fontSize: 13 }}
                />
              )}

              {/* Error / Success */}
              {authError && <div style={{ fontSize: 12, color: "#E53935", marginBottom: 8 }}>{authError}</div>}
              {authSuccess && <div style={{ fontSize: 12, color: "#43A047", marginBottom: 8 }}>{authSuccess}</div>}

              {/* Główny przycisk */}
              {authMode !== "reset" && (
                <button
                  onClick={handleAuth}
                  disabled={authLoading}
                  style={{
                    width: "100%", padding: "10px", borderRadius: 10, border: "none",
                    background: authLoading ? "#FFAB91" : "linear-gradient(135deg, #FF6E40, #FF8A65)",
                    color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8,
                  }}
                >
                  {authLoading ? "⏳..." : authMode === "login"
                    ? (lang === "pl" ? "Zaloguj się" : "Sign in")
                    : (lang === "pl" ? "Stwórz konto" : "Create account")}
                </button>
              )}

              {/* Zapomniałem hasła */}
              {authMode === "login" && (
                <button
                  onClick={() => { setAuthMode("reset"); setAuthError(""); }}
                  style={{ background: "none", border: "none", fontSize: 11, color: "var(--c-text4)", cursor: "pointer", textDecoration: "underline" }}
                >
                  {lang === "pl" ? "Zapomniałem hasła" : "Forgot password?"}
                </button>
              )}

              {/* Reset password view */}
              {authMode === "reset" && (
                <>
                  <button
                    onClick={handleAuth}
                    disabled={authLoading}
                    style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #FF6E40, #FF8A65)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}
                  >
                    {authLoading ? "⏳..." : (lang === "pl" ? "Wyślij link resetujący" : "Send reset link")}
                  </button>
                  <button onClick={() => setAuthMode("login")} style={{ background: "none", border: "none", fontSize: 11, color: "var(--c-text4)", cursor: "pointer", textDecoration: "underline" }}>
                    {lang === "pl" ? "← Wróć do logowania" : "← Back to login"}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 12px", background: "rgba(67,160,71,0.06)", borderRadius: 10 }}>
              <span style={{ fontSize: 14 }}>✅</span>
              <span style={{ fontSize: 12, color: "#43A047", fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.email}</span>
              <button onClick={handleLogout} style={{ fontSize: 11, color: "var(--c-text4)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", flexShrink: 0 }}>
                {lang === "pl" ? "wyloguj" : "sign out"}
              </button>
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
