"use client";

import { useState } from "react";
import { anonymizeText, deanonymize, type AnonymizationMap } from "@/lib/anonymize";

type Lang = "en" | "pl";

interface Props {
  lang: Lang;
}

export default function AnonymizeTool({ lang }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [anonMap, setAnonMap] = useState<AnonymizationMap>({});
  const [showMap, setShowMap] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnonymize = () => {
    if (!input.trim()) return;
    const { anonymized, map } = anonymizeText(input);
    setOutput(anonymized);
    setAnonMap(map);
    setShowMap(Object.keys(map).length > 0);
  };

  const handleDeanonymize = () => {
    if (!input.trim() || Object.keys(anonMap).length === 0) return;
    const restored = deanonymize(input, anonMap);
    setOutput(restored);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const maskedCount = Object.keys(anonMap).length;

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(24px, 5vw, 36px)",
          fontWeight: 700, letterSpacing: "-0.5px",
          color: "var(--c-text1)", marginBottom: 10,
        }}>
          {lang === "pl" ? "🔒 Anonimizuj dane" : "🔒 Anonymize data"}
        </h2>
        <p style={{ fontSize: 15, color: "var(--c-text2)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
          {lang === "pl"
            ? "Wklej tekst — Mike zamaskuje emaile, telefony, NIP, PESEL, kwoty i nazwy firm przed wysłaniem do AI."
            : "Paste your text — Mike will mask emails, phones, tax IDs, amounts and company names before sending to AI."}
        </p>
      </div>

      {/* Info chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
        {[
          { icon: "📧", label: lang === "pl" ? "Emaile" : "Emails" },
          { icon: "📞", label: lang === "pl" ? "Telefony" : "Phones" },
          { icon: "🏢", label: lang === "pl" ? "Nazwy firm" : "Company names" },
          { icon: "💰", label: lang === "pl" ? "Kwoty" : "Amounts" },
          { icon: "🪪", label: "NIP / PESEL" },
          { icon: "🏦", label: "IBAN" },
          { icon: "📅", label: lang === "pl" ? "Daty" : "Dates" },
        ].map(chip => (
          <span key={chip.label} style={{
            fontSize: 12, padding: "4px 12px", borderRadius: 100,
            background: "rgba(255,110,64,0.08)", color: "#FF6E40",
            border: "1px solid rgba(255,110,64,0.2)", fontWeight: 500,
          }}>
            {chip.icon} {chip.label}
          </span>
        ))}
      </div>

      {/* Input card */}
      <div style={{
        background: "var(--c-card)", borderRadius: 20,
        border: "1px solid var(--c-card-border)",
        boxShadow: "var(--c-card-shadow)",
        overflow: "hidden", marginBottom: 16,
      }}>
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--c-text4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
            {lang === "pl" ? "Oryginalny tekst" : "Original text"}
          </div>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setOutput(""); setAnonMap({}); setShowMap(false); }}
            placeholder={lang === "pl"
              ? "Wklej email, raport, kontrakt lub inny tekst z danymi osobowymi..."
              : "Paste an email, report, contract or any text with personal data..."}
            rows={6}
            style={{
              width: "100%", border: "none", outline: "none", resize: "vertical",
              fontSize: 14, lineHeight: 1.7, color: "var(--c-text1)",
              fontFamily: "'DM Sans', sans-serif", background: "transparent",
              minHeight: 120,
            }}
          />
        </div>

        {/* Action bar */}
        <div style={{
          padding: "14px 24px",
          borderTop: "1px solid var(--c-sep)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ fontSize: 13, color: "var(--c-text4)" }}>
            {input.length > 0 ? `${input.length} ${lang === "pl" ? "znaków" : "chars"}` : ""}
          </div>
          <button
            onClick={handleAnonymize}
            disabled={!input.trim()}
            style={{
              padding: "11px 26px", borderRadius: 12, border: "none",
              background: input.trim() ? "linear-gradient(135deg, #FF6E40, #FF8A65)" : "var(--c-count-bg)",
              color: input.trim() ? "white" : "var(--c-text4)",
              fontSize: 14, fontWeight: 600, cursor: input.trim() ? "pointer" : "default",
              boxShadow: input.trim() ? "0 4px 16px rgba(255,110,64,0.3)" : "none",
            }}
          >
            🔒 {lang === "pl" ? "Anonimizuj" : "Anonymize"}
          </button>
        </div>
      </div>

      {/* Output */}
      {output && (
        <div style={{
          background: "var(--c-card)", borderRadius: 20,
          border: "1px solid var(--c-result-border)",
          boxShadow: "var(--c-card-shadow)",
          overflow: "hidden", animation: "fadeUp 0.4s ease",
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 24px",
            background: "var(--c-green-bg)",
            borderBottom: "1px solid var(--c-sep)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#43A047" }}>
                🔒 {lang === "pl" ? "Zanonimizowany tekst" : "Anonymized text"}
              </span>
              {maskedCount > 0 && (
                <span style={{
                  fontSize: 11, padding: "2px 10px", borderRadius: 100,
                  background: "rgba(67,160,71,0.1)", color: "#43A047",
                  fontWeight: 600, border: "1px solid rgba(67,160,71,0.2)",
                }}>
                  {maskedCount} {lang === "pl" ? "elementów zamaskowanych" : "items masked"}
                </span>
              )}
            </div>
            <button
              onClick={handleCopy}
              style={{
                padding: "6px 14px", borderRadius: 8,
                border: "1px solid var(--c-card-border)",
                background: copied ? "rgba(67,160,71,0.06)" : "var(--c-card)",
                fontSize: 12, color: copied ? "#43A047" : "var(--c-text2)",
                cursor: "pointer", fontWeight: 500,
              }}
            >
              {copied ? "✓ Skopiowano!" : "📋 Kopiuj"}
            </button>
          </div>

          {/* Output text */}
          <div style={{ padding: "20px 24px" }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, lineHeight: 1.8,
              color: "var(--c-text1)", whiteSpace: "pre-wrap",
            }}>
              {output}
            </div>
          </div>

          {/* What was masked */}
          {Object.keys(anonMap).length > 0 && (
            <div style={{ padding: "14px 24px 16px", borderTop: "1px solid var(--c-sep)" }}>
              <button
                onClick={() => setShowMap(v => !v)}
                style={{
                  fontSize: 12, color: "var(--c-text3)", background: "none",
                  border: "none", cursor: "pointer", marginBottom: showMap ? 10 : 0,
                  textDecoration: "underline",
                }}
              >
                {showMap
                  ? (lang === "pl" ? "▲ Ukryj co zamaskowano" : "▲ Hide masked items")
                  : (lang === "pl" ? "▼ Pokaż co zamaskowano" : "▼ Show masked items")}
              </button>
              {showMap && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {Object.entries(anonMap).map(([key, value]) => (
                    <div key={key} style={{
                      display: "flex", gap: 12, alignItems: "center",
                      padding: "6px 12px", borderRadius: 8,
                      background: "var(--c-fix-bg)", border: "1px solid var(--c-fix-border)",
                      fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                      flexWrap: "wrap",
                    }}>
                      <span style={{ color: "#FF6E40", fontWeight: 600, flexShrink: 0 }}>{key}</span>
                      <span style={{ color: "var(--c-text4)" }}>←</span>
                      <span style={{ color: "var(--c-text2)", wordBreak: "break-all" }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <div style={{
            padding: "14px 24px",
            borderTop: "1px solid var(--c-sep)",
            background: "var(--c-hover)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 10,
          }}>
            <span style={{ fontSize: 13, color: "var(--c-text3)" }}>
              {lang === "pl"
                ? "Teraz możesz bezpiecznie wkleić ten tekst do dowolnego AI 👆"
                : "Now you can safely paste this text into any AI 👆"}
            </span>
            {Object.keys(anonMap).length > 0 && (
              <button
                onClick={handleDeanonymize}
                style={{
                  padding: "7px 14px", borderRadius: 8,
                  border: "1px solid var(--c-card-border)",
                  background: "var(--c-card)", fontSize: 12,
                  color: "var(--c-text2)", cursor: "pointer", fontWeight: 500,
                }}
              >
                🔓 {lang === "pl" ? "Przywróć oryginał" : "Restore original"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!output && (
        <div style={{
          textAlign: "center", padding: "32px 20px",
          color: "var(--c-text4)", fontSize: 13,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
          {lang === "pl"
            ? "Twoje dane zostaną zamaskowane lokalnie — nic nie opuszcza Twojej przeglądarki"
            : "Your data is masked locally — nothing leaves your browser"}
        </div>
      )}
    </div>
  );
}
