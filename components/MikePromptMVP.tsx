"use client";

import { useState, useEffect, useRef } from "react";

const estimateTokens = (text: string) => Math.ceil(text.length / 4);

const EXAMPLE_CHIPS = [
  { icon: "📊", label: "budget report", prompt: "write a budget report" },
  { icon: "📧", label: "supplier email", prompt: "write email to supplier about late delivery" },
  { icon: "📋", label: "meeting agenda", prompt: "prepare meeting agenda for Monday" },
  { icon: "🧮", label: "invoice issue", prompt: "explain this invoice discrepancy to client" },
  { icon: "💼", label: "performance review", prompt: "write performance review for team member" },
  { icon: "🤝", label: "cold outreach to CFO", prompt: "prepare cold outreach message for CFO" },
  { icon: "📊", label: "quarterly costs", prompt: "analyze quarterly costs" },
  { icon: "💼", label: "project update", prompt: "create project status update for stakeholders" },
];

const ROLES = ["Finance", "Admin", "Accounting", "Sales", "Management", "HR", "Other"];

const PRO_TIPS = [
  "Always specify your audience — AI writes differently for a CEO than for a colleague",
  "Add 'Format as...' at the end to control output structure",
  "Tell AI what to avoid — it's as important as what to include",
  "Break complex tasks into numbered steps for better results",
  "Specify tone: formal, casual, technical, friendly — don't leave it to chance",
  "Include an example of what good output looks like",
  "Set a word/page limit — without it AI tends to over-explain",
  "Start with a role: 'Act as a senior financial analyst...' changes everything",
  "If asking for analysis, specify what data points matter most",
  "Ask for pros AND cons — AI defaults to positive if you don't",
  "Specify the time period — 'recent' means different things to different AIs",
  "One prompt, one task. Split complex requests into separate prompts",
  "Add context about what you already know to avoid basic explanations",
  "Tell AI your experience level so it calibrates depth appropriately",
  "End with 'Before you start, ask me 3 clarifying questions' for complex tasks",
];

const TODAY_KEY = () => `mikeprompt_count_${new Date().toISOString().slice(0, 10)}`;

const getStoredCount = (): number => {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(TODAY_KEY()) ?? "0", 10);
};

const incrementStoredCount = (): number => {
  const next = getStoredCount() + 1;
  localStorage.setItem(TODAY_KEY(), String(next));
  return next;
};

const MikePromptMVP = () => {
  const [input, setInput] = useState("");
  const [optimized, setOptimized] = useState("");
  const [fixes, setFixes] = useState<string[]>([]);
  const [proTip, setProTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [userName, setUserName] = useState("");
  const [dailyCount, setDailyCount] = useState(0);
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);
  const [selectedChat, setSelectedChat] = useState("ChatGPT");
  const [selectedProduct, setSelectedProduct] = useState("General");
  const resultRef = useRef<HTMLDivElement>(null);
  const MAX_FREE = 5;

  useEffect(() => {
    setVisible(true);
    setDailyCount(getStoredCount());
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
        body: JSON.stringify({
          prompt: input,
          role: role || undefined,
          goal: goal || undefined,
          name: userName || undefined,
          selectedChat,
          selectedProduct,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API error");
      const result = data.result || "Something went wrong. Try again.";
      setOptimized(result);
      setFixes(Array.isArray(data.fixes) ? data.fixes : []);
      setProTip(PRO_TIPS[Math.floor(Math.random() * PRO_TIPS.length)]);
      setFeedback(null);
      setShowResults(true);
      setUsageCount((prev) => prev + 1);
      const newCount = incrementStoredCount();
      setDailyCount(newCount);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch {
      setError("network");
    }
    setLoading(false);
  };

  const copyText = (text: string) => navigator.clipboard.writeText(text);

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type);
    console.log({
      timestamp: new Date().toISOString(),
      original_prompt: input,
      optimized_prompt: optimized,
      feedback: type,
      user_role: role || null,
      user_goal: goal || null,
    });
  };

  const inputTokens = estimateTokens(input);
  const outputTokens = estimateTokens(optimized);
  const precisionGain =
    outputTokens > 0
      ? Math.abs(Math.round(((outputTokens - inputTokens) / outputTokens) * 100))
      : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(165deg, #FFF8F0 0%, #FFF1E6 30%, #FFE8D6 60%, #FFDDC1 100%)",
      fontFamily: "'DM Sans', sans-serif",
      color: "#2D2A26",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      {/* Floating bg shapes */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "8%", right: "8%", width: 350, height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,183,77,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", left: "5%", width: 250, height: 250,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,138,101,0.08) 0%, transparent 70%)",
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 40px", position: "relative", zIndex: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-20px)",
        transition: "all 0.8s ease",
        maxWidth: 1200, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #FF8A65, #FF6E40)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color: "white", fontWeight: 700,
            boxShadow: "0 4px 14px rgba(255,110,64,0.25)",
            fontFamily: "'Fraunces', serif",
          }}>M</div>
          <div>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", fontFamily: "'Fraunces', serif" }}>
              mike<span style={{ color: "#FF6E40" }}>prompt</span>
            </span>
            <div style={{ fontSize: 11, color: "#C0B8B0", fontWeight: 400, letterSpacing: "0.2px", marginTop: -2 }}>
              AI for humans
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {dailyCount > 0 && (
            <div style={{
              fontSize: 13, color: "#FF6E40", fontWeight: 600,
              background: "rgba(255,110,64,0.08)", borderRadius: 100,
              padding: "4px 12px",
            }}>
              🔥 {dailyCount} prompt{dailyCount !== 1 ? "s" : ""} polished today
            </div>
          )}
          <div style={{ fontSize: 13, color: "#A09890", fontWeight: 500 }}>
            {MAX_FREE - usageCount > 0
              ? `${MAX_FREE - usageCount} free polishes left`
              : "Sign up for more"}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main style={{
        maxWidth: 800, margin: "0 auto", padding: "20px 24px 60px",
        position: "relative", zIndex: 5,
      }}>
        {/* Hero */}
        <div style={{
          textAlign: "center", marginBottom: 16,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease 0.2s",
        }}>
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(34px, 6vw, 56px)",
            fontWeight: 700, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-1.5px",
          }}>
            AI that makes{" "}
            <span style={{
              background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              YOU
            </span>{" "}
            better.
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", maxWidth: 480, margin: "0 auto 12px", lineHeight: 1.6 }}>
            Not another chatbot. Mike polishes your prompts so every AI gives you better answers.
          </p>
          <p style={{ fontSize: 13, color: "#B0A89E", marginBottom: 8 }}>
            Works with ChatGPT · Claude · Gemini · Copilot · any AI
          </p>
          <p style={{ fontSize: 12, color: "#C8C0BA", fontStyle: "italic" }}>
            The average worker wastes 23 min/day retrying AI prompts.
          </p>
        </div>

        {/* ── Example chips ── */}
        <div style={{
          marginBottom: 28,
          opacity: visible ? 1 : 0, transition: "all 0.8s ease 0.35s",
        }}>
          <p style={{
            fontSize: 12, fontWeight: 600, color: "#C0B8B0",
            textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10,
            textAlign: "center",
          }}>
            Try an example:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {EXAMPLE_CHIPS.map((chip) => (
              <button
                key={chip.prompt}
                onClick={() => { setInput(chip.prompt); setShowResults(false); setOptimized(""); setFixes([]); }}
                style={{
                  padding: "7px 14px", borderRadius: 100,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.8)",
                  fontSize: 13, color: "#6B6560", cursor: "pointer",
                  transition: "all 0.18s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
                onMouseOver={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "#FF8A65";
                  el.style.color = "#FF6E40";
                  el.style.background = "rgba(255,110,64,0.04)";
                  el.style.boxShadow = "0 2px 8px rgba(255,110,64,0.12)";
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(0,0,0,0.08)";
                  el.style.color = "#6B6560";
                  el.style.background = "rgba(255,255,255,0.8)";
                  el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                }}
              >
                {chip.icon} {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Input card ── */}
        <div style={{
          background: "white", borderRadius: 20,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease 0.5s",
        }}>
          {/* Textarea */}
          <div style={{ padding: "24px 24px 0" }}>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setShowResults(false); }}
              placeholder="Type or paste your prompt here…"
              rows={4}
              style={{
                width: "100%", border: "none", outline: "none", resize: "vertical",
                fontSize: 16, lineHeight: 1.7, color: "#2D2A26",
                fontFamily: "'DM Sans', sans-serif", background: "transparent",
                minHeight: 100,
              }}
            />
          </div>

          {/* ── Chat & Product selectors ── */}
          <div style={{
            padding: "12px 24px", borderTop: "1px solid rgba(0,0,0,0.04)",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {/* Chat selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#A09890", fontWeight: 600, minWidth: 80 }}>
                Optimize for:
              </span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["ChatGPT", "Claude", "Gemini", "Copilot"].map((chat) => (
                  <button
                    key={chat}
                    onClick={() => setSelectedChat(chat)}
                    style={{
                      padding: "5px 12px", borderRadius: 100,
                      border: selectedChat === chat
                        ? "1px solid #FF8A65"
                        : "1px solid rgba(0,0,0,0.08)",
                      background: selectedChat === chat
                        ? "rgba(255,110,64,0.07)"
                        : "white",
                      fontSize: 12,
                      color: selectedChat === chat ? "#FF6E40" : "#A09890",
                      fontWeight: selectedChat === chat ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {chat}
                  </button>
                ))}
              </div>
            </div>
            {/* Product selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#A09890", fontWeight: 600, minWidth: 80 }}>
                Output for:
              </span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { label: "📧 Email", value: "Email" },
                  { label: "📊 Excel", value: "Excel" },
                  { label: "📑 PowerPoint", value: "PowerPoint" },
                  { label: "📄 Document", value: "Document" },
                  { label: "💬 General", value: "General" },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedProduct(value)}
                    style={{
                      padding: "5px 12px", borderRadius: 100,
                      border: selectedProduct === value
                        ? "1px solid #FF8A65"
                        : "1px solid rgba(0,0,0,0.08)",
                      background: selectedProduct === value
                        ? "rgba(255,110,64,0.07)"
                        : "white",
                      fontSize: 12,
                      color: selectedProduct === value ? "#FF6E40" : "#A09890",
                      fontWeight: selectedProduct === value ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* Trust badge */}
            <p style={{ fontSize: 12, color: "#C0B8B0", textAlign: "center", marginTop: 2 }}>
              🔒 Your prompts are not stored · Powered by Claude · Works with every AI
            </p>
          </div>

          {/* Action bar */}
          <div style={{
            padding: "14px 24px", borderTop: "1px solid rgba(0,0,0,0.04)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ fontSize: 13, color: "#C0B8B0" }}>
              {input.length > 0 ? `${input.length} chars` : "Paste anything — Mike handles the rest"}
            </div>
            <button
              onClick={optimizePrompt}
              disabled={loading || !input.trim()}
              style={{
                padding: "11px 26px", borderRadius: 12, border: "none",
                background: loading
                  ? "linear-gradient(135deg, #FFAB91, #FFCCBC)"
                  : input.trim()
                  ? "linear-gradient(135deg, #FF6E40, #FF8A65)"
                  : "rgba(0,0,0,0.06)",
                color: input.trim() ? "white" : "#C0B8B0",
                fontSize: 15, fontWeight: 600,
                cursor: input.trim() ? "pointer" : "default",
                boxShadow: input.trim() ? "0 4px 16px rgba(255,110,64,0.3)" : "none",
                transition: "all 0.3s",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    display: "inline-block", width: 16, height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Mike is thinking...
                </>
              ) : (
                <>🔧 Polish it</>
              )}
            </button>
          </div>

          {/* ── Help Mike help you (collapsible) ── */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
            <button
              onClick={() => setContextOpen((v) => !v)}
              style={{
                width: "100%", padding: "10px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "transparent",
                border: "none", cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 12, color: "#C0B8B0", fontWeight: 500 }}>
                🎯 Personalise for better results
              </span>
              <span style={{
                fontSize: 11, color: "#D0C8C0",
                transform: contextOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s", display: "inline-block",
              }}>▼</span>
            </button>

            {contextOpen && (
              <div style={{
                padding: "4px 24px 20px",
                display: "flex", flexWrap: "wrap", gap: 12,
                animation: "fadeUp 0.2s ease",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "1 1 160px" }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#C0B8B0", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Your role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      padding: "8px 12px", borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.08)",
                      fontSize: 13, color: role ? "#2D2A26" : "#C0B8B0",
                      background: "white", outline: "none", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <option value="">Select role…</option>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "2 1 200px" }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#C0B8B0", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Your goal
                  </label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. save time on reports"
                    style={{
                      padding: "8px 12px", borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.08)",
                      fontSize: 13, color: "#2D2A26", background: "white",
                      outline: "none", fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.08)")}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "1 1 140px" }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#C0B8B0", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Your name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Anna"
                    style={{
                      padding: "8px 12px", borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.08)",
                      fontSize: 13, color: "#2D2A26", background: "white",
                      outline: "none", fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.08)")}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error states */}
        {error === "signup" && (
          <div style={{
            marginTop: 16, padding: "18px 24px", borderRadius: 16,
            background: "white", border: "1px solid rgba(255,110,64,0.15)",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 14, color: "#6B6560", marginBottom: 12 }}>
              You&apos;ve used all {MAX_FREE} free polishes. Drop your email to unlock more.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) { setEmailSubmitted(true); setError(""); setUsageCount(0); } }}
              style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}
            >
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)",
                  fontSize: 14, outline: "none", minWidth: 220,
                }} />
              <button type="submit" style={{
                padding: "10px 20px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>Unlock more</button>
            </form>
          </div>
        )}
        {error === "network" && (
          <div style={{
            marginTop: 16, padding: "14px 24px", borderRadius: 12,
            background: "#FFF5F5", border: "1px solid rgba(244,67,54,0.1)",
            fontSize: 14, color: "#E53935", textAlign: "center",
          }}>
            Something went wrong. Please try again.
          </div>
        )}

        {/* ── Results ── */}
        {showResults && optimized && (
          <div ref={resultRef} style={{
            marginTop: 24, background: "white", borderRadius: 20,
            border: "1px solid rgba(76,175,80,0.12)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.05)",
            overflow: "hidden", animation: "fadeUp 0.5s ease",
          }}>
            {/* Result header */}
            <div style={{
              padding: "14px 24px", borderBottom: "1px solid rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(76,175,80,0.03)", flexWrap: "wrap", gap: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#43A047" }}>
                <span>✨</span> Mike&apos;s polished version
              </div>
              <button
                onClick={() => copyText(optimized)}
                style={{
                  padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)",
                  background: "white", fontSize: 12, color: "#6B6560", cursor: "pointer",
                  fontWeight: 500, transition: "all 0.2s",
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = "#FF8A65"; e.currentTarget.style.color = "#FF6E40"; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#6B6560"; }}
              >
                📋 Copy prompt
              </button>
            </div>

            {/* Optimized prompt */}
            <div style={{ padding: "20px 24px" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
                lineHeight: 1.8, color: "#2D2A26", whiteSpace: "pre-wrap",
              }}>
                {optimized}
              </div>
            </div>

            {/* Precision stat */}
            <div style={{
              padding: "12px 24px", borderTop: "1px solid rgba(0,0,0,0.04)",
              background: "rgba(0,0,0,0.01)",
            }}>
              <span style={{ fontSize: 13, color: "#6B6560" }}>
                ✨ Mike made your prompt{" "}
                <strong style={{ color: "#FF6E40" }}>{precisionGain}% more precise</strong>
              </span>
            </div>

            {/* ── What Mike fixed ── */}
            {fixes.length > 0 && (
              <div style={{
                padding: "16px 24px 20px",
                borderTop: "1px solid rgba(0,0,0,0.04)",
                background: "rgba(255,110,64,0.02)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#C0B8B0", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  What Mike fixed
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {fixes.map((fix, i) => (
                    <div key={i} style={{
                      fontSize: 13, color: "#4A4540", lineHeight: 1.5,
                      padding: "8px 12px", borderRadius: 10,
                      background: "white", border: "1px solid rgba(0,0,0,0.04)",
                    }}>
                      {fix}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Pro tip ── */}
            {proTip && (
              <div style={{
                padding: "14px 24px",
                borderTop: "1px solid rgba(0,0,0,0.04)",
                background: "rgba(255,183,77,0.04)",
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14, lineHeight: 1.4 }}>💡</span>
                  <span style={{ fontSize: 12, color: "#7A6A60", lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 700, color: "#E65100" }}>Pro tip: </span>
                    {proTip}
                  </span>
                </div>
              </div>
            )}

            {/* ── Feedback ── */}
            <div style={{
              padding: "14px 24px",
              borderTop: "1px solid rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              {feedback ? (
                <span style={{ fontSize: 13, color: "#43A047", fontWeight: 500 }}>
                  Thanks for feedback!
                </span>
              ) : (
                <>
                  <span style={{ fontSize: 13, color: "#A09890" }}>Was this helpful?</span>
                  <button
                    onClick={() => handleFeedback("positive")}
                    style={{
                      padding: "6px 14px", borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "white", fontSize: 16, cursor: "pointer",
                      transition: "all 0.18s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#43A047";
                      e.currentTarget.style.background = "rgba(67,160,71,0.06)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
                      e.currentTarget.style.background = "white";
                    }}
                  >👍</button>
                  <button
                    onClick={() => handleFeedback("negative")}
                    style={{
                      padding: "6px 14px", borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "white", fontSize: 16, cursor: "pointer",
                      transition: "all 0.18s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#E53935";
                      e.currentTarget.style.background = "rgba(229,57,53,0.06)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
                      e.currentTarget.style.background = "white";
                    }}
                  >👎</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Waitlist banner */}
        {!emailSubmitted ? (
          <div style={{
            marginTop: 40, padding: "16px 20px", borderRadius: 14,
            background: "white", border: "1px solid rgba(0,0,0,0.05)",
            display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12,
            justifyContent: "center",
          }}>
            <span style={{ fontSize: 14, color: "#6B6560" }}>
              🧡 Like Mike? Join the waitlist for Pro features.
            </span>
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setEmailSubmitted(true); }}
              style={{ display: "flex", gap: 8 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)",
                  fontSize: 13, outline: "none", width: 180, transition: "border-color 0.2s",
                }}
                onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#FF8A65")}
                onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(0,0,0,0.08)")}
              />
              <button type="submit" style={{
                padding: "8px 16px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Join</button>
            </form>
          </div>
        ) : (
          <div style={{
            marginTop: 40, padding: "14px 24px", borderRadius: 14,
            background: "rgba(76,175,80,0.06)", border: "1px solid rgba(76,175,80,0.12)",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#2E7D32" }}>
              🎉 You&apos;re on the list! Mike will be in touch.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          marginTop: 60, paddingBottom: 24,
          textAlign: "center", fontSize: 13, color: "#C0B8B0",
        }}>
          Made in Warsaw 🇵🇱 · Works with every AI chat ·{" "}
          <a href="mailto:hello@mikeprompt.com" style={{ color: "#C0B8B0", textDecoration: "none" }}>
            hello@mikeprompt.com
          </a>
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
        select option { color: #2D2A26; }
      `}</style>
    </div>
  );
};

export default MikePromptMVP;
