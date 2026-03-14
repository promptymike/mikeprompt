import Link from "next/link";

export interface LandingPageData {
  segment: string;
  heroTitle: string;
  heroTitlePl: string;
  heroSubtitle: string;
  heroSubtitlePl: string;
  heroCta: string;
  heroCtaPl: string;
  role: string;
  painPoints: { icon: string; en: string; pl: string }[];
  useCasePrompts: string[];
  socialProof: { quote: string; name: string; role: string }[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

interface LandingPageProps {
  data: LandingPageData;
  lang?: "en" | "pl";
}

export default function LandingPage({ data, lang = "en" }: LandingPageProps) {
  const isPl = lang === "pl";
  const title = isPl ? data.heroTitlePl : data.heroTitle;
  const subtitle = isPl ? data.heroSubtitlePl : data.heroSubtitle;
  const cta = isPl ? data.heroCtaPl : data.heroCta;

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: "100vh",
      background: "#FAFAF8",
      color: "#1a1a2e",
    }}>
      {/* Topbar */}
      <nav style={{
        maxWidth: 900, margin: "0 auto",
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 20, fontWeight: 700,
            color: "#FF6E40", letterSpacing: "-0.4px",
          }}>
            Mike<span style={{ color: "#1a1a2e" }}>Prompt</span>
          </span>
        </Link>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "8px 20px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
            color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            {cta}
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: 760, margin: "0 auto",
        padding: "60px 24px 48px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block",
          background: "rgba(255,110,64,0.1)",
          color: "#FF6E40", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.8px", textTransform: "uppercase",
          padding: "5px 14px", borderRadius: 100, marginBottom: 20,
        }}>
          {isPl ? "Darmowe narzędzie AI" : "Free AI tool"}
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 700, lineHeight: 1.12,
          letterSpacing: "-1px", marginBottom: 20,
          color: "#1a1a2e",
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: "clamp(15px, 2.5vw, 18px)",
          color: "#4a4a6a", lineHeight: 1.7,
          maxWidth: 600, margin: "0 auto 32px",
        }}>
          {subtitle}
        </p>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "14px 32px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
            color: "white", fontSize: 16, fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(255,110,64,0.35)",
            letterSpacing: "-0.2px",
          }}>
            {cta} →
          </button>
        </Link>
        <p style={{ fontSize: 12, color: "#9999b3", marginTop: 12 }}>
          {isPl ? "Bez rejestracji · Działa z ChatGPT, Claude, Gemini" : "No sign up · Works with ChatGPT, Claude, Gemini"}
        </p>
      </section>

      {/* Pain points */}
      <section style={{
        maxWidth: 760, margin: "0 auto", padding: "0 24px 48px",
      }}>
        <div style={{
          textAlign: "center",
          fontSize: 11, fontWeight: 700, color: "#9999b3",
          textTransform: "uppercase", letterSpacing: "0.8px",
          marginBottom: 24,
        }}>
          {isPl ? "Znasz to uczucie?" : "Sound familiar?"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {data.painPoints.map((p, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.06)",
              padding: "18px 20px",
              display: "flex", alignItems: "flex-start", gap: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{p.icon}</span>
              <span style={{ fontSize: 14, color: "#4a4a6a", lineHeight: 1.55 }}>
                {isPl ? p.pl : p.en}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{
        background: "white",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "48px 24px",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#9999b3",
            textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 24,
          }}>
            {isPl ? "Jak to działa" : "How it works"}
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { step: "1", en: "Paste your rough idea", pl: "Wklej swój surowy pomysł" },
              { step: "2", en: "Mike adds context, structure & constraints", pl: "Mike dodaje kontekst, strukturę i ograniczenia" },
              { step: "3", en: "Copy into ChatGPT, Claude or Gemini", pl: "Skopiuj do ChatGPT, Claude lub Gemini" },
              { step: "4", en: "Get professional results instantly", pl: "Otrzymaj profesjonalne wyniki natychmiast" },
            ].map((s) => (
              <div key={s.step} style={{
                flex: "1 1 160px", minWidth: 140,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 16, fontWeight: 700,
                }}>
                  {s.step}
                </div>
                <span style={{ fontSize: 14, color: "#4a4a6a", textAlign: "center", lineHeight: 1.5 }}>
                  {isPl ? s.pl : s.en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{
          textAlign: "center",
          fontSize: 11, fontWeight: 700, color: "#9999b3",
          textTransform: "uppercase", letterSpacing: "0.8px",
          marginBottom: 24,
        }}>
          {isPl ? "Co mówią użytkownicy" : "What users say"}
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {data.socialProof.map((sp, i) => (
            <div key={i} style={{
              flex: "1 1 300px",
              background: "white", borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.06)",
              padding: "22px 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 22, color: "#FF6E40", marginBottom: 12 }}>&ldquo;</div>
              <p style={{ fontSize: 15, color: "#4a4a6a", lineHeight: 1.65, marginBottom: 16, fontStyle: "italic" }}>
                {sp.quote}
              </p>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{sp.name}</div>
              <div style={{ fontSize: 12, color: "#9999b3" }}>{sp.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
        padding: "48px 24px", textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(22px, 4vw, 36px)",
          fontWeight: 700, color: "white",
          marginBottom: 12, letterSpacing: "-0.6px",
        }}>
          {isPl ? "Gotowy na lepsze wyniki?" : "Ready to get better results?"}
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", marginBottom: 28 }}>
          {isPl ? "Darmowe. Bez rejestracji. Gotowe w 30 sekund." : "Free. No sign up. Ready in 30 seconds."}
        </p>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "14px 36px", borderRadius: 14, border: "2px solid white",
            background: "white", color: "#FF6E40",
            fontSize: 16, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
          }}>
            {cta} →
          </button>
        </Link>
      </section>

      {/* Trust footer */}
      <footer style={{
        maxWidth: 760, margin: "0 auto",
        padding: "24px 24px",
        textAlign: "center",
        fontSize: 12, color: "#9999b3",
      }}>
        🔒 {isPl
          ? "Twoje prompty nie są przechowywane · Działa z ChatGPT, Claude, Gemini, Copilot · Zbudowany przez profesjonalistów"
          : "Your prompts are not stored · Works with ChatGPT, Claude, Gemini, Copilot · Built by professionals"
        }
      </footer>
    </div>
  );
}
