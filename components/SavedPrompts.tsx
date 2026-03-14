"use client";

import { useState, useEffect } from "react";
import { supabase, hasSupabase } from "@/lib/supabase";

type Lang = "en" | "pl";

interface SavedPrompt {
  id: string;
  original_prompt: string;
  optimized_prompt: string;
  selected_chat: string;
  fixes: string[];
  created_at: string;
}

type SupabaseUser = { id: string; email?: string } | null;

const T = {
  en: {
    title: "📂 Prompt History",
    subtitle_logged: "Your saved prompts from the cloud",
    subtitle_local: "Last 20 prompts from this browser",
    login_cta: "Sign in to save unlimited prompts to the cloud",
    empty_logged: "No saved prompts yet. Polish your first prompt!",
    empty_local: "No history yet. Polish your first prompt!",
    reuse: "Use again",
    delete: "Delete",
    original: "Original",
    polished: "Polished",
    for: "for",
    fixes_label: "Fixes:",
    loading: "Loading…",
  },
  pl: {
    title: "📂 Historia promptów",
    subtitle_logged: "Twoje zapisane prompty z chmury",
    subtitle_local: "Ostatnie 20 promptów z tej przeglądarki",
    login_cta: "Zaloguj się, aby zapisywać nielimitowane prompty w chmurze",
    empty_logged: "Brak zapisanych promptów. Wypoleruj swój pierwszy prompt!",
    empty_local: "Brak historii. Wypoleruj swój pierwszy prompt!",
    reuse: "Użyj ponownie",
    delete: "Usuń",
    original: "Oryginalny",
    polished: "Wypolerowany",
    for: "dla",
    fixes_label: "Poprawki:",
    loading: "Ładowanie…",
  },
};

interface SavedPromptsProps {
  lang: Lang;
  onReuse: (prompt: string) => void;
  currentUser: SupabaseUser;
}

export default function SavedPrompts({ lang, onReuse, currentUser }: SavedPromptsProps) {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const t = T[lang];

  useEffect(() => {
    loadPrompts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const loadPrompts = async () => {
    setLoading(true);
    if (currentUser && hasSupabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("saved_prompts") as any)
        .select("id, original_prompt, optimized_prompt, selected_chat, fixes, created_at")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(50) as { data: SavedPrompt[] | null };
      setPrompts(data ?? []);
    } else {
      const local = JSON.parse(localStorage.getItem("mikeprompt_history") ?? "[]") as {
        original: string; optimized: string; chat: string; fixes: string[]; timestamp: string;
      }[];
      setPrompts(local.map((p, i) => ({
        id: String(i),
        original_prompt: p.original,
        optimized_prompt: p.optimized,
        selected_chat: p.chat,
        fixes: p.fixes ?? [],
        created_at: p.timestamp,
      })));
    }
    setLoading(false);
  };

  const deletePrompt = async (id: string) => {
    if (currentUser && hasSupabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("saved_prompts") as any).delete().eq("id", id);
    } else {
      const local = JSON.parse(localStorage.getItem("mikeprompt_history") ?? "[]") as unknown[];
      localStorage.setItem("mikeprompt_history", JSON.stringify(local.filter((_, i) => String(i) !== id)));
    }
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-GB", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Fraunces', serif", color: "var(--c-text1)", marginBottom: 6 }}>
          {t.title}
        </h2>
        <p style={{ fontSize: 13, color: "var(--c-text3)" }}>
          {currentUser ? t.subtitle_logged : t.subtitle_local}
        </p>
      </div>

      {/* CTA for non-logged users */}
      {!currentUser && (
        <div style={{
          background: "rgba(255,110,64,0.06)", border: "1px solid rgba(255,110,64,0.2)",
          borderRadius: 12, padding: "12px 16px", marginBottom: 20,
          fontSize: 13, color: "var(--c-text2)",
        }}>
          ☁️ {t.login_cta}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <p style={{ color: "var(--c-text3)", fontSize: 13 }}>{t.loading}</p>
      ) : prompts.length === 0 ? (
        <p style={{ color: "var(--c-text3)", fontSize: 13 }}>{currentUser ? t.empty_logged : t.empty_local}</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {prompts.map((prompt) => {
            const expanded = expandedId === prompt.id;
            return (
              <div
                key={prompt.id}
                style={{
                  background: "var(--c-card)", borderRadius: 14,
                  border: "1px solid var(--c-card-border)",
                  boxShadow: "var(--c-card-sm)",
                  overflow: "hidden",
                }}
              >
                {/* Card header */}
                <div
                  onClick={() => setExpandedId(expanded ? null : prompt.id)}
                  style={{
                    padding: "14px 16px", cursor: "pointer",
                    display: "flex", alignItems: "flex-start", gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, color: "var(--c-text1)", fontWeight: 500,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {prompt.original_prompt}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--c-text4)", marginTop: 4, display: "flex", gap: 10 }}>
                      <span>{formatDate(prompt.created_at)}</span>
                      {prompt.selected_chat && <span>· {t.for} {prompt.selected_chat}</span>}
                      {prompt.fixes.length > 0 && <span>· {prompt.fixes.length} {t.fixes_label}</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--c-text4)", flexShrink: 0, marginTop: 2 }}>
                    {expanded ? "▲" : "▼"}
                  </span>
                </div>

                {/* Expanded content */}
                {expanded && (
                  <div style={{ borderTop: "1px solid var(--c-sep)", padding: "14px 16px" }}>
                    {/* Original */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--c-text4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                        {t.original}
                      </div>
                      <p style={{ fontSize: 13, color: "var(--c-text2)", lineHeight: 1.6, margin: 0 }}>
                        {prompt.original_prompt}
                      </p>
                    </div>

                    {/* Polished */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#43A047", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                        ✨ {t.polished}
                      </div>
                      <p style={{
                        fontSize: 13, color: "var(--c-prompt-text)", lineHeight: 1.6, margin: 0,
                        background: "var(--c-green-bg)", borderRadius: 8, padding: "10px 12px",
                        border: "1px solid var(--c-green-border)",
                      }}>
                        {prompt.optimized_prompt}
                      </p>
                    </div>

                    {/* Fixes */}
                    {prompt.fixes.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--c-text4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                          {t.fixes_label}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {prompt.fixes.map((fix, i) => (
                            <span key={i} style={{
                              fontSize: 11, padding: "3px 9px", borderRadius: 100,
                              background: "var(--c-fix-bg)", border: "1px solid var(--c-fix-border)",
                              color: "var(--c-text3)",
                            }}>
                              {fix}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => { onReuse(prompt.optimized_prompt); }}
                        style={{
                          padding: "7px 16px", borderRadius: 8, border: "none",
                          background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                          color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        {t.reuse}
                      </button>
                      <button
                        onClick={() => deletePrompt(prompt.id)}
                        style={{
                          padding: "7px 14px", borderRadius: 8,
                          border: "1px solid var(--c-card-border)",
                          background: "none", color: "var(--c-text3)",
                          fontSize: 12, cursor: "pointer",
                        }}
                      >
                        {t.delete}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
