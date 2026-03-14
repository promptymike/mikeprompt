"use client";

import { useState } from "react";
import { MODELS, type AIModel } from "@/data/models";

type Lang = "en" | "pl";

interface Recommendation {
  model: string;
  score: number;
  reason: string;
  keyFeature: string;
  warningIfAny?: string;
}

interface RecommendResponse {
  recommendations: Recommendation[];
  taskCategory: string;
  error?: string;
}

type FilterKey = "all" | "cheap" | "quality" | "privacy" | "web";

const FILTER_LABELS: Record<FilterKey, Record<Lang, string>> = {
  all: { en: "All", pl: "Wszystkie" },
  cheap: { en: "Cheap", pl: "Tanie" },
  quality: { en: "Best Quality", pl: "Najlepsza Jakość" },
  privacy: { en: "Privacy First", pl: "Prywatność" },
  web: { en: "Has Web", pl: "Ma web" },
};

const T = {
  en: {
    recommenderHeader: "🔍 Find the best AI for your task",
    recommenderPlaceholder: "Describe what you want to do...",
    findBtn: "🔍 Find best model",
    loading: "Analyzing...",
    errorGeneric: "Something went wrong. Please try again.",
    errorRateLimit: "The service is busy right now. Please try again in a moment.",
    costHeader: "Daily prompts estimate:",
    costTableModel: "Model",
    costTableMonthly: "Est. Monthly Cost",
    flatRate: "flat rate",
    cheapest: "Cheapest",
    scoreBadgeLabel: (score: number) => `${score}/100`,
    keyFeature: "Key feature:",
    warning: "⚠️",
    filterLabel: "Filter:",
    contextK: (n: number) => `${Math.round(n / 1000)}k tokens`,
    context1M: "1M tokens",
    speedLabel: "Speed",
    qualityLabel: "Quality",
    privacyLabel: "Privacy",
    freeApiTier: "Free API tier",
    perMonth: "/month",
    bundled: "Bundled",
    apiPrice: (inp: number, out: number) =>
      `$${inp} / $${out} per 1M tokens (in/out)`,
  },
  pl: {
    recommenderHeader: "🔍 Znajdź najlepsze AI dla swojego zadania",
    recommenderPlaceholder: "Opisz co chcesz zrobić...",
    findBtn: "🔍 Znajdź najlepszy model",
    loading: "Analizuję...",
    errorGeneric: "Coś poszło nie tak. Spróbuj ponownie.",
    errorRateLimit: "Usługa jest teraz zajęta. Spróbuj za chwilę.",
    costHeader: "Szacowana liczba promptów dziennie:",
    costTableModel: "Model",
    costTableMonthly: "Szac. koszt miesięczny",
    flatRate: "abonament",
    cheapest: "Najtańszy",
    scoreBadgeLabel: (score: number) => `${score}/100`,
    keyFeature: "Kluczowa funkcja:",
    warning: "⚠️",
    filterLabel: "Filtr:",
    contextK: (n: number) => `${Math.round(n / 1000)}k tokenów`,
    context1M: "1M tokenów",
    speedLabel: "Szybkość",
    qualityLabel: "Jakość",
    privacyLabel: "Prywatność",
    freeApiTier: "Darmowy tier API",
    perMonth: "/mies.",
    bundled: "W pakiecie",
    apiPrice: (inp: number, out: number) =>
      `$${inp} / $${out} za 1M tokenów (wej/wyj)`,
  },
};

function scoreBadgeStyle(score: number): React.CSSProperties {
  if (score >= 90) {
    return {
      background: "#22c55e",
      color: "#fff",
      padding: "2px 10px",
      borderRadius: 99,
      fontWeight: 700,
      fontSize: 13,
    };
  }
  if (score >= 75) {
    return {
      background: "#f97316",
      color: "#fff",
      padding: "2px 10px",
      borderRadius: 99,
      fontWeight: 700,
      fontSize: 13,
    };
  }
  return {
    background: "var(--c-chip-bg)",
    color: "var(--c-text2)",
    padding: "2px 10px",
    borderRadius: 99,
    fontWeight: 700,
    fontSize: 13,
  };
}

function tierBadgeStyle(tier: AIModel["tier"]): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };
  if (tier === "cheap")
    return { ...base, background: "#bbf7d0", color: "#15803d" };
  if (tier === "mid")
    return { ...base, background: "#bfdbfe", color: "#1d4ed8" };
  if (tier === "premium")
    return { ...base, background: "#e9d5ff", color: "#7e22ce" };
  return { ...base, background: "var(--c-chip-bg)", color: "var(--c-text2)" };
}

function RatingBar({
  label,
  value,
  color,
}: {
  label: string;
  value: 1 | 2 | 3 | 4 | 5;
  color: string;
}) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "var(--c-text3)",
          marginBottom: 3,
        }}
      >
        <span>{label}</span>
        <span>{value}/5</span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: "var(--c-sep)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(value / 5) * 100}%`,
            background: color,
            borderRadius: 3,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

function calcMonthlyCost(model: AIModel, dailyPrompts: number): number | null {
  if (model.id === "copilot" || model.id === "perplexity") return null;
  const avgInputTokens = 500;
  const avgOutputRatio = 0.3;
  const totalInputM = (dailyPrompts * 30 * avgInputTokens) / 1_000_000;
  return totalInputM * (model.inputPricePerM + model.outputPricePerM * avgOutputRatio);
}

function formatCost(cost: number): string {
  if (cost < 0.01) return "<$0.01";
  if (cost < 1) return `$${cost.toFixed(2)}`;
  return `$${cost.toFixed(2)}`;
}

function applyFilter(models: AIModel[], filter: FilterKey): AIModel[] {
  switch (filter) {
    case "cheap":
      return models.filter((m) => m.tier === "cheap");
    case "quality":
      return models.filter((m) => m.qualityRating >= 4);
    case "privacy":
      return models.filter((m) => m.privacyRating >= 4);
    case "web":
      return models.filter((m) => m.hasWebSearch);
    default:
      return models;
  }
}

function ModelCard({ model, lang }: { model: AIModel; lang: Lang }) {
  const t = T[lang];

  const contextLabel =
    model.contextWindow >= 1_000_000
      ? t.context1M
      : t.contextK(model.contextWindow);

  const showApiPrice = model.inputPricePerM > 0 || model.outputPricePerM > 0;

  const priceLabel =
    model.monthlyPrice === null
      ? t.freeApiTier
      : model.id === "copilot"
      ? t.bundled
      : `$${model.monthlyPrice}${t.perMonth}`;

  return (
    <div
      style={{
        flex: "1 1 340px",
        background: "var(--c-card)",
        border: "1px solid var(--c-card-border)",
        borderRadius: 14,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 22 }}>{model.icon}</span>
        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: "var(--c-text1)",
            flexGrow: 1,
          }}
        >
          {model.name}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--c-text3)",
            background: "var(--c-chip-bg)",
            border: "1px solid var(--c-chip-border)",
            borderRadius: 6,
            padding: "2px 7px",
          }}
        >
          {model.provider}
        </span>
        <span style={tierBadgeStyle(model.tier)}>{model.tier}</span>
      </div>

      {/* Price info */}
      <div style={{ fontSize: 13, color: "var(--c-text2)" }}>
        <div style={{ fontWeight: 600, color: "var(--c-text1)" }}>
          {priceLabel}
        </div>
        {showApiPrice && (
          <div style={{ color: "var(--c-text3)", marginTop: 2 }}>
            {t.apiPrice(model.inputPricePerM, model.outputPricePerM)}
          </div>
        )}
        <div style={{ color: "var(--c-text3)", marginTop: 2 }}>
          {contextLabel}
        </div>
      </div>

      {/* Rating bars */}
      <div>
        <RatingBar label={t.speedLabel} value={model.speedRating} color="#FF6E40" />
        <RatingBar label={t.qualityLabel} value={model.qualityRating} color="#4285F4" />
        <RatingBar label={t.privacyLabel} value={model.privacyRating} color="#43A047" />
      </div>

      {/* Feature icons */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {(
          [
            { key: "supportsFiles", icon: "📎", label: "Files" },
            { key: "supportsImages", icon: "🖼️", label: "Images" },
            { key: "supportsCode", icon: "💻", label: "Code" },
            { key: "hasWebSearch", icon: "🌐", label: "Web" },
          ] as const
        ).map(({ key, icon, label }) => (
          <span
            key={key}
            style={{
              fontSize: 12,
              color: model[key] ? "var(--c-text2)" : "var(--c-text4)",
              opacity: model[key] ? 1 : 0.4,
            }}
          >
            {icon} {label}
          </span>
        ))}
      </div>

      {/* Best for chips */}
      <div>
        <div
          style={{ fontSize: 11, color: "var(--c-text3)", marginBottom: 5 }}
        >
          Best for
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {model.bestFor.slice(0, 3).map((item) => (
            <span
              key={item}
              style={{
                fontSize: 11,
                background: "#dcfce7",
                color: "#15803d",
                borderRadius: 6,
                padding: "2px 8px",
                fontWeight: 500,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Not good for chips */}
      <div>
        <div
          style={{ fontSize: 11, color: "var(--c-text3)", marginBottom: 5 }}
        >
          Not ideal for
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {model.notGoodFor.slice(0, 2).map((item) => (
            <span
              key={item}
              style={{
                fontSize: 11,
                background: "var(--c-chip-bg)",
                color: "var(--c-chip-color)",
                border: "1px solid var(--c-chip-border)",
                borderRadius: 6,
                padding: "2px 8px",
                fontWeight: 500,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ModelComparison({ lang }: { lang: Lang }) {
  const t = T[lang];

  // Recommender state
  const [taskInput, setTaskInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [taskCategory, setTaskCategory] = useState("");
  const [recommenderError, setRecommenderError] = useState<string | null>(null);

  // Cost calculator state
  const [dailyPrompts, setDailyPrompts] = useState(50);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredModels = applyFilter(MODELS, activeFilter);

  // Compute costs and find cheapest
  const costRows = MODELS.map((model) => {
    const computed = calcMonthlyCost(model, dailyPrompts);
    return { model, computed };
  });

  const cheapestCost = Math.min(
    ...costRows
      .filter((r) => r.computed !== null)
      .map((r) => r.computed as number)
  );

  async function handleFindModel() {
    if (!taskInput.trim()) return;
    setIsLoading(true);
    setRecommenderError(null);
    setRecommendations([]);
    setTaskCategory("");

    try {
      const res = await fetch("/api/recommend-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskInput.trim(), lang }),
      });

      const data = (await res.json()) as RecommendResponse;

      if (data.error === "ratelimit") {
        setRecommenderError(t.errorRateLimit);
        return;
      }
      if (data.error) {
        setRecommenderError(t.errorGeneric);
        return;
      }

      setRecommendations(data.recommendations ?? []);
      setTaskCategory(data.taskCategory ?? "");
    } catch {
      setRecommenderError(t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 40,
        padding: "0 0 40px",
      }}
    >
      {/* ── Section 1: AI Recommender ── */}
      <section
        style={{
          background: "var(--c-card)",
          border: "1px solid var(--c-card-border)",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--c-text1)",
            marginBottom: 16,
          }}
        >
          {t.recommenderHeader}
        </h2>

        <textarea
          rows={2}
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder={t.recommenderPlaceholder}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid var(--c-input-border)",
            background: "var(--c-input)",
            color: "var(--c-text1)",
            fontSize: 14,
            resize: "vertical",
            fontFamily: "inherit",
            outline: "none",
            marginBottom: 12,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              void handleFindModel();
            }
          }}
        />

        <button
          onClick={() => void handleFindModel()}
          disabled={isLoading || !taskInput.trim()}
          style={{
            padding: "10px 22px",
            borderRadius: 10,
            border: "none",
            background: isLoading || !taskInput.trim() ? "var(--c-sep)" : "var(--c-text1)",
            color: isLoading || !taskInput.trim() ? "var(--c-text3)" : "var(--c-card)",
            fontWeight: 600,
            fontSize: 14,
            cursor: isLoading || !taskInput.trim() ? "not-allowed" : "pointer",
            transition: "opacity 0.2s",
          }}
        >
          {isLoading ? (
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  border: "2px solid currentColor",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  verticalAlign: "middle",
                  marginRight: 7,
                }}
              />
              {t.loading}
            </span>
          ) : (
            t.findBtn
          )}
        </button>

        {/* Error */}
        {recommenderError && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 14px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: 10,
              fontSize: 13,
            }}
          >
            {recommenderError}
          </div>
        )}

        {/* Results */}
        {recommendations.length > 0 && (
          <div style={{ marginTop: 20 }}>
            {taskCategory && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--c-text3)",
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                Category: {taskCategory}
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {recommendations.map((rec, idx) => (
                <div
                  key={rec.model + idx}
                  style={{
                    flex: "1 1 200px",
                    background: "var(--c-hover)",
                    border: "1px solid var(--c-card-border)",
                    borderRadius: 12,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "var(--c-text1)",
                      }}
                    >
                      #{idx + 1} {rec.model}
                    </span>
                    <span style={scoreBadgeStyle(rec.score)}>
                      {t.scoreBadgeLabel(rec.score)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--c-text2)" }}>
                    {rec.reason}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--c-text3)" }}>
                    <span style={{ fontWeight: 600 }}>{t.keyFeature}</span>{" "}
                    {rec.keyFeature}
                  </div>
                  {rec.warningIfAny && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#b45309",
                        background: "#fef3c7",
                        borderRadius: 7,
                        padding: "4px 8px",
                      }}
                    >
                      {t.warning} {rec.warningIfAny}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Section 2: Cost Calculator ── */}
      <section
        style={{
          background: "var(--c-card)",
          border: "1px solid var(--c-card-border)",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--c-text1)",
            marginBottom: 16,
          }}
        >
          💰 Cost Calculator
        </h2>

        <label
          style={{
            fontSize: 14,
            color: "var(--c-text2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          {t.costHeader}
          <input
            type="number"
            min={1}
            max={10000}
            value={dailyPrompts}
            onChange={(e) => setDailyPrompts(Math.max(1, parseInt(e.target.value) || 1))}
            style={{
              width: 80,
              padding: "5px 10px",
              borderRadius: 8,
              border: "1px solid var(--c-input-border)",
              background: "var(--c-input)",
              color: "var(--c-text1)",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </label>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--c-sep)",
                  color: "var(--c-text3)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 12px 8px 0",
                    fontWeight: 600,
                  }}
                >
                  {t.costTableModel}
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "8px 0",
                    fontWeight: 600,
                  }}
                >
                  {t.costTableMonthly}
                </th>
              </tr>
            </thead>
            <tbody>
              {costRows.map(({ model, computed }) => {
                const isCheapest =
                  computed !== null && computed === cheapestCost;
                const isFlatRate = computed === null;

                return (
                  <tr
                    key={model.id}
                    style={{
                      borderBottom: "1px solid var(--c-sep)",
                      background: isCheapest
                        ? "rgba(34,197,94,0.08)"
                        : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 12px 10px 0",
                        color: "var(--c-text1)",
                        fontWeight: 500,
                      }}
                    >
                      {model.icon} {model.name}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        padding: "10px 0",
                        color: isCheapest ? "#15803d" : "var(--c-text2)",
                        fontWeight: isCheapest ? 700 : 400,
                      }}
                    >
                      {isFlatRate ? (
                        <span>
                          ${model.monthlyPrice}{t.perMonth}{" "}
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--c-text3)",
                            }}
                          >
                            ({t.flatRate})
                          </span>
                        </span>
                      ) : (
                        <span>
                          {isCheapest && (
                            <span style={{ marginRight: 5 }}>✅</span>
                          )}
                          {formatCost(computed as number)}
                          {isCheapest && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 11,
                                color: "#15803d",
                                fontWeight: 600,
                              }}
                            >
                              {t.cheapest}
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 3: Filter + Model Grid ── */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--c-text3)", fontWeight: 600 }}>
            {t.filterLabel}
          </span>
          {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border:
                  activeFilter === key
                    ? "1.5px solid var(--c-text1)"
                    : "1px solid var(--c-chip-border)",
                background:
                  activeFilter === key ? "var(--c-text1)" : "var(--c-chip-bg)",
                color:
                  activeFilter === key ? "var(--c-card)" : "var(--c-chip-color)",
                fontSize: 13,
                fontWeight: activeFilter === key ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {FILTER_LABELS[key][lang]}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} lang={lang} />
          ))}
        </div>
      </section>

      {/* Spinner keyframes injected inline */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
