"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { setErr("Credenciales inválidas"); return; }
    location.href = "/"; // redirect simple
  }

  return (
    <main style={{ maxWidth:400, margin:"40px auto" }}>
      <h2>Ingresar</h2>
      <form onSubmit={onSubmit} style={{ display:"grid", gap:8 }}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <button type="submit">Entrar</button>
        {err && <p style={{ color:"crimson" }}>{err}</p>}
      </form>
    </main>
  );
}
