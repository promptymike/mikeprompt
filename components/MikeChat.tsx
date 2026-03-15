"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Profile } from "./UserProfile";

type Lang = "pl" | "en";

interface Message {
  id: string;
  role: "user" | "assistant" | "thinking";
  content: string;
  timestamp: Date;
}

interface Props {
  lang: Lang;
  profile: Profile;
  currentUser: { id: string; email?: string } | null;
}

const T = {
  en: {
    welcome: "Hi! I'm Mike 👋 Your AI office assistant. Tell me what you need — an email, formal letter, report, summary. Just write naturally, no prompts needed.",
    thinking: "Mike is thinking...",
    copy: "📋 Copy",
    copied: "✓ Copied!",
    placeholder: "Type a message…",
    safe_mode: "🔒 Safe mode",
    paywall_title: "⏰ Mike gave it his all today.",
    paywall_body: "You've used your 15 free messages.\nCome back tomorrow — or work with Mike without limits.",
    paywall_btn: "🚀 Unlock Pro for 10 PLN/month",
    chips: [
      { label: "📧 Client email", prompt: "Write a professional client email" },
      { label: "📄 Formal letter", prompt: "Help me write a formal business letter" },
      { label: "📊 Monthly report", prompt: "Prepare a monthly report template" },
      { label: "💰 Payment reminder", prompt: "Write a polite but firm payment reminder" },
      { label: "📋 Meeting minutes", prompt: "Help me write meeting minutes" },
    ],
  },
  pl: {
    welcome: "Cześć! Jestem Mike 👋 Twój asystent biurowy AI. Napisz mi co potrzebujesz — maila, pismo do urzędu, raport, podsumowanie. Zacznij od razu, bez żadnych promptów.",
    thinking: "Mike przygotowuje odpowiedź...",
    copy: "📋 Kopiuj",
    copied: "✓ Skopiowano!",
    placeholder: "Napisz wiadomość…",
    safe_mode: "🔒 Bezpieczny tryb",
    paywall_title: "⏰ Mike dał z siebie wszystko na dziś.",
    paywall_body: "Wykorzystałeś 15 darmowych wiadomości.\nWróć jutro — lub pracuj z Mike'iem bez limitów.",
    paywall_btn: "🚀 Odblokuj Pro za 10 zł/mc",
    chips: [
      { label: "📧 Mail do klienta", prompt: "Napisz profesjonalny mail do klienta" },
      { label: "🏛️ Pismo do US", prompt: "Pomóż mi napisać pismo do Urzędu Skarbowego" },
      { label: "📊 Raport miesięczny", prompt: "Przygotuj szablon raportu miesięcznego" },
      { label: "💰 Ponaglenie zapłaty", prompt: "Napisz uprzejme ale stanowcze ponaglenie do zapłaty" },
      { label: "📋 Protokół spotkania", prompt: "Pomóż mi napisać protokół ze spotkania" },
    ],
  },
};

const todayKey = () => `mikeprompt_chat_count_${new Date().toISOString().slice(0, 10)}`;

export default function MikeChat({ lang, profile, currentUser }: Props) {
  const t = T[lang];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [anonymize, setAnonymize] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const count = parseInt(localStorage.getItem(todayKey()) ?? "0", 10);
    setUsageCount(count);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const sendMessage = useCallback(
    async (overrideInput?: string) => {
      const text = (overrideInput ?? input).trim();
      if (!text || isStreaming || usageCount >= 15) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "44px";
      }

      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem(todayKey(), String(newCount));

      setIsThinking(true);
      const thinkingId = `thinking-${Date.now()}`;
      setMessages([
        ...newMessages,
        { id: thinkingId, role: "thinking", content: "thinking", timestamp: new Date() },
      ]);

      setIsStreaming(true);
      let assistantContent = "";
      let firstChunk = true;
      const assistantId = `assistant-${Date.now()}`;

      try {
        const profileObj =
          profile && (profile.name || profile.role || profile.industry)
            ? (profile as unknown as Record<string, unknown>)
            : undefined;

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
            profile: profileObj,
            lang,
            anonymize,
          }),
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && !line.includes("[DONE]")) {
              const encoded = line.slice(6);
              const text = decodeURIComponent(encoded);
              assistantContent += text;
              if (firstChunk) {
                setIsThinking(false);
                firstChunk = false;
                setMessages([
                  ...newMessages,
                  { id: assistantId, role: "assistant", content: assistantContent, timestamp: new Date() },
                ]);
              } else {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantContent } : m
                  )
                );
              }
            }
          }
        }
      } catch {
        setIsThinking(false);
        setMessages((prev) => prev.filter((m) => m.role !== "thinking"));
      } finally {
        setIsStreaming(false);
        setIsThinking(false);
      }
    },
    [input, isStreaming, usageCount, messages, profile, lang, anonymize]
  );

  const handleChip = (prompt: string) => {
    setInput(prompt);
    // Trigger send on next tick so state updates first
    setTimeout(() => sendMessage(prompt), 0);
  };

  const handleCopy = (msg: Message) => {
    navigator.clipboard.writeText(msg.content).catch(() => {});
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const atLimit = usageCount >= 15;

  return (
    <div
      style={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        background: "var(--c-bg)",
      }}
    >
      <style>{`
        @keyframes mikethinking {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        .mike-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #FF6E40; display: inline-block;
          animation: mikethinking 1.4s ease-in-out infinite;
        }
        .copy-btn { opacity: 0; transition: opacity 0.15s; }
        @media (hover: none) { .copy-btn { opacity: 1 !important; } }
        .assistant-bubble:hover .copy-btn { opacity: 1; }
      `}</style>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: 20,
              paddingTop: 40,
            }}
          >
            <p
              style={{
                textAlign: "center",
                color: "var(--c-text3)",
                maxWidth: 400,
                margin: "0 auto",
                fontSize: 15,
                lineHeight: 1.65,
              }}
            >
              {t.welcome}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 480 }}>
              {t.chips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleChip(chip.prompt)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 20,
                    border: "1px solid var(--c-card-border)",
                    background: "var(--c-card)",
                    color: "var(--c-text2)",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          if (msg.role === "thinking") {
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: "flex-start",
                  background: "var(--c-card)",
                  border: "1px solid var(--c-card-border)",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "14px 18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <span className="mike-dot" style={{ animationDelay: "0ms" }} />
                  <span className="mike-dot" style={{ animationDelay: "150ms" }} />
                  <span className="mike-dot" style={{ animationDelay: "300ms" }} />
                </div>
                <span style={{ fontSize: 11, color: "var(--c-text4)" }}>{t.thinking}</span>
              </div>
            );
          }

          if (msg.role === "user") {
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: "flex-end",
                  background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                  color: "white",
                  borderRadius: "18px 18px 4px 18px",
                  padding: "12px 16px",
                  maxWidth: "75%",
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content}
              </div>
            );
          }

          // assistant
          return (
            <div
              key={msg.id}
              className="assistant-bubble"
              style={{
                alignSelf: "flex-start",
                background: "var(--c-card)",
                border: "1px solid var(--c-card-border)",
                borderRadius: "18px 18px 18px 4px",
                padding: "14px 18px",
                maxWidth: "85%",
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>{msg.content}</span>
              <button
                className="copy-btn"
                onClick={() => handleCopy(msg)}
                style={{
                  alignSelf: "flex-end",
                  marginTop: 6,
                  fontSize: 11,
                  background: "var(--c-card)",
                  border: "1px solid var(--c-card-border)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  cursor: "pointer",
                  color: copiedId === msg.id ? "#2E7D32" : "var(--c-text3)",
                  transition: "color 0.15s",
                }}
              >
                {copiedId === msg.id ? t.copied : t.copy}
              </button>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          borderTop: "1px solid var(--c-sep)",
          padding: "12px 16px",
          background: "var(--c-card)",
        }}
      >
        {atLimit ? (
          <div
            style={{
              background: "rgba(255,110,64,0.08)",
              border: "1px solid rgba(255,110,64,0.3)",
              borderRadius: 16,
              padding: 24,
              textAlign: "center",
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--c-text2)",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--c-text1)" }}>
              {t.paywall_title}
            </div>
            <div style={{ marginBottom: 20, whiteSpace: "pre-line" }}>{t.paywall_body}</div>
            <a
              href="#"
              style={{
                display: "inline-block",
                padding: "11px 24px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              {t.paywall_btn}
            </a>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  resizeTextarea();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={t.placeholder}
                rows={1}
                style={{
                  flex: 1,
                  minHeight: 44,
                  maxHeight: 160,
                  resize: "none",
                  borderRadius: 12,
                  border: "1px solid var(--c-card-border)",
                  background: "var(--c-bg)",
                  color: "var(--c-text1)",
                  padding: "11px 14px",
                  fontSize: 14,
                  lineHeight: 1.5,
                  outline: "none",
                  fontFamily: "inherit",
                  overflowY: "auto",
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isStreaming}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "none",
                  background:
                    !input.trim() || isStreaming
                      ? "var(--c-card-border)"
                      : "linear-gradient(135deg, #FF6E40, #FF8A65)",
                  color: "white",
                  fontSize: 16,
                  cursor: !input.trim() || isStreaming ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
              >
                ▶
              </button>
            </div>

            {/* Compact safe-mode toggle */}
            <div
              onClick={() => setAnonymize((v) => !v)}
              style={{
                marginTop: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                userSelect: "none",
                fontSize: 12,
                color: anonymize ? "#FF6E40" : "var(--c-text4)",
                transition: "color 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={anonymize}
                onChange={(e) => { e.stopPropagation(); setAnonymize(e.target.checked); }}
                style={{ width: 13, height: 13, accentColor: "#FF6E40", cursor: "pointer" }}
              />
              {t.safe_mode}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
