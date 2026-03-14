"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setStatus("success");
        setMessage(session.user.email ?? "");
        setTimeout(() => { window.location.href = "/"; }, 2000);
      } else if (event === "PASSWORD_RECOVERY") {
        window.location.href = "/auth/reset-password";
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus("success");
        setMessage(session.user.email ?? "");
        setTimeout(() => { window.location.href = "/"; }, 2000);
      } else {
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: s } }) => {
            if (!s) setStatus("error");
          });
        }, 1500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #FFF8F0, #FFE8D6)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Fraunces:wght@700&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Fraunces', serif", marginBottom: 24 }}>
          mike<span style={{ color: "#FF6E40" }}>prompt</span>
        </div>
        {status === "loading" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 16, color: "#6B6560" }}>Weryfikacja emaila...</div>
          </>
        )}
        {status === "success" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Email potwierdzony!</div>
            <div style={{ fontSize: 14, color: "#6B6560", marginBottom: 4 }}>Zalogowano jako: <strong>{message}</strong></div>
            <div style={{ fontSize: 13, color: "#A09890" }}>Przekierowanie za chwilę...</div>
          </>
        )}
        {status === "error" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Link wygasł lub jest nieprawidłowy</div>
            <a href="/" style={{ color: "#FF6E40", textDecoration: "none", fontWeight: 600 }}>Wróć do MikePrompt →</a>
          </>
        )}
      </div>
    </div>
  );
}
