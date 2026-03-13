"use client";

import { useState } from "react";

export interface LibraryPrompt {
  id: number;
  title: string;
  description: string;
  prompt: string;
  tag: "ChatGPT" | "Claude" | "Any AI";
  category: string;
  categoryIcon: string;
}

const LIBRARY: LibraryPrompt[] = [
  {
    id: 1,
    title: "Monthly Budget Report",
    description: "Generate a comprehensive budget vs actual report",
    tag: "Any AI",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as a senior financial analyst. Create a monthly budget variance report for [department/company] for [month, year]. Include: 1) Summary of total budget vs actual spend with % variance, 2) Top 5 line items with largest positive and negative variances, 3) Root cause analysis for each significant variance (>5%), 4) Cash flow impact assessment, 5) Recommended corrective actions for next month. Format as a professional report with tables. Use currency format with thousands separator.`,
  },
  {
    id: 2,
    title: "Financial Model Template",
    description: "Build a structured financial model from scratch",
    tag: "Claude",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as a VP of Finance. Help me build a 3-year financial model for [company/product]. Include these tabs: 1) Revenue model — break down by [product lines/segments], growth assumptions, seasonality, 2) Cost structure — fixed vs variable, headcount plan, unit economics, 3) P&L projection — monthly for Y1, quarterly for Y2-Y3, 4) Cash flow — operating, investing, financing activities, 5) Key metrics dashboard — burn rate, runway, LTV/CAC, gross margin. Start by asking me 5 clarifying questions about my business before building.`,
  },
  {
    id: 3,
    title: "Investor Update Email",
    description: "Write a monthly investor update that impresses",
    tag: "Any AI",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as a startup CFO writing to Series A investors. Draft a monthly investor update for [month, year]. Structure: 1) TL;DR — 3 bullet highlights, 2) Key metrics table: MRR, growth rate, burn, runway, customers, 3) Wins this month (2-3), 4) Challenges and how we're addressing them (be honest), 5) Key hires/team updates, 6) Ask — specific help needed from investors. Tone: confident but transparent. Keep under 500 words. No fluff.`,
  },
  {
    id: 4,
    title: "Cold Outreach to CFO",
    description: "Write a cold email that actually gets replies",
    tag: "ChatGPT",
    category: "Sales",
    categoryIcon: "🤝",
    prompt: `Act as a top-performing B2B sales rep. Write a cold outreach email to a CFO at a [industry] company with [size] employees. My product: [brief description]. Rules: 1) Subject line under 6 words, no clickbait, 2) Opening line references something specific about their company (I'll fill in), 3) One clear pain point we solve — quantified if possible, 4) Social proof — one specific result with a similar company, 5) Soft CTA — suggest specific time, no 'let me know', 6) Total length: max 100 words. No buzzwords, no 'leverage', no 'synergy'.`,
  },
  {
    id: 5,
    title: "Discovery Call Script",
    description: "Structured discovery call framework",
    tag: "Any AI",
    category: "Sales",
    categoryIcon: "🤝",
    prompt: `Act as a sales methodology expert. Create a discovery call script for selling [product/service] to [target buyer]. Include: 1) Opening (30 sec) — rapport + agenda setting, 2) Situation questions (3-4) — understand their current state, 3) Problem questions (3-4) — uncover pain points, 4) Implication questions (2-3) — quantify the cost of inaction, 5) Need-payoff questions (2-3) — let them sell themselves, 6) Next steps script. Add coaching notes in [brackets] for timing and tone. Total call: 25 minutes.`,
  },
  {
    id: 6,
    title: "Meeting Agenda That Works",
    description: "Create an agenda that makes meetings productive",
    tag: "Any AI",
    category: "Admin & Operations",
    categoryIcon: "📋",
    prompt: `Act as a senior executive assistant. Create a meeting agenda for: [meeting type — team sync/board meeting/project review/1:1]. Duration: [X] minutes. Attendees: [list roles]. Include: 1) Meeting objective (one sentence), 2) Pre-read materials needed (with deadlines), 3) Timed agenda items with owner and expected outcome for each, 4) Decision items vs discussion items clearly marked, 5) Parking lot section, 6) Action items template at the bottom. Keep it to one page.`,
  },
  {
    id: 7,
    title: "Supplier Negotiation Email",
    description: "Negotiate better terms professionally",
    tag: "Any AI",
    category: "Admin & Operations",
    categoryIcon: "📋",
    prompt: `Act as a procurement specialist. Write an email to [supplier name] negotiating [better pricing/payment terms/delivery schedule] for [product/service]. Context: we've been a customer for [X years], current spend is [amount/year]. Approach: 1) Acknowledge the relationship value, 2) Present market data justifying the request (I'll fill specifics), 3) Propose specific new terms, 4) Offer something in return (longer contract, larger volume, upfront payment), 5) Set a deadline for response. Firm but respectful tone.`,
  },
  {
    id: 8,
    title: "Month-End Closing Checklist",
    description: "Never miss a step in month-end close",
    tag: "Claude",
    category: "Accounting",
    categoryIcon: "🧮",
    prompt: `Act as a senior accounting manager. Create a detailed month-end closing checklist for a [company type — SaaS startup/manufacturing/services]. Include: 1) Pre-close tasks (T-5 days), 2) Close tasks (T-0), 3) Post-close review (T+2), 4) Each task has: description, owner role, deadline, dependencies, common errors to watch for. Cover: revenue recognition, AP/AR reconciliation, bank reconciliation, accruals, prepaid expenses, depreciation, intercompany eliminations if applicable. Format as a table with checkboxes.`,
  },
  {
    id: 9,
    title: "Invoice Discrepancy Resolution",
    description: "Handle billing disputes professionally",
    tag: "Any AI",
    category: "Accounting",
    categoryIcon: "🧮",
    prompt: `Act as an accounts receivable specialist. Write an email to [client] about an invoice discrepancy. Invoice #[X], amount [Y], discrepancy: [describe — wrong amount/duplicate/missing PO]. Tone: professional, non-accusatory. Structure: 1) Reference the specific invoice, 2) Clearly state the discrepancy found, 3) Attach or reference supporting documentation, 4) Propose resolution with specific next step, 5) Deadline for response. Keep factual, no emotional language.`,
  },
  {
    id: 10,
    title: "Performance Review That Helps",
    description: "Write a review that actually develops people",
    tag: "Any AI",
    category: "Management",
    categoryIcon: "💼",
    prompt: `Act as an experienced people manager. Write a performance review for [name], [role], for [review period]. Rating: [meets/exceeds/below expectations]. Include: 1) 3 specific accomplishments with measurable impact, 2) 2 areas for development with concrete examples, 3) Goals for next period (SMART format), 4) Career development discussion points, 5) Overall summary (3 sentences). Be specific — no generic phrases like 'good team player'. Every point must reference an observable behavior or measurable outcome.`,
  },
];

type Lang = "en" | "pl";

const CATEGORIES_EN = ["All", "Finance & FP&A", "Sales", "Admin & Operations", "Accounting", "Management"];
const CATEGORIES_PL = ["Wszystkie", "Finanse i FP&A", "Sprzedaż", "Admin i Operacje", "Księgowość", "Zarządzanie"];
const CATEGORY_MAP: Record<string, string> = {
  "All": "Wszystkie",
  "Finance & FP&A": "Finanse i FP&A",
  "Sales": "Sprzedaż",
  "Admin & Operations": "Admin i Operacje",
  "Accounting": "Księgowość",
  "Management": "Zarządzanie",
};
const CATEGORY_MAP_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

const TAG_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Any AI":  { bg: "rgba(0,0,0,0.03)",        color: "#A09890",  border: "rgba(0,0,0,0.06)" },
  "ChatGPT": { bg: "rgba(16,163,127,0.06)",   color: "#0a8a69",  border: "rgba(16,163,127,0.2)" },
  "Claude":  { bg: "rgba(255,110,64,0.07)",   color: "#FF6E40",  border: "rgba(255,110,64,0.25)" },
};

interface PromptLibraryProps {
  onPolish: (prompt: string) => void;
  lang?: Lang;
}

const PromptCard = ({ p, onPolish, lang = "en" }: { p: LibraryPrompt; onPolish: (prompt: string) => void; lang?: Lang }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(p.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const tag = TAG_COLORS[p.tag];

  return (
    <div style={{
      background: "white", borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
      overflow: "hidden",
      transition: "box-shadow 0.2s",
    }}>
      {/* Header row */}
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{
          padding: "14px 18px", cursor: "pointer",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#2D2A26" }}>{p.title}</span>
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 100, fontWeight: 500,
              background: tag.bg, color: tag.color, border: `1px solid ${tag.border}`,
            }}>
              {p.tag}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "#A09890", margin: 0 }}>{p.description}</p>
        </div>
        <span style={{
          fontSize: 11, color: "#C0B8B0", marginTop: 2,
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s", display: "inline-block", flexShrink: 0,
        }}>▼</span>
      </div>

      {/* Expanded prompt */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.04)", animation: "fadeUp 0.15s ease" }}>
          <div style={{
            padding: "14px 18px",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
            lineHeight: 1.8, color: "#4A4540", whiteSpace: "pre-wrap",
            background: "rgba(0,0,0,0.015)",
          }}>
            {p.prompt}
          </div>
          <div style={{
            padding: "10px 18px", borderTop: "1px solid rgba(0,0,0,0.04)",
            display: "flex", gap: 8,
          }}>
            <button
              onClick={copy}
              style={{
                padding: "6px 14px", borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.07)",
                background: copied ? "rgba(67,160,71,0.06)" : "white",
                fontSize: 12, color: copied ? "#43A047" : "#6B6560",
                cursor: "pointer", fontWeight: 500, transition: "all 0.18s",
              }}
            >
              {copied ? (lang === "pl" ? "✓ Skopiowano!" : "✓ Copied!") : (lang === "pl" ? "📋 Kopiuj" : "📋 Copy")}
            </button>
            <button
              onClick={() => onPolish(p.prompt)}
              style={{
                padding: "6px 14px", borderRadius: 8,
                border: "1px solid rgba(255,110,64,0.2)",
                background: "rgba(255,110,64,0.05)",
                fontSize: 12, color: "#FF6E40",
                cursor: "pointer", fontWeight: 500, transition: "all 0.18s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,110,64,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,110,64,0.05)";
              }}
            >
              {lang === "pl" ? "🔧 Wypoleruj" : "🔧 Polish it"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function PromptLibrary({ onPolish, lang = "en" }: PromptLibraryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const CATEGORIES = lang === "pl" ? CATEGORIES_PL : CATEGORIES_EN;

  // Resolve to English category for filtering
  const activeCategoryEn = lang === "pl"
    ? (activeCategory === "Wszystkie" ? "All" : (CATEGORY_MAP_REVERSE[activeCategory] ?? activeCategory))
    : activeCategory;

  const filtered = LIBRARY.filter((p) => {
    const matchCat = activeCategoryEn === "All" || p.category === activeCategoryEn;
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // group by category preserving order
  const grouped: Record<string, LibraryPrompt[]> = {};
  filtered.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  return (
    <div>
      {/* Search + filter bar */}
      <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "pl" ? "Szukaj promptów…" : "Search prompts…"}
          style={{
            padding: "10px 16px", borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            fontSize: 14, outline: "none", width: "100%",
            fontFamily: "'DM Sans', sans-serif", color: "#2D2A26",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.08)")}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 14px", borderRadius: 100,
                border: activeCategory === cat ? "1px solid #FF8A65" : "1px solid rgba(0,0,0,0.08)",
                background: activeCategory === cat ? "rgba(255,110,64,0.07)" : "white",
                fontSize: 12,
                color: activeCategory === cat ? "#FF6E40" : "#A09890",
                fontWeight: activeCategory === cat ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt groups */}
      {Object.keys(grouped).length === 0 ? (
        <p style={{ textAlign: "center", color: "#C0B8B0", fontSize: 14, padding: "40px 0" }}>
          {lang === "pl" ? "Nie znaleziono promptów." : "No prompts found."}
        </p>
      ) : (
        Object.entries(grouped).map(([category, prompts]) => {
          const icon = prompts[0].categoryIcon;
          return (
            <div key={category} style={{ marginBottom: 32 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {lang === "pl" ? (CATEGORY_MAP[category] ?? category) : category}
                </span>
                <span style={{
                  fontSize: 11, color: "#C0B8B0",
                  background: "rgba(0,0,0,0.04)", borderRadius: 100,
                  padding: "1px 8px",
                }}>
                  {prompts.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {prompts.map((p) => (
                  <PromptCard key={p.id} p={p} onPolish={onPolish} lang={lang} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
