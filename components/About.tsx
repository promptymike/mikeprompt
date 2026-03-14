"use client";

export default function About() {
  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(26px, 5vw, 40px)",
          fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.8px",
          marginBottom: 16, color: "var(--c-text1)",
        }}>
          Built by people who actually do the work.
        </h2>
        <p style={{ fontSize: 16, color: "var(--c-text2)", maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>
          MikePrompt was created by senior auditors, financial controllers, and startup operators
          who got tired of wasting time on bad AI prompts.
        </p>
      </div>

      {/* Our story */}
      <div style={{
        background: "var(--c-card)", borderRadius: 18,
        border: "1px solid var(--c-card-border)",
        padding: "26px 30px", marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#FF6E40", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>
          Our story
        </div>
        <p style={{ fontSize: 15, color: "var(--c-text2)", lineHeight: 1.78, marginBottom: 14 }}>
          We spent years in Big 4 audit and finance at award-winning startups. We wrote thousands
          of reports, emails, and analyses. When AI arrived, we saw everyone struggling with the
          same problem — they knew <strong style={{ color: "var(--c-text1)" }}>WHAT</strong> they
          wanted, but couldn't tell AI <strong style={{ color: "var(--c-text1)" }}>HOW</strong> to
          deliver it.
        </p>
        <p style={{ fontSize: 15, color: "var(--c-text2)", lineHeight: 1.78 }}>
          Mike fixes that gap. Not by replacing you — by making you faster, sharper, and more
          precise.{" "}
          <strong style={{ color: "var(--c-text1)" }}>
            Your knowledge + Mike's prompting expertise = results that used to take hours, done in minutes.
          </strong>
        </p>
      </div>

      {/* This is for you if... */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "var(--c-text3)",
          textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 14,
        }}>
          This is for you if…
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { icon: "🚀", title: "You want a promotion", body: "Better outputs = better visibility. Show your boss what you can do when AI actually listens." },
            { icon: "⏰", title: "You want your time back", body: "Stop spending 30 minutes fighting ChatGPT. Get it right on the first try." },
            { icon: "💪", title: "You want to stay ahead", body: "AI won't replace you. But someone using AI well might. Be that person." },
          ].map((card) => (
            <div key={card.title} style={{
              flex: "1 1 200px", minWidth: 180,
              background: "var(--c-card)", borderRadius: 16,
              border: "1px solid var(--c-card-border)",
              padding: "20px 22px",
            }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--c-text1)", marginBottom: 7 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: "var(--c-text2)", lineHeight: 1.62 }}>{card.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Credentials */}
      <div style={{
        background: "var(--c-card)", borderRadius: 18,
        border: "1px solid var(--c-card-border)",
        padding: "22px 30px", marginBottom: 20, textAlign: "center",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "var(--c-text3)",
          textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 18,
        }}>
          Built with experience from:
        </div>
        <div style={{
          display: "flex", gap: 20, justifyContent: "center",
          alignItems: "center", flexWrap: "wrap", marginBottom: 14,
        }}>
          {["PwC", "Big 4 Audit", "Series B Startups", "ACCA Qualified", "Award-winning ConTech"].map((cred) => (
            <span key={cred} style={{
              fontSize: 14, fontWeight: 700, color: "var(--c-text4)",
              fontFamily: "'Fraunces', serif", letterSpacing: "0.2px",
            }}>
              {cred}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--c-text4)", fontStyle: "italic", margin: 0 }}>
          These represent our team's professional background, not partnerships or endorsements.
        </p>
      </div>

      {/* Our promise */}
      <div style={{
        background: "var(--c-card)", borderRadius: 18,
        border: "1px solid var(--c-card-border)",
        padding: "22px 30px", marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#FF6E40", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>
          Our promise
        </div>
        <p style={{ fontSize: 15, color: "var(--c-text2)", lineHeight: 1.78, margin: 0 }}>
          🔒 <strong style={{ color: "var(--c-text1)" }}>Your data is yours.</strong> We don't store
          your prompts. We don't train models on your input. Mike runs on Claude by Anthropic — the
          same AI trusted by enterprises worldwide. We charge only to keep the lights on, not to get
          rich off your data.
        </p>
      </div>

      {/* For everyone */}
      <div style={{
        background: "var(--c-card)", borderRadius: 18,
        border: "1px solid var(--c-card-border)",
        padding: "22px 30px", marginBottom: 20,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "var(--c-text3)",
          textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12,
        }}>
          For everyone
        </div>
        <p style={{ fontSize: 15, color: "var(--c-text2)", lineHeight: 1.78, margin: 0 }}>
          MikePrompt is for every professional who uses AI at work — finance, sales, admin,
          accounting, management, HR, students. We believe AI should make humans better, not replace
          them. Every feature we build answers one question:{" "}
          <strong style={{ color: "var(--c-text1)" }}>does this help someone do their best work?</strong>
        </p>
      </div>

      {/* Section footer */}
      <div style={{ textAlign: "center", padding: "24px 0", color: "var(--c-text3)", fontSize: 14 }}>
        Made with 🧡 in Warsaw, Poland. For humans everywhere.
      </div>
    </div>
  );
}
