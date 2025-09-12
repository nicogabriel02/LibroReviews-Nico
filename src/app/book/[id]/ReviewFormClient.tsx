"use client";

import { useState } from "react";

export default function ReviewFormClient({ bookId }: { bookId: string }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, rating, content }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          // no logueado
          window.location.href = "/login";
          return;
        }
        const data = await res.json().catch(() => ({} as any));
        throw new Error(data?.error || "No se pudo crear la reseña");
      }
      // refrescamos la página para ver la nueva reseña
      window.location.reload();
    } catch (e: any) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, marginBottom: 12 }}>
      <label>
        Calificación:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ marginLeft: 8 }}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
      <textarea
        placeholder="Escribí tu reseña…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        style={{ padding: 8 }}
      />
      <button type="submit" disabled={loading || !content.trim()}>
        {loading ? "Enviando..." : "Publicar reseña"}
      </button>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
    </form>
  );
}
