"use client";

import { useState, useEffect } from "react";

interface SavedPromptItem {
  id: string;
  original: string;
  optimized: string;
  category: string;
  savedAt: string;
  usageCount: number;
}

interface Props {
  lang: "pl" | "en";
  onSendToChat: (prompt: string) => void;
}

const T = {
  pl: {
    headline: "Moje prompty",
    subline: "Twoje wypolerowane zapytania gotowe do użycia jednym kliknięciem",
    empty_title: "Nie masz jeszcze zapisanych promptów.",
    empty_body: "Wypoleruj swoje pierwsze zapytanie w zakładce Poleruj.",
    empty_btn: "Przejdź do Poleruj",
    all: "Wszystkie",
    search_placeholder: "Szukaj w moich promptach...",
    used: (n: number) => `Użyto: ${n} ${n === 1 ? "raz" : "razy"}`,
    use_in_chat: "Użyj w chacie",
    copy: "Kopiuj",
    copied: "Skopiowano",
    delete: "Usuń",
    show_original: "Pokaż oryginał",
    hide_original: "Ukryj oryginał",
    original_label: "Oryginalne zapytanie:",
    sort_new: "Najnowsze",
  },
  en: {
    headline: "My prompts",
    subline: "Your polished prompts ready to use in one click",
    empty_title: "No saved prompts yet.",
    empty_body: "Polish your first request in the Polish tab.",
    empty_btn: "Go to Polish",
    all: "All",
    search_placeholder: "Search my prompts...",
    used: (n: number) => `Used: ${n} ${n === 1 ? "time" : "times"}`,
    use_in_chat: "Use in chat",
    copy: "Copy",
    copied: "Copied",
    delete: "Delete",
    show_original: "Show original",
    hide_original: "Hide original",
    original_label: "Original request:",
    sort_new: "Newest",
  },
};

export default function MyPrompts({ lang, onSendToChat }: Props) {
  const t = T[lang];
  const [prompts, setPrompts] = useState<SavedPromptItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOriginals, setExpandedOriginals] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mikeprompt_saved_prompts") ?? "[]") as SavedPromptItem[];
    setPrompts(saved.sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
  }, []);

  const categories = ["all", ...Array.from(new Set(prompts.map((p) => p.category)))];

  const filtered = prompts.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.optimized.toLowerCase().includes(q) || p.original.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleDelete = (id: string) => {
    const updated = prompts.filter((p) => p.id !== id);
    setPrompts(updated);
    localStorage.setItem("mikeprompt_saved_prompts", JSON.stringify(updated));
  };

  const handleCopy = (item: SavedPromptItem) => {
    navigator.clipboard.writeText(item.optimized).catch(() => {});
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleUseInChat = (item: SavedPromptItem) => {
    const updated = prompts.map((p) => p.id === item.id ? { ...p, usageCount: p.usageCount + 1 } : p);
    setPrompts(updated);
    localStorage.setItem("mikeprompt_saved_prompts", JSON.stringify(updated));
    onSendToChat(item.optimized);
  };

  const toggleOriginal = (id: string) => {
    setExpandedOriginals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch { return ""; }
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, margin: "0 0 6px", color: "var(--c-text1)" }}>
          {t.headline}
        </h2>
        <p style={{ fontSize: 13, color: "var(--c-text3)", margin: 0 }}>{t.subline}</p>
      </div>

      {prompts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontSize: 15, color: "var(--c-text2)", marginBottom: 6 }}>{t.empty_title}</p>
          <p style={{ fontSize: 13, color: "var(--c-text3)", marginBottom: 24 }}>{t.empty_body}</p>
        </div>
      ) : (
        <>
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search_placeholder}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              border: "1px solid var(--c-input-border, var(--c-card-border))",
              background: "var(--c-input, var(--c-bg))", color: "var(--c-text1)",
              fontSize: 13, outline: "none", marginBottom: 12, fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />

          {/* Category filter */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "5px 14px", borderRadius: 100, cursor: "pointer",
                  whiteSpace: "nowrap", fontFamily: "inherit", fontSize: 12, fontWeight: activeCategory === cat ? 600 : 400,
                  background: activeCategory === cat ? "rgba(255,110,64,0.1)" : "var(--c-chip-bg, var(--c-card))",
                  color: activeCategory === cat ? "#FF6E40" : "var(--c-text3)",
                  border: activeCategory === cat ? "1px solid rgba(255,110,64,0.3)" : "1px solid var(--c-chip-border, var(--c-card-border))",
                  textTransform: cat === "all" ? "none" : "uppercase",
                  letterSpacing: cat === "all" ? 0 : "0.5px",
                } as React.CSSProperties}
              >
                {cat === "all" ? t.all : cat}
              </button>
            ))}
          </div>

          {/* Prompt cards */}
          {filtered.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--c-text4)", textAlign: "center", padding: "32px 0" }}>
              {lang === "pl" ? "Brak wyników dla tego wyszukiwania." : "No results for this search."}
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "var(--c-card)",
                  border: "1px solid var(--c-card-border)",
                  borderRadius: 14,
                  padding: "16px 20px",
                  marginBottom: 10,
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "#FF6E40",
                    background: "rgba(255,110,64,0.08)", borderRadius: 100,
                    padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--c-text4)" }}>{formatDate(item.savedAt)}</span>
                </div>

                {/* Optimized text */}
                <div style={{
                  fontSize: 14, color: "var(--c-text1)", lineHeight: 1.6,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical" as const,
                  marginBottom: 8,
                }}>
                  {item.optimized}
                </div>

                {/* Show original toggle */}
                {item.original && (
                  <div style={{ marginBottom: 8 }}>
                    <button
                      onClick={() => toggleOriginal(item.id)}
                      style={{ fontSize: 11, color: "var(--c-text4)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                    >
                      {expandedOriginals.has(item.id) ? t.hide_original : t.show_original}
                    </button>
                    {expandedOriginals.has(item.id) && (
                      <div style={{ marginTop: 6, padding: "8px 12px", borderRadius: 8, background: "var(--c-stat-bg, rgba(0,0,0,0.03))", fontSize: 12, color: "var(--c-text3)", lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 600, display: "block", marginBottom: 2 }}>{t.original_label}</span>
                        {item.original}
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "var(--c-text4)" }}>{t.used(item.usageCount)}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => handleUseInChat(item)}
                      style={{
                        padding: "6px 14px", borderRadius: 8, border: "none",
                        background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                        color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      {t.use_in_chat}
                    </button>
                    <button
                      onClick={() => handleCopy(item)}
                      style={{
                        padding: "6px 12px", borderRadius: 8,
                        border: "1px solid var(--c-card-border)",
                        background: "var(--c-card)",
                        color: copiedId === item.id ? "#2E7D32" : "var(--c-text2)",
                        fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                        transition: "color 0.15s",
                      }}
                    >
                      {copiedId === item.id ? t.copied : t.copy}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ fontSize: 11, color: "var(--c-text4)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
