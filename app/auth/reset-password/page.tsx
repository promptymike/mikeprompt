"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setDone(true);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Hasło zmienione!</div>
        <a href="/" style={{ color: "#FF6E40" }}>Wróć do MikePrompt →</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(135deg, #FFF8F0, #FFE8D6)" }}>
      <div style={{ background: "white", borderRadius: 20, padding: 40, width: 360, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: "'Fraunces', serif" }}>
          mike<span style={{ color: "#FF6E40" }}>prompt</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Ustaw nowe hasło</div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nowe hasło (min. 8 znaków)"
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0d8d0", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }}
        />
        {error && <div style={{ fontSize: 12, color: "#E53935", marginBottom: 8 }}>{error}</div>}
        <button
          onClick={handleReset}
          disabled={password.length < 8}
          style={{ width: "100%", padding: "11px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #FF6E40, #FF8A65)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          Zmień hasło
        </button>
      </div>
    </div>
  );
}
