"use client";

import { useState, useEffect, useRef } from "react";

// Token estimation (rough: 1 token ≈ 4 chars for English)
const estimateTokens = (text: string) => Math.ceil(text.length / 4);

// Cost per 1K input tokens (approximate, mid-2026)
const MODEL_COSTS: Record<string, number> = {
  "Claude Opus": 0.015,
  "Claude Sonnet": 0.003,
  "GPT-4o": 0.005,
  "GPT-4o mini": 0.00015,
  "Gemini Pro": 0.00125,
};

const MikePromptMVP = () => {
  const [input, setInput] = useState("");
  const [optimized, setOptimized] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const MAX_FREE = 5;

  useEffect(() => {
    setVisible(true);
  }, []);

  const optimizePrompt = async () => {
    if (!input.trim()) return;
    if (usageCount >= MAX_FREE && !emailSubmitted) {
      setError("signup");
      return;
    }
    setLoading(true);
    setError("");
    setShowResults(false);
    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API error");
      const result = data.result || "Something went wrong. Try again.";
      setOptimized(result);
      setShowResults(true);
      setUsageCount((prev) => prev + 1);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    } catch {
      setError("network");
    }
    setLoading(false);
  };

  const inputTokens = estimateTokens(input);
  const outputTokens = estimateTokens(optimized);
  const efficiencyGain =
    outputTokens > 0
      ? Math.round(((outputTokens - inputTokens) / outputTokens) * 100)
      : 0;

  const examplePrompts = [
    { label: "📊 Sales report", text: "write me a sales report" },
    { label: "📧 Client email", text: "write email to client about delay" },
    { label: "📋 Meeting notes", text: "summarize my meeting" },
    { label: "💡 Strategy", text: "give me ideas for marketing" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(165deg, #FFF8F0 0%, #FFF1E6 30%, #FFE8D6 60%, #FFDDC1 100%)",
        fontFamily: "'DM Sans', sans-serif",
        color: "#2D2A26",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      {/* Floating bg shapes */}
      <div
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
      >
        <div
          style={{
            position: "absolute",
            top: "8%",
            right: "8%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,183,77,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "5%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,138,101,0.08) 0%, transparent 70%)",
          }}
        />
      </div>
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          position: "relative",
          zIndex: 10,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-20px)",
          transition: "all 0.8s ease",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #FF8A65, #FF6E40)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "white",
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(255,110,64,0.25)",
              fontFamily: "'Fraunces', serif",
            }}
          >
            M
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              fontFamily: "'Fraunces', serif",
            }}
          >
            mike<span style={{ color: "#FF6E40" }}>prompt</span>
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#A09890", fontWeight: 500 }}>
          {MAX_FREE - usageCount > 0
            ? `${MAX_FREE - usageCount} free polishes left`
            : "Sign up for more"}
        </div>
      </nav>
      {/* Main content */}
      <main
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "20px 32px 60px",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Hero */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.2s",
          }}
        >
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 16,
              letterSpacing: "-1px",
            }}
          >
            Paste your prompt.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Mike makes it better.
            </span>
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "#6B6560",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Better prompts → better AI answers → less time and money wasted.
          </p>
        </div>
        {/* Quick examples */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 24,
            opacity: visible ? 1 : 0,
            transition: "all 0.8s ease 0.4s",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "#A09890",
              alignSelf: "center",
              marginRight: 4,
            }}
          >
            Try:
          </span>
          {examplePrompts.map((ex) => (
            <button
              key={ex.label}
              onClick={() => {
                setInput(ex.text);
                setShowResults(false);
                setOptimized("");
              }}
              style={{
                padding: "6px 14px",
                borderRadius: 100,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "white",
                fontSize: 13,
                color: "#6B6560",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "#FF8A65";
                (e.target as HTMLButtonElement).style.color = "#FF6E40";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.borderColor =
                  "rgba(0,0,0,0.06)";
                (e.target as HTMLButtonElement).style.color = "#6B6560";
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
        {/* Input card */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.5s",
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "14px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(0,0,0,0.01)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#FF6E40",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#FFB74D",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#81C784",
                }}
              />
            </div>
            <span style={{ fontSize: 12, color: "#C0B8B0", fontWeight: 500 }}>
              {inputTokens > 0 ? `~${inputTokens} tokens` : ""}
            </span>
          </div>
          {/* Textarea */}
          <div style={{ padding: "20px 24px" }}>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowResults(false);
              }}
              placeholder="Type or paste your prompt here... e.g. 'write me a report about Q1 sales'"
              rows={4}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                resize: "vertical",
                fontSize: 16,
                lineHeight: 1.7,
                color: "#2D2A26",
                fontFamily: "'DM Sans', sans-serif",
                background: "transparent",
                minHeight: 100,
              }}
            />
          </div>
          {/* Action bar */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid rgba(0,0,0,0.04)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 13, color: "#A09890" }}>
              {input.length > 0
                ? `${input.length} characters`
                : "Paste anything — Mike handles the rest"}
            </div>
            <button
              onClick={optimizePrompt}
              disabled={loading || !input.trim()}
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                border: "none",
                background: loading
                  ? "linear-gradient(135deg, #FFAB91, #FFCCBC)"
                  : input.trim()
                  ? "linear-gradient(135deg, #FF6E40, #FF8A65)"
                  : "rgba(0,0,0,0.06)",
                color: input.trim() ? "white" : "#C0B8B0",
                fontSize: 15,
                fontWeight: 600,
                cursor: input.trim() ? "pointer" : "default",
                boxShadow: input.trim()
                  ? "0 4px 16px rgba(255,110,64,0.3)"
                  : "none",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Mike is thinking...
                </>
              ) : (
                <>🔧 Polish it</>
              )}
            </button>
          </div>
        </div>
        {/* Error states */}
        {error === "signup" && (
          <div
            style={{
              marginTop: 20,
              padding: "20px 24px",
              borderRadius: 16,
              background: "white",
              border: "1px solid rgba(255,110,64,0.15)",
              textAlign: "center",
            }}
          >
            <p
              style={{ fontSize: 15, color: "#6B6560", marginBottom: 12 }}
            >
              You&apos;ve used all {MAX_FREE} free polishes. Drop your email to
              get more!
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) {
                  setEmailSubmitted(true);
                  setError("");
                  setUsageCount(0);
                }
              }}
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.08)",
                  fontSize: 14,
                  outline: "none",
                  minWidth: 220,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Unlock more
              </button>
            </form>
          </div>
        )}
        {error === "network" && (
          <div
            style={{
              marginTop: 20,
              padding: "16px 24px",
              borderRadius: 12,
              background: "#FFF5F5",
              border: "1px solid rgba(244,67,54,0.1)",
              fontSize: 14,
              color: "#E53935",
              textAlign: "center",
            }}
          >
            Something went wrong. Please try again.
          </div>
        )}
        {/* Results */}
        {showResults && optimized && (
          <div
            ref={resultRef}
            style={{
              marginTop: 24,
              background: "white",
              borderRadius: 20,
              border: "1px solid rgba(76,175,80,0.12)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
              overflow: "hidden",
              animation: "fadeUp 0.5s ease",
            }}
          >
            {/* Result header */}
            <div
              style={{
                padding: "14px 24px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(76,175,80,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#43A047",
                }}
              >
                <span>✨</span> Mike&apos;s polished version
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(optimized)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: "white",
                  fontSize: 12,
                  color: "#6B6560",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                📋 Copy
              </button>
            </div>
            {/* Optimized prompt */}
            <div style={{ padding: "20px 24px" }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: "#2D2A26",
                  whiteSpace: "pre-wrap",
                }}
              >
                {optimized}
              </div>
            </div>
            {/* Stats bar */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid rgba(0,0,0,0.04)",
                background: "rgba(0,0,0,0.01)",
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>📊</span>
                <span style={{ fontSize: 13, color: "#6B6560" }}>
                  <strong style={{ color: "#2D2A26" }}>{inputTokens}</strong> →{" "}
                  <strong style={{ color: "#43A047" }}>{outputTokens}</strong>{" "}
                  tokens
                </span>
              </div>
              <div
                style={{
                  height: 16,
                  width: 1,
                  background: "rgba(0,0,0,0.06)",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>✨</span>
                <span style={{ fontSize: 13, color: "#6B6560" }}>
                  <strong style={{ color: "#FF6E40" }}>
                    {Math.abs(efficiencyGain)}%
                  </strong>{" "}
                  more context per token
                </span>
              </div>
              <div
                style={{
                  height: 16,
                  width: 1,
                  background: "rgba(0,0,0,0.06)",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>💰</span>
                <span style={{ fontSize: 13, color: "#6B6560" }}>
                  Better results,{" "}
                  <strong style={{ color: "#43A047" }}>fewer retries</strong>
                </span>
              </div>
            </div>
            {/* Cost comparison table */}
            <div
              style={{
                padding: "16px 24px 20px",
                borderTop: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#A09890",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Cost per use by model
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Object.entries(MODEL_COSTS).map(([model, costPer1k]) => {
                  const cost = ((outputTokens / 1000) * costPer1k).toFixed(5);
                  return (
                    <div
                      key={model}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 10,
                        background: "rgba(0,0,0,0.02)",
                        border: "1px solid rgba(0,0,0,0.04)",
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: "#A09890" }}>{model}: </span>
                      <strong style={{ color: "#2D2A26" }}>${cost}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* Waitlist CTA */}
        {!emailSubmitted && (
          <div
            style={{
              marginTop: 48,
              textAlign: "center",
              padding: "40px 32px",
              borderRadius: 20,
              background: "white",
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🧡</div>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 8,
                letterSpacing: "-0.5px",
              }}
            >
              Like what Mike does?
            </h2>
            <p
              style={{ fontSize: 15, color: "#6B6560", marginBottom: 20 }}
            >
              Join the waitlist. Pro features, API access, and team tools
              coming soon.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setEmailSubmitted(true);
              }}
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: "2px solid rgba(0,0,0,0.06)",
                  fontSize: 15,
                  outline: "none",
                  minWidth: 240,
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor = "#FF8A65")
                }
                onBlur={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "rgba(0,0,0,0.06)")
                }
              />
              <button
                type="submit"
                style={{
                  padding: "14px 28px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(255,110,64,0.3)",
                }}
              >
                Join waitlist
              </button>
            </form>
          </div>
        )}
        {emailSubmitted && (
          <div
            style={{
              marginTop: 48,
              textAlign: "center",
              padding: "32px",
              borderRadius: 20,
              background: "rgba(76,175,80,0.06)",
              border: "1px solid rgba(76,175,80,0.12)",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#2E7D32" }}>
              You&apos;re on the list! Mike will email you when Pro launches.
            </p>
          </div>
        )}
        {/* Footer */}
        <footer
          style={{
            marginTop: 60,
            paddingBottom: 32,
            textAlign: "center",
            fontSize: 13,
            color: "#A09890",
          }}
        >
          Built with 🧡 in Warsaw · mikeprompt.com
        </footer>
      </main>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        textarea::placeholder, input::placeholder { color: #C0B8B0; }
      `}</style>
    </div>
  );
};

export default MikePromptMVP;
