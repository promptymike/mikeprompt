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

type SupabaseUser = Awaited<ReturnType<typeof getCurrentUser>>;

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => void;
  initialProfile: Profile;
  lang?: Lang;
  isMobile?: boolean;
}

export default function UserProfile({ open, onClose, onSave, initialProfile, lang = "en", isMobile = false }: UserProfileProps) {
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
        saveHistory: data.save_history !== undefined ? (data.save_history as boolean) : true,
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
      save_history: profile.saveHistory ?? true,
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

  const SectionHeader = ({ icon, text, hint }: { icon: string; text: string; hint?: string }) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, marginBottom: 10, marginTop: 18,
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--c-text3)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {text}
      </span>
      {hint && (
        <span style={{ fontSize: 10, color: "var(--c-text4)", marginLeft: "auto" }}>{hint}</span>
      )}
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
      <div
        data-theme-inherit
        style={{
          position: "fixed", top: 0, right: 0,
          width: isMobile ? "100vw" : 340, height: "100vh",
          background: "var(--c-sidebar)",
          borderLeft: "1px solid var(--c-card-border)",
          zIndex: 101,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          display: "flex", flexDirection: "column",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--c-text1)", fontFamily: "'Fraunces', serif" }}>
                {lang === "pl" ? "Powiedz Mike'owi o sobie" : "Tell Mike about yourself"}
              </div>
              <div style={{ fontSize: 12, color: "var(--c-text3)", marginTop: 2 }}>
                {lang === "pl"
                  ? "Mike dostosuje prompty do Twojej pracy"
                  : "Mike will tailor prompts to your work"}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: 8,
                border: "1px solid var(--c-card-border)",
                background: "var(--c-card)", cursor: "pointer",
                fontSize: 16, color: "var(--c-text3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginLeft: 8,
              }}
            >×</button>
          </div>

          {/* Benefit pills */}
          <div style={{ display: "flex", gap: 6, marginTop: 12, marginBottom: 4, flexWrap: "wrap" }}>
            {[
              lang === "pl" ? "✨ Lepsze prompty" : "✨ Better prompts",
              lang === "pl" ? "🎯 Trafniejsze wyniki" : "🎯 Precise results",
              lang === "pl" ? "⚡ Szybciej" : "⚡ Faster",
            ].map(pill => (
              <span key={pill} style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 100,
                background: "rgba(255,110,64,0.08)", color: "#FF6E40",
                border: "1px solid rgba(255,110,64,0.2)", fontWeight: 500,
              }}>{pill}</span>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: 1, background: "var(--c-sep)", margin: "12px 0 0" }} />

        {/* Scrollable content — profile first */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 16px" }}>

          {/* Section: About you */}
          <SectionHeader
            icon="👤"
            text={lang === "pl" ? "O Tobie" : "About you"}
            hint={lang === "pl" ? "Mike używa tego żeby..." : "Mike uses this to..."}
          />

          <Field label={lang === "pl" ? "Twoje imię" : "Your name"}>
            <input
              type="text" value={p.name} maxLength={200}
              onChange={(e) => setP({ ...p, name: e.target.value })}
              placeholder={lang === "pl" ? "np. Anna" : "e.g. Anna"}
              style={inputStyle}
            />
          </Field>

          <Field label={lang === "pl" ? "Twoja rola" : "Your role"}>
            <select
              value={p.role}
              onChange={(e) => setP({ ...p, role: e.target.value })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">{lang === "pl" ? "Wybierz rolę…" : "Select role…"}</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div style={{ fontSize: 11, color: "var(--c-text4)", marginTop: 4 }}>
              {lang === "pl"
                ? "💡 np. wybieram 'Finance' → Mike dodaje kontekst finansowy do każdego promptu"
                : "💡 e.g. select 'Finance' → Mike adds financial context to every prompt"}
            </div>
          </Field>

          <Field label={lang === "pl" ? "Twoja branża" : "Your industry"}>
            <input
              type="text" value={p.industry} maxLength={200}
              onChange={(e) => setP({ ...p, industry: e.target.value })}
              placeholder={lang === "pl" ? "np. SaaS, Produkcja, Handel" : "e.g. SaaS, Manufacturing, Retail"}
              style={inputStyle}
            />
          </Field>

          {/* Live preview */}
          {p.role && (
            <div style={{
              background: "rgba(255,110,64,0.04)",
              border: "1px solid rgba(255,110,64,0.15)",
              borderRadius: 10,
              padding: "10px 12px",
              marginTop: 4,
              marginBottom: 4,
              fontSize: 12,
            }}>
              <span style={{ color: "var(--c-text3)" }}>
                {lang === "pl" ? "Twoje prompty będą teraz pisane dla " : "Your prompts will now be written for "}
              </span>
              <span style={{ color: "#FF6E40", fontWeight: 600 }}>
                {p.role}{p.industry ? ` · ${p.industry}` : ""}
              </span>
              <span style={{ color: "var(--c-text3)" }}> 🎯</span>
            </div>
          )}

          {/* Section: How you use AI */}
          <SectionHeader
            icon="🎯"
            text={lang === "pl" ? "Jak używasz AI" : "How you use AI"}
          />

          <Field label={lang === "pl" ? "Do czego używasz AI?" : "What do you use AI for?"}>
            <input
              type="text" value={p.usage} maxLength={200}
              onChange={(e) => setP({ ...p, usage: e.target.value })}
              placeholder={lang === "pl" ? "np. raporty, emaile, analiza danych" : "e.g. reports, emails, data analysis"}
              style={inputStyle}
            />
          </Field>

          <Field label={lang === "pl" ? "Twoje największe wyzwanie?" : "Your biggest challenge?"}>
            <input
              type="text" value={p.challenge} maxLength={200}
              onChange={(e) => setP({ ...p, challenge: e.target.value })}
              placeholder={lang === "pl" ? "np. oszczędność czasu przy zamknięciu miesiąca" : "e.g. saving time on month-end close"}
              style={inputStyle}
            />
          </Field>

          {/* Section: Your tools */}
          <SectionHeader icon="🛠️" text={lang === "pl" ? "Twoje narzędzia" : "Your tools"} />

          <Field label={lang === "pl" ? "Którego AI używasz najczęściej?" : "Which AI do you use most?"}>
            <select
              value={p.aiPreferred}
              onChange={(e) => setP({ ...p, aiPreferred: e.target.value })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">{lang === "pl" ? "Wybierz AI…" : "Select AI…"}</option>
              {AI_TOOLS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>

          <Field label={lang === "pl" ? "W jakich aplikacjach pracujesz?" : "Which apps do you work in?"}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {APP_CHIPS.map((app) => {
                const active = p.apps.includes(app);
                return (
                  <button
                    type="button"
                    key={app}
                    onClick={(e) => { e.preventDefault(); toggleApp(app); }}
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

          {/* Section: AI Level */}
          <SectionHeader icon="📊" text={lang === "pl" ? "Twoje doświadczenie z AI" : "Your experience with AI"} />

          <Field>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(lang === "pl" ? AI_LEVELS_PL : AI_LEVELS_EN).map((level, i) => {
                const enLevel = AI_LEVELS_EN[i];
                const active = p.aiLevel === enLevel;
                return (
                  <button
                    type="button"
                    key={enLevel}
                    onClick={(e) => { e.preventDefault(); setP({ ...p, aiLevel: enLevel }); }}
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

          {/* Section: Prompt history */}
          <SectionHeader icon="📂" text={lang === "pl" ? "Historia promptów" : "Prompt history"} />

          <div style={{ marginBottom: 12 }}>
            <label style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              cursor: "pointer", padding: "10px 12px",
              background: "var(--c-count-bg)", borderRadius: 10,
              border: "1px solid var(--c-card-border)",
            }}>
              <input
                type="checkbox"
                checked={p.saveHistory ?? true}
                onChange={e => setP({ ...p, saveHistory: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: "#FF6E40", marginTop: 1, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text1)", marginBottom: 4 }}>
                  {lang === "pl" ? "Zapisuj moją historię promptów" : "Save my prompt history"}
                </div>
                <div style={{ fontSize: 11, color: "var(--c-text3)", lineHeight: 1.6 }}>
                  {p.saveHistory ?? true
                    ? (lang === "pl"
                        ? "✅ Włączone: Twoje prompty są zapisywane — masz do nich dostęp w zakładce Historia."
                        : "✅ Enabled: Your prompts are saved — access them anytime in the History tab.")
                    : (lang === "pl"
                        ? "⛔ Wyłączone: Prompty nie są zapisywane nigdzie po zakończeniu sesji."
                        : "⛔ Disabled: Prompts are not saved after your session ends.")}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--c-sep)", flexShrink: 0 }}>
          {/* Main save button */}
          <button
            onClick={handleSave}
            style={{
              width: "100%", padding: "11px", borderRadius: 12, border: "none",
              background: saved
                ? "rgba(67,160,71,0.1)"
                : "linear-gradient(135deg, #FF6E40, #FF8A65)",
              color: saved ? "#43A047" : "white",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "all 0.3s", marginBottom: 10,
            }}
          >
            {saved
              ? (lang === "pl" ? "✓ Zapisano!" : "✓ Saved!")
              : (lang === "pl" ? "Zapisz preferencje" : "Save preferences")}
          </button>

          {/* Cloud save — secondary */}
          {!currentUser ? (
            <div style={{
              padding: "10px 12px",
              background: "var(--c-count-bg)",
              borderRadius: 10,
              border: "1px solid var(--c-card-border)",
            }}>
              <div style={{ fontSize: 11, color: "var(--c-text3)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                ☁️ <span>{lang === "pl" ? "Zapisz w chmurze — dostępne na każdym urządzeniu" : "Save to cloud — available on any device"}</span>
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="email@example.com"
                  onKeyDown={e => e.key === "Enter" && handleAuth()}
                  style={{
                    flex: 1, padding: "7px 10px", borderRadius: 8,
                    border: "1px solid var(--c-input-border)",
                    fontSize: 12, background: "var(--c-input)",
                    color: "var(--c-text1)", outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                {authMode !== "reset" && (
                  <input
                    type="password"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder={lang === "pl" ? "Hasło" : "Password"}
                    onKeyDown={e => e.key === "Enter" && handleAuth()}
                    style={{
                      width: 76, padding: "7px 10px", borderRadius: 8,
                      border: "1px solid var(--c-input-border)",
                      fontSize: 12, background: "var(--c-input)",
                      color: "var(--c-text1)", outline: "none",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={handleAuth}
                  disabled={authLoading}
                  style={{
                    padding: "7px 10px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                    color: "white", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}
                >
                  {authLoading ? "⏳" : authMode === "reset"
                    ? (lang === "pl" ? "Wyślij" : "Send")
                    : (lang === "pl" ? "Wejdź →" : "Go →")}
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(""); setAuthSuccess(""); }}
                  style={{ fontSize: 10, color: "var(--c-text4)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  {authMode === "login"
                    ? (lang === "pl" ? "Nie mam konta → Zarejestruj" : "No account → Register")
                    : (lang === "pl" ? "Mam już konto → Zaloguj" : "Have account → Sign in")}
                </button>
                {authMode === "login" && (
                  <button
                    type="button"
                    onClick={() => { setAuthMode("reset"); setAuthError(""); }}
                    style={{ fontSize: 10, color: "var(--c-text4)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                  >
                    {lang === "pl" ? "Zapomniałem hasła" : "Forgot password?"}
                  </button>
                )}
                {authMode === "reset" && (
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    style={{ fontSize: 10, color: "var(--c-text4)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                  >
                    {lang === "pl" ? "← Wróć" : "← Back"}
                  </button>
                )}
              </div>

              {authError && <div style={{ fontSize: 11, color: "#E53935", marginTop: 6 }}>{authError}</div>}
              {authSuccess && <div style={{ fontSize: 11, color: "#43A047", marginTop: 6 }}>{authSuccess}</div>}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "rgba(67,160,71,0.06)", borderRadius: 10 }}>
              <span style={{ fontSize: 13 }}>☁️</span>
              <span style={{ fontSize: 11, color: "#43A047", fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentUser.email}
              </span>
              <button type="button" onClick={handleLogout} style={{ fontSize: 10, color: "var(--c-text4)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                {lang === "pl" ? "wyloguj" : "sign out"}
              </button>
            </div>
          )}

          <p style={{ fontSize: 10, color: "var(--c-text4)", textAlign: "center", marginTop: 8, lineHeight: 1.4 }}>
            🔒 {lang === "pl" ? "Nic nie opuszcza Twojej przeglądarki" : "Nothing leaves your browser"}
          </p>
        </div>
      </div>
    </>
  );
}
