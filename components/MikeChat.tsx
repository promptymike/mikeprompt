"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Profile } from "./UserProfile";
import { anonymizeText } from "@/lib/anonymize";

type Lang = "pl" | "en";

interface Message {
  id: string;
  role: "user" | "assistant" | "thinking";
  content: string;
  timestamp: Date;
  maskCount?: number; // > 0 means anonymize was applied
}

interface Props {
  lang: Lang;
  profile: Profile;
  currentUser: { id: string; email?: string } | null;
}

const T = {
  en: {
    headline: "Hi! I'm Mike.",
    subline: "Your AI office assistant. Tell me what to write — email, letter, report.",
    thinking: "Mike is thinking...",
    copy: "📋 Copy",
    copied: "✓ Copied!",
    placeholder: "Type a message…",
    or_write: "or just write what you need ↓",
    privacy_off: "🔒 Privacy: data is NOT masked — click to enable protection",
    privacy_on: "🛡️ Privacy active: tax IDs, amounts masked locally before AI",
    masked_badge: (n: number) => `🔒 ${n} item${n === 1 ? "" : "s"} masked before sending`,
    paywall_title: "⏰ Mike gave it his all today.",
    paywall_body: "You've used your 15 free messages.\nCome back tomorrow — or work with Mike without limits.",
    paywall_btn: "🚀 Unlock Pro for 10 PLN/month",
    workflows: [
      {
        icon: "📄",
        title: "Payment demand letter",
        description: "Per Art. 476 Civil Code — with 11.25% interest and 14-day deadline",
        prompt: "Write a payment demand letter. I need: amount owed, due date, debtor name (you can use [DEBTOR NAME] for anonymity). The letter should cite Art. 476 Civil Code, include statutory interest for delay (11.25% per annum) and a 14-day payment deadline. Creditor details: [COMPANY NAME], tax ID: [TAX ID].",
      },
      {
        icon: "🏛️",
        title: "Reply to ZUS / tax authority",
        description: "Formal letter with proper structure and legal references",
        prompt: "Help me write a reply to a summons from ZUS or the Tax Authority. Describe the case: what the summons concerns and what you want to explain or contest. I will prepare a letter with proper structure, date, sender details and reference to the relevant regulations.",
      },
      {
        icon: "📊",
        title: "JPK discrepancy explanation",
        description: "Letter to Tax Office explaining JPK_V7 differences",
        prompt: "Write a letter explaining discrepancies in JPK_V7. Tell me: which period, what the discrepancy is and what caused it. I can use [PLACEHOLDER] for confidential data. I will prepare a formal letter to the Tax Office.",
      },
      {
        icon: "📋",
        title: "Internal procedure / instruction",
        description: "Step-by-step guide for staff — invoices, expenses, requests",
        prompt: "Write an internal procedure for employees. Topic: [describe — e.g. how to properly describe cost invoices, how to settle business travel expenses, how to submit leave requests]. The procedure should be simple, step-by-step, understandable for someone without accounting knowledge. Format: numbered steps with examples.",
      },
      {
        icon: "📧",
        title: "Missing documents email",
        description: "Polite but direct email listing missing documents",
        prompt: "Write an email to a client or employee about missing documents. Provide: which documents are missing and what the submission deadline is. If you want — add consequences of missing the deadline. Tone: polite but direct.",
      },
    ],
  },
  pl: {
    headline: "Cześć! Jestem Mike.",
    subline: "Twój asystent biurowy AI. Powiedz mi co napisać — maila, pismo, raport.",
    thinking: "Mike przygotowuje odpowiedź...",
    copy: "📋 Kopiuj",
    copied: "✓ Skopiowano!",
    placeholder: "Napisz wiadomość…",
    or_write: "lub napisz wprost co potrzebujesz ↓",
    privacy_off: "🔒 Prywatność: dane NIE są maskowane — kliknij aby włączyć ochronę",
    privacy_on: "🛡️ Prywatność aktywna: NIP, PESEL i kwoty są maskowane lokalnie",
    masked_badge: (n: number) => `🔒 ${n} ${n === 1 ? "dana zamaskowana" : n < 5 ? "dane zamaskowane" : "danych zamaskowanych"} przed wysłaniem`,
    paywall_title: "⏰ Mike dał z siebie wszystko na dziś.",
    paywall_body: "Wykorzystałeś 15 darmowych wiadomości.\nWróć jutro — lub pracuj z Mike'iem bez limitów.",
    paywall_btn: "🚀 Odblokuj Pro za 10 zł/mc",
    workflows: [
      {
        icon: "📄",
        title: "Wezwanie do zapłaty",
        description: "Zgodne z art. 476 KC — z odsetkami 11.25% i terminem 14 dni",
        prompt: "Napisz wezwanie do zapłaty. Potrzebuję: kwota należności, data wymagalności, nazwa dłużnika (możesz użyć [NAZWA DŁUŻNIKA] dla anonimowości). Wezwanie ma być zgodne z art. 476 KC, zawierać naliczone odsetki ustawowe za opóźnienie (11.25% rocznie) i 14-dniowy termin zapłaty. Dane wierzyciela: [NAZWA FIRMY], NIP: [NIP].",
      },
      {
        icon: "🏛️",
        title: "Odpowiedź na wezwanie ZUS / US",
        description: "Formalne pismo z właściwą strukturą i przepisami",
        prompt: "Pomóż mi napisać odpowiedź na wezwanie z ZUS lub Urzędu Skarbowego. Opisz sprawę: czego dotyczy wezwanie i co chcesz wyjaśnić lub zakwestionować. Przygotuję pismo z właściwą strukturą, datą, danymi nadawcy i powołaniem na właściwe przepisy.",
      },
      {
        icon: "📊",
        title: "Wyjaśnienie rozbieżności w JPK",
        description: "Pismo do US wyjaśniające różnice w pliku JPK_V7",
        prompt: "Napisz pismo wyjaśniające rozbieżności w JPK_V7. Powiedz mi: za jaki okres, jaka jest rozbieżność i jaka jest jej przyczyna. Mogę użyć [PLACEHOLDER] dla danych poufnych. Przygotuję formalne pismo do Urzędu Skarbowego.",
      },
      {
        icon: "📋",
        title: "Instrukcja / procedura wewnętrzna",
        description: "Instrukcja dla pracowników — opis faktur, rozliczenia, procedury",
        prompt: "Napisz instrukcję wewnętrzną dla pracowników. Temat instrukcji: [opisz — np. jak prawidłowo opisywać faktury kosztowe, jak rozliczać delegacje, jak składać wnioski urlopowe]. Instrukcja powinna być prosta, krok po kroku, zrozumiała dla osoby bez wiedzy księgowej. Format: ponumerowane kroki z przykładami.",
      },
      {
        icon: "📧",
        title: "Mail o brakach w dokumentach",
        description: "Uprzejmy ale konkretny mail z listą brakujących dokumentów",
        prompt: "Napisz mail do klienta lub pracownika o brakujących dokumentach. Podaj: jakich dokumentów brakuje i jaki jest termin ich dostarczenia. Jeśli chcesz — dodaj konsekwencje braku dokumentów. Ton: uprzejmy ale konkretny.",
      },
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
      const rawText = (overrideInput ?? input).trim();
      if (!rawText || isStreaming || usageCount >= 15) return;

      // Client-side anonymization for badge count
      let textToSend = rawText;
      let maskCount = 0;
      if (anonymize) {
        const { anonymized, map } = anonymizeText(rawText);
        textToSend = anonymized;
        maskCount = Object.keys(map).length;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: rawText, // always show original text to user
        timestamp: new Date(),
        maskCount: maskCount > 0 ? maskCount : undefined,
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

      // Build messages for API — replace last user message content with anonymized version
      const apiMessages = newMessages.map((m, i) =>
        i === newMessages.length - 1 && m.role === "user"
          ? { role: m.role, content: textToSend }
          : { role: m.role, content: m.content }
      );

      try {
        const profileObj =
          profile && (profile.name || profile.role || profile.industry)
            ? (profile as unknown as Record<string, unknown>)
            : undefined;

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            profile: profileObj,
            lang,
            anonymize: false, // already anonymized client-side
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
              const decoded = decodeURIComponent(encoded);
              assistantContent += decoded;
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

  const handleWorkflow = (prompt: string) => {
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
        height: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        background: "var(--c-bg)",
      }}
    >
      <style>{`
        @keyframes mikethinking {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        @keyframes mikepulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,110,64,0.3); }
          50% { box-shadow: 0 0 0 12px rgba(255,110,64,0); }
        }
        .mike-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #FF6E40; display: inline-block;
          animation: mikethinking 1.4s ease-in-out infinite;
        }
        .copy-btn { opacity: 0; transition: opacity 0.15s; }
        @media (hover: none) { .copy-btn { opacity: 1 !important; } }
        .assistant-bubble:hover .copy-btn { opacity: 1; }
        .mike-workflow-card {
          background: var(--c-card);
          border: 1px solid var(--c-card-border);
          border-radius: 14px;
          padding: 14px 18px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: var(--c-text1);
          cursor: pointer;
          transition: all 0.18s;
          text-align: left;
          font-family: inherit;
          width: 100%;
        }
        .mike-workflow-card:hover {
          border-color: #FF8A65;
          background: rgba(255,110,64,0.04);
        }
        .mike-textarea:focus { border-color: #FF8A65 !important; outline: none; }
        @media (max-width: 767px) {
          .mike-chat-root { height: calc(100vh - 56px) !important; }
          .mike-messages { padding: 16px !important; }
          .mike-input-area { padding: 12px 16px max(16px, env(safe-area-inset-bottom)) !important; }
          .mike-user-bubble { max-width: 90% !important; }
          .mike-assistant-bubble { max-width: 90% !important; }
        }
      `}</style>

      {/* Messages area */}
      <div
        className="mike-messages"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
          scrollBehavior: "smooth",
        }}
      >
        {/* Welcome state — vertically + horizontally centered */}
        {messages.length === 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              maxWidth: 560,
              padding: "0 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
                animation: "mikepulse 2.5s ease-in-out infinite",
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 28, fontWeight: 700, color: "white", lineHeight: 1 }}>M</span>
            </div>

            <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: "var(--c-text1)" }}>
              {t.headline}
            </h2>
            <p style={{ fontSize: 14, color: "var(--c-text3)", maxWidth: 320, textAlign: "center", margin: "0 0 24px", lineHeight: 1.6 }}>
              {t.subline}
            </p>

            {/* Workflow cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 480 }}>
              {t.workflows.map((wf) => (
                <button key={wf.title} className="mike-workflow-card" onClick={() => handleWorkflow(wf.prompt)}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{wf.icon}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{wf.title}</div>
                    <div style={{ fontSize: 12, color: "var(--c-text3)", lineHeight: 1.5 }}>{wf.description}</div>
                  </div>
                </button>
              ))}
            </div>

            <p style={{ fontSize: 12, color: "var(--c-text4)", textAlign: "center", marginTop: 12 }}>
              {t.or_write}
            </p>
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
              <div key={msg.id} className="mike-user-bubble" style={{ alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, maxWidth: 480 }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                    color: "white",
                    borderRadius: "18px 18px 4px 18px",
                    padding: "12px 16px",
                    fontSize: 15,
                    lineHeight: 1.65,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </div>
                {msg.maskCount !== undefined && msg.maskCount > 0 && (
                  <span style={{ fontSize: 11, color: "#2E7D32", background: "rgba(67,160,71,0.08)", border: "1px solid rgba(67,160,71,0.2)", borderRadius: 8, padding: "3px 10px" }}>
                    {t.masked_badge(msg.maskCount)}
                  </span>
                )}
              </div>
            );
          }

          // assistant
          return (
            <div
              key={msg.id}
              className="assistant-bubble mike-assistant-bubble"
              style={{
                alignSelf: "flex-start",
                background: "var(--c-card)",
                border: "1px solid var(--c-card-border)",
                borderRadius: "18px 18px 18px 4px",
                padding: "16px 20px",
                maxWidth: 640,
                fontSize: 15,
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
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
                  marginTop: 8,
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
        className="mike-input-area"
        style={{
          flexShrink: 0,
          borderTop: "1px solid var(--c-sep)",
          padding: "14px 32px 18px",
          background: "var(--c-card)",
          position: "relative",
        }}
      >
        {/* Privacy badge — always visible */}
        <div
          onClick={() => setAnonymize((v) => !v)}
          style={{
            background: anonymize ? "rgba(67,160,71,0.08)" : "rgba(255,110,64,0.04)",
            border: `1px solid ${anonymize ? "rgba(67,160,71,0.3)" : "rgba(255,110,64,0.2)"}`,
            borderRadius: 10,
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: anonymize ? "#2E7D32" : "#E65100",
            fontWeight: 500,
            marginBottom: 10,
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.2s",
          }}
        >
          {anonymize ? t.privacy_on : t.privacy_off}
        </div>

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
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              ref={textareaRef}
              className="mike-textarea"
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
                minHeight: 52,
                maxHeight: 180,
                resize: "none",
                borderRadius: 12,
                border: "1px solid var(--c-input-border, var(--c-card-border))",
                background: "var(--c-input, var(--c-bg))",
                color: "var(--c-text1)",
                padding: "14px 16px",
                fontSize: 15,
                lineHeight: 1.6,
                outline: "none",
                fontFamily: "inherit",
                overflowY: "auto",
                transition: "border-color 0.15s",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isStreaming}
              style={{
                width: 46,
                height: 46,
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
        )}
      </div>

      {/* currentUser available for future auth-gating */}
      {void currentUser}
    </div>
  );
}
