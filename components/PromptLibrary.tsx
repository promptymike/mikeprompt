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
  // ── Finance & FP&A ──
  {
    id: 1,
    title: "Board Report in 10 Minutes",
    description: "Executive-ready board report with KPIs and narrative",
    tag: "Any AI",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as a CFO preparing for a board meeting. Create a board report for [company] for [period]. Include: 1) Executive summary (5 lines max), 2) Key financial metrics table: revenue, EBITDA, burn rate, runway, YoY and MoM changes, 3) Budget vs actual with variance analysis for top 10 line items, 4) Cash flow waterfall — opening → operating → investing → financing → closing, 5) 3 key risks with mitigation status (red/amber/green), 6) Strategic initiatives progress update, 7) Outlook and guidance for next quarter. Format: professional memo, max 3 pages. Use tables where possible. Tone: confident, data-driven.`,
  },
  {
    id: 2,
    title: "3-Year Financial Model",
    description: "Complete model structure with revenue, costs, P&L, cash flow",
    tag: "Any AI",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as a VP of Finance building a financial model for [company type] in [industry]. Create a 3-year model framework with: 1) Revenue model — break by [segments], include growth rates, seasonality, churn for SaaS, 2) Cost structure — fixed vs variable split, headcount plan with avg salary by role, 3) P&L — monthly Y1, quarterly Y2-Y3, 4) Cash flow statement — operating, investing, financing, 5) Balance sheet projections, 6) Key metrics dashboard: gross margin, EBITDA margin, burn rate, runway, LTV/CAC, Rule of 40, 7) Sensitivity analysis on 3 key assumptions. Start by asking me 5 questions about my business before building. Format: describe each tab structure for Excel.`,
  },
  {
    id: 3,
    title: "Investor Update That Impresses",
    description: "Monthly investor email — transparent, data-driven, concise",
    tag: "Any AI",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as a startup CFO writing to Series [A/B] investors. Monthly update for [month, year]. Structure: 1) TL;DR — 3 bullet highlights max, 2) Metrics table: MRR, ARR, growth rate %, burn rate, runway months, customers, NRR, 3) Top 2 wins with quantified impact, 4) Top 2 challenges — be honest, explain what you're doing about each, 5) Product/roadmap update (3 lines), 6) Team update — hires, departures, 7) Specific ask from investors (intros, advice, resources). Max 400 words. No fluff, no buzzwords. If a metric is bad, own it.`,
  },
  {
    id: 4,
    title: "Bank Reporting & Covenants",
    description: "Covenant compliance report for lending bank",
    tag: "Any AI",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as a Financial Controller preparing quarterly covenant compliance report for [bank name]. Loan facility: [amount, type]. Report: 1) Covenant summary table: covenant name, required threshold, actual value, status (compliant/breach/waiver), 2) Detailed calculation for each covenant (Debt/EBITDA, Interest Coverage, Current Ratio, Minimum Cash, etc.), 3) Trend analysis — last 4 quarters per covenant with trajectory, 4) Early warning flags — any covenant within 15% of threshold, 5) Management commentary on any deterioration, 6) Forecast next 2 quarters — will we remain compliant? Format: formal report with tables. Attach covenant definitions from credit agreement.`,
  },
  {
    id: 5,
    title: "Budget Template Builder",
    description: "Create a departmental or company-wide budget from scratch",
    tag: "Any AI",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as an FP&A Manager. Build a [annual/quarterly] budget template for [department/company] in [industry]. Include: 1) Revenue assumptions worksheet — drivers, growth rates, pricing, volume, 2) Personnel costs — headcount plan by role, salary bands, benefits loading rate, bonus accruals, 3) OpEx by category — software, travel, marketing, professional services, office, 4) CapEx plan if applicable, 5) Monthly phasing with seasonality adjustments, 6) Variance columns (budget vs prior year, budget vs forecast), 7) Key assumptions page — list every assumption in one place. Format: describe Excel structure with tab names, columns, formulas logic.`,
  },
  {
    id: 6,
    title: "Power BI Dashboard — No Code Needed",
    description: "Tell AI what dashboard you want and get step-by-step build instructions",
    tag: "Any AI",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as a Power BI consultant. I need a [type: financial/sales/operational] dashboard for [audience: CEO/CFO/team leads]. My data source: [Excel/SQL/Salesforce/other]. Help me build it step by step: 1) What KPIs should this dashboard show? Suggest 6-8 based on my audience, 2) Page layout — describe each page with visual types (card, bar chart, line chart, table, slicer), 3) DAX measures I need — write the exact formulas with explanations, 4) Data model — what tables and relationships do I need, 5) Filters and slicers to include, 6) Color theme suggestion matching professional standards. I have no DAX experience — explain everything simply.`,
  },
  {
    id: 7,
    title: "Accruals & Provisions Checklist",
    description: "Month-end accrual review with journal entries",
    tag: "Any AI",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as a Senior Accountant performing month-end accruals for [company type]. Create: 1) Accruals checklist by category: payroll, bonuses, vacation, utilities, rent, professional fees, software, tax, interest, 2) For each: how to estimate, what source document to check, typical journal entry (DR/CR with account codes), 3) Reversal schedule — which accruals reverse next month vs roll forward, 4) Provisions review: bad debt, warranty, legal, restructuring — criteria for recognition under [IFRS/US GAAP/UoR], 5) Reasonableness checks — compare to prior month and budget. Format: table with columns: Category, Estimate Method, Amount, JE, Reversal Y/N.`,
  },
  {
    id: 8,
    title: "Variance Analysis Deep Dive",
    description: "Professional budget vs actual analysis with root causes",
    tag: "Any AI",
    category: "Finance & FP&A",
    categoryIcon: "📊",
    prompt: `Act as an FP&A Analyst. Perform variance analysis for [department/company] for [period]. Structure: 1) High-level summary — total budget vs actual, favorable/unfavorable, 2) Revenue variance — price vs volume decomposition, 3) Cost variance — rate vs efficiency for labor, price vs quantity for materials, 4) Top 5 variances by absolute value — for each: root cause, one-time vs recurring, controllable vs uncontrollable, 5) Impact on full-year forecast, 6) Recommended actions for each significant variance. Format: start with executive summary table, then detailed analysis. Use traffic lights (🟢🟡🔴) for quick visual.`,
  },
  // ── Sales ──
  {
    id: 9,
    title: "Demo Preparation Checklist",
    description: "Walk into every demo fully prepared",
    tag: "Any AI",
    category: "Sales",
    categoryIcon: "🤝",
    prompt: `Act as a senior sales engineer. I have a product demo tomorrow with [company name] in [industry]. Their role: [title]. Help me prepare: 1) Research checklist — what to look up about them (LinkedIn, news, annual report, competitors, tech stack), 2) 3 likely pain points for their role and industry, 3) Demo flow — opening (2 min), discovery confirmation (3 min), core demo (15 min), Q&A (5 min), next steps (2 min), 4) Objection handling — top 5 likely objections with responses, 5) Questions to ask THEM (at least 5 smart ones), 6) Follow-up email template for after the demo. What does my product do: [brief description].`,
  },
  {
    id: 10,
    title: "Director Status Meeting Prep",
    description: "Never be caught off guard in a status meeting",
    tag: "Any AI",
    category: "Sales",
    categoryIcon: "🤝",
    prompt: `Act as a management consultant. I have a status meeting with my director in 1 hour. My role: [title]. My projects: [list 2-3 current projects]. Help me prepare: 1) Status summary for each project — one line: status (on track/at risk/blocked), key metric, next milestone, 2) Potential tough questions they might ask and my answers, 3) One proactive insight or recommendation to show initiative, 4) Any asks I need from them (resources, decisions, escalations), 5) Bad news delivery script if applicable — lead with impact, then cause, then solution. Format: bullet points I can glance at before walking in.`,
  },
  {
    id: 11,
    title: "Client Proposal That Wins",
    description: "Professional proposal structure for any service",
    tag: "Any AI",
    category: "Sales",
    categoryIcon: "🤝",
    prompt: `Act as a business development director. Write a proposal for [client company] for [service/product]. Include: 1) Executive summary — their problem, our solution, expected ROI, 2) Understanding of their situation (show we listened), 3) Proposed approach — phases, timeline, deliverables per phase, 4) Team — who works on this, their relevant experience (1 line each), 5) Pricing — options if possible (basic/standard/premium), 6) Case study — one similar client with measurable results, 7) Terms and next steps, 8) Risk mitigation — how we handle scope creep, delays, etc. Max 5 pages. Professional but not stiff.`,
  },
  {
    id: 12,
    title: "Negotiation Playbook",
    description: "Prepare for any negotiation with frameworks",
    tag: "Any AI",
    category: "Sales",
    categoryIcon: "🤝",
    prompt: `Act as a negotiation coach with Harvard Negotiation Project training. I'm negotiating [what] with [who]. My position: [what I want]. Their likely position: [what they probably want]. Help me prepare: 1) BATNA analysis — my best alternative, their likely BATNA, 2) ZOPA — zone of possible agreement, 3) Opening strategy — anchor high/low and why, 4) 5 concessions I can make ranked by cost to me vs value to them, 5) 3 creative options for mutual gain, 6) Tactics to watch for from their side, 7) Walk-away point — when do I leave, 8) Script for key moments: opening, responding to first offer, deadlock breaking, closing.`,
  },
  // ── Admin & Operations ──
  {
    id: 13,
    title: "Office Supplies & Vendor Management",
    description: "Track supplies, compare vendors, optimize spending",
    tag: "Any AI",
    category: "Admin & Operations",
    categoryIcon: "📋",
    prompt: `Act as an experienced office manager. Help me build a system for [office size: X people]: 1) Essential supplies checklist by category (paper, kitchen, hygiene, IT peripherals, furniture) with reorder thresholds, 2) Vendor comparison template — columns: vendor, item, unit price, delivery time, minimum order, payment terms, rating, 3) Monthly spend tracking template with budget alerts, 4) Quarterly vendor review email template requesting better terms, 5) New employee setup checklist — what they need on day 1. Format: practical tables I can use in Excel or Notion.`,
  },
  {
    id: 14,
    title: "Software License & Access Audit",
    description: "Track who has what software, what it costs, who's actually using it",
    tag: "Any AI",
    category: "Admin & Operations",
    categoryIcon: "📋",
    prompt: `Act as an IT operations specialist. Create a software audit framework for [company, X employees]: 1) Software inventory template: app name, vendor, license type (per user/flat), cost/month, owner, users list, renewal date, 2) Access review checklist — for each app: who has access, who actually uses it (check last login), who shouldn't have it, 3) Offboarding checklist — all systems to revoke when someone leaves, 4) Cost optimization — identify unused licenses, downgrade opportunities, consolidation options, 5) Security flags — shared passwords, admin access review, 2FA status. Format: Excel template structure with columns described.`,
  },
  {
    id: 15,
    title: "Expense Card Reconciliation Reminder",
    description: "Professional but firm reminders for unreconciled expenses",
    tag: "Any AI",
    category: "Admin & Operations",
    categoryIcon: "📋",
    prompt: `Act as a finance operations coordinator. Write 3 versions of expense reconciliation reminder emails: 1) Friendly first reminder (day 5 after month-end): 'Hey [name], quick reminder to submit receipts for your [card type] transactions from [month]...', 2) Firm second reminder (day 10): escalation mention, specific transactions listed, deadline, 3) Final notice (day 15): CC to manager, policy reference, consequence of non-compliance. Also create: 4) Slack message version (shorter, casual), 5) Template for the summary email to CFO listing all outstanding reconciliations. All with [placeholders] for names, amounts, dates.`,
  },
  {
    id: 16,
    title: "CEO Document Prep & Signature Reminder",
    description: "Get documents signed without being annoying",
    tag: "Any AI",
    category: "Admin & Operations",
    categoryIcon: "📋",
    prompt: `Act as an executive assistant to a busy CEO. Create: 1) Document preparation checklist — what to verify before sending for signature (correct entity, dates, amounts, counterparty details, legal review status), 2) Signature reminder email — polite but clear, with context of what it is and why it's time-sensitive, 3) Follow-up sequence: day 1, day 3, day 7 — each progressively more urgent, 4) Tracking template: document name, type, counterparty, sent date, due date, status, follow-up count. Tone: respectful of CEO's time but protecting the company's deadlines.`,
  },
  // ── Accounting & Audit ──
  {
    id: 17,
    title: "Month-End Close Checklist",
    description: "Complete closing checklist with deadlines and dependencies",
    tag: "Any AI",
    category: "Accounting & Audit",
    categoryIcon: "🧮",
    prompt: `Act as a senior accounting manager. Build a month-end closing checklist for [company type — SaaS/manufacturing/services] under [IFRS/GAAP/UoR]. Include: 1) Pre-close (T-5 to T-1): cut-off procedures, sub-ledger reviews, intercompany reconciliation, 2) Close (T+0 to T+2): journal entries, accruals, depreciation, FX revaluation, revenue recognition, 3) Post-close (T+3 to T+5): trial balance review, analytics review, flux analysis, management accounts prep, 4) Each task: owner role, deadline, predecessor task, common errors, review checkpoint. Format: Gantt-style table. Add column for 'First month-end tips' for junior accountants.`,
  },
  {
    id: 18,
    title: "Audit Risk Assessment",
    description: "Build a risk assessment matrix from scratch",
    tag: "Any AI",
    category: "Accounting & Audit",
    categoryIcon: "🧮",
    prompt: `Act as a senior auditor from a Big 4 firm. Build an audit risk assessment for [company, industry, size]. Include: 1) Inherent risk factors: industry, complexity, management, related parties, estimates, 2) Control risk assessment by cycle: Revenue, Purchases, Payroll, Treasury, Fixed Assets, 3) Risk matrix: risk description, likelihood (H/M/L), impact (H/M/L), combined risk rating, planned audit response, 4) Significant risks requiring special attention (fraud risk, revenue recognition, management override), 5) Materiality calculation — suggest methodology and benchmark. Format: professional table. Reference ISA standards where applicable.`,
  },
  {
    id: 19,
    title: "Accounting Standards Quick Analysis",
    description: "Analyze how a standard applies to your specific transaction",
    tag: "Any AI",
    category: "Accounting & Audit",
    categoryIcon: "🧮",
    prompt: `Act as a technical accounting specialist. I need to account for [describe transaction/event] under [IFRS/GAAP/UoR — Ustawa o Rachunkowości]. Analyze: 1) Which standard(s) apply and why, 2) Recognition criteria — when to recognize, 3) Measurement — initial and subsequent, 4) Key judgments and estimates required, 5) Disclosure requirements, 6) Journal entries with example amounts, 7) Common mistakes to avoid, 8) If IFRS vs GAAP vs UoR differ on this — highlight differences. Keep practical, not academic. I need to book this, not write a thesis.`,
  },
  {
    id: 20,
    title: "Ultimate Business Knowledge Builder",
    description: "Build deep industry knowledge for any client/company fast",
    tag: "Any AI",
    category: "Accounting & Audit",
    categoryIcon: "🧮",
    prompt: `Act as a strategy consultant preparing for a new client engagement. Company: [name] in [industry]. Build me a knowledge pack: 1) Industry overview — size, growth rate, key trends, top 5 players, 2) Business model analysis — how this company makes money, key value drivers, 3) Key financial metrics for this industry and what 'good' looks like, 4) Regulatory environment — main regulations, recent changes, upcoming changes, 5) Competitive landscape — direct and indirect competitors, differentiation, 6) PESTEL summary — 1 line per factor, 7) 10 smart questions I can ask that show deep understanding, 8) Red flags to watch for in this industry. Sources: suggest where to find each piece of data (annual reports, industry reports, regulatory sites).`,
  },
  {
    id: 21,
    title: "Audit Kick-Off Preparation",
    description: "Everything you need for day one of an audit",
    tag: "Any AI",
    category: "Accounting & Audit",
    categoryIcon: "🧮",
    prompt: `Act as an audit manager preparing for kick-off of [audit type: statutory/internal/SOX] for [company, industry]. Create: 1) Information request list (PBC list) — organized by cycle, with deadlines, 2) Kick-off meeting agenda — introductions, timeline, key contacts, access requirements, 3) Team briefing document — industry background, prior year issues, risk areas, 4) Planning memo outline — scope, materiality, significant risks, audit approach, 5) Client communication template — professional email to client contact confirming start date, team, and initial requests, 6) Materiality calculation — pick methodology based on [listed/private, profit/loss-making, industry].`,
  },
  // ── Career & Students ──
  {
    id: 22,
    title: "How to Get Into Big 4 Audit",
    description: "Complete preparation plan from university to offer",
    tag: "Any AI",
    category: "Career & Students",
    categoryIcon: "🎓",
    prompt: `Act as a Big 4 recruiting partner and career coach. I'm a [year] university student studying [field] at [university] in [country]. I want to get into audit at [Deloitte/PwC/EY/KPMG]. Create my action plan: 1) Timeline — what to do each semester from now until recruiting, 2) CV optimization — what audit recruiters actually look for (be specific), 3) Key skills to develop and how (accounting, Excel, analytics, communication), 4) Extracurriculars that matter — which student organizations, case competitions, volunteering, 5) Networking playbook — how to approach professionals on LinkedIn (with message template), attend events, get referrals, 6) Interview prep — top 15 questions with ideal answer frameworks, technical and behavioral, 7) Red flags that get CVs rejected, 8) What to do in first 90 days after joining. Be honest about what actually works, not PR answers.`,
  },
  {
    id: 23,
    title: "Breaking Into Finance/FP&A",
    description: "From zero to FP&A analyst — complete roadmap",
    tag: "Any AI",
    category: "Career & Students",
    categoryIcon: "🎓",
    prompt: `Act as an FP&A Director who hires analysts. I'm [describe situation: student/career changer/junior accountant]. I want to land an FP&A or finance analyst role at [type of company]. Build my roadmap: 1) Skills checklist with priority order: financial modeling, Excel (which functions exactly), PowerPoint, SQL, Python, Power BI/Tableau, 2) Free/cheap resources for each skill (be specific — course names, YouTube channels, books), 3) Projects I can build to show on CV even without experience, 4) CV template — what to highlight, what to remove, how to describe non-finance experience, 5) LinkedIn profile optimization checklist, 6) Where to apply — job boards, company career pages, networking strategies, 7) Interview prep: technical questions (walk me through DCF, explain variance analysis) and case studies.`,
  },
  {
    id: 24,
    title: "Get Into Admin/Operations Role",
    description: "Complete career guide for administrative professionals",
    tag: "Any AI",
    category: "Career & Students",
    categoryIcon: "🎓",
    prompt: `Act as an HR Director who hires office managers and administrative professionals. I'm [describe situation]. I want to land a [office manager/executive assistant/operations coordinator] role. Create: 1) Key skills employers actually test for (not just job description fluff), 2) Software I must know: Microsoft Office (which features exactly), Google Workspace, project management tools, 3) Certifications that actually matter vs waste of money, 4) CV tips — how to quantify admin work (managed X, reduced Y by Z%), 5) Interview questions with model answers — include scenario-based ones, 6) Salary negotiation tips for admin roles, 7) Career progression path — from EA to office manager to operations director, what changes at each level.`,
  },
  {
    id: 25,
    title: "Sales Career Kickstart",
    description: "From no experience to closing deals",
    tag: "Any AI",
    category: "Career & Students",
    categoryIcon: "🎓",
    prompt: `Act as a VP of Sales who has built and trained sales teams. I want to break into [B2B/B2C] sales in [industry]. Create my plan: 1) Entry-level roles to target and what they actually involve day-to-day, 2) Skills to build before applying — cold calling, discovery, objection handling, CRM (which one to learn), 3) Books and podcasts that actually helped real salespeople (not generic business books), 4) How to practice sales skills without a job — role play scripts, mock calls, 5) CV for someone with no sales experience — how to reframe any experience as sales-relevant, 6) First 30-60-90 day plan once hired, 7) Realistic earnings progression — base, OTE, what to expect.`,
  },
  // ── Employers & HR ──
  {
    id: 26,
    title: "Local Market Employment Analysis",
    description: "Understand your hiring market with data",
    tag: "Any AI",
    category: "Employers & HR",
    categoryIcon: "👔",
    prompt: `Act as an HR analytics consultant. I'm hiring for [role] in [city/region, country]. Analyze: 1) Local employment data — where to find it (GUS in Poland, BLS in US, Eurostat for EU) and what to look for, 2) Salary benchmarks for this role — suggest 3 sources to check, how to adjust for company size and industry, 3) Talent availability — how many potential candidates exist, competition from other employers, 4) Hiring difficulty indicators — time to fill, offer acceptance rate benchmarks, 5) Recommendations: where to post, what benefits to emphasize, how to stand out, 6) Template for building a business case for the hire (for presenting to CFO). Include specific data sources with URLs where possible.`,
  },
  {
    id: 27,
    title: "Lead Generation Data Strategy",
    description: "Find potential clients using public data sources",
    tag: "Any AI",
    category: "Employers & HR",
    categoryIcon: "👔",
    prompt: `Act as a growth marketing strategist. I sell [product/service] to [target: industry, company size, role]. Help me build a lead list strategy: 1) Free data sources: GUS/REGON (Poland), Companies House (UK), SEC EDGAR (US), LinkedIn Sales Navigator tricks, 2) How to estimate TAM/SAM/SOM using public data, 3) Qualification criteria — which signals indicate a company needs my product, 4) Enrichment sources — where to find contact details, tech stack, funding status, hiring signals, 5) Outreach sequence: LinkedIn connection → value message → email → follow-up, 6) CRM setup — what fields to track, pipeline stages, lead scoring basics. Budget: [free/under $100/mo/under $500/mo].`,
  },
];

type Lang = "en" | "pl";

const CATEGORIES_EN = ["All", "Finance & FP&A", "Sales", "Admin & Operations", "Accounting & Audit", "Career & Students", "Employers & HR"];
const CATEGORIES_PL = ["Wszystkie", "Finanse i FP&A", "Sprzedaż", "Admin i Operacje", "Księgowość i Audyt", "Kariera i Studenci", "Pracodawcy i HR"];
const CATEGORY_MAP: Record<string, string> = {
  "All": "Wszystkie",
  "Finance & FP&A": "Finanse i FP&A",
  "Sales": "Sprzedaż",
  "Admin & Operations": "Admin i Operacje",
  "Accounting & Audit": "Księgowość i Audyt",
  "Career & Students": "Kariera i Studenci",
  "Employers & HR": "Pracodawcy i HR",
};
const CATEGORY_MAP_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

const TAG_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Any AI":  { bg: "var(--c-chip-bg)",        color: "var(--c-text3)", border: "var(--c-chip-border)" },
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
      background: "var(--c-card)", borderRadius: 14,
      border: "1px solid var(--c-card-border)",
      boxShadow: "var(--c-card-sm)",
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
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text1)" }}>{p.title}</span>
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 100, fontWeight: 500,
              background: tag.bg, color: tag.color, border: `1px solid ${tag.border}`,
            }}>
              {p.tag}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--c-text3)", margin: 0 }}>{p.description}</p>
        </div>
        <span style={{
          fontSize: 11, color: "var(--c-text4)", marginTop: 2,
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
            lineHeight: 1.8, color: "var(--c-prompt-text)", whiteSpace: "pre-wrap",
            background: "var(--c-hover)",
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
                border: "1px solid var(--c-fix-border)",
                background: copied ? "rgba(67,160,71,0.06)" : "var(--c-fix-bg)",
                fontSize: 12, color: copied ? "#43A047" : "var(--c-text2)",
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
  // Store active category always as English key (or "All")
  const [activeCategoryEn, setActiveCategoryEn] = useState("All");
  const [search, setSearch] = useState("");

  const CATEGORIES = lang === "pl" ? CATEGORIES_PL : CATEGORIES_EN;

  // Display value for the active category button
  const activeCategory = lang === "pl"
    ? (activeCategoryEn === "All" ? "Wszystkie" : (CATEGORY_MAP[activeCategoryEn] ?? activeCategoryEn))
    : activeCategoryEn;

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
            fontFamily: "'DM Sans', sans-serif", color: "var(--c-text1)",
            background: "var(--c-input)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
          onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => {
            const catEn = lang === "pl"
              ? (cat === "Wszystkie" ? "All" : (CATEGORY_MAP_REVERSE[cat] ?? cat))
              : cat;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategoryEn(catEn)}
                style={{
                  padding: "6px 14px", borderRadius: 100,
                  border: isActive ? "1px solid #FF8A65" : "1px solid var(--c-chip-border)",
                  background: isActive ? "rgba(255,110,64,0.07)" : "var(--c-card)",
                  fontSize: 12,
                  color: isActive ? "#FF6E40" : "var(--c-text3)",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt groups */}
      {Object.keys(grouped).length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--c-text4)", fontSize: 14, padding: "40px 0" }}>
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
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--c-text2)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {lang === "pl" ? (CATEGORY_MAP[category] ?? category) : category}
                </span>
                <span style={{
                  fontSize: 11, color: "var(--c-text4)",
                  background: "var(--c-count-bg)", borderRadius: 100,
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
