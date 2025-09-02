// app/book/[id]/reviews.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  createdAt: string;
  score: number;
  myVote: number; // -1, 0, 1
};

export default function Reviews({ bookId }: { bookId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetch(`/api/reviews?bookId=${encodeURIComponent(bookId)}`, { cache: "no-store" });
    const data = await r.json();
    setReviews(data.reviews ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const r = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, authorName, rating, content }),
    });
    setSubmitting(false);
    if (!r.ok) {
      alert("Error al publicar reseña");
      return;
    }
    setAuthorName("");
    setRating(5);
    setContent("");
    await load();
  }

  async function vote(reviewId: string, dir: "up" | "down") {
    const r = await fetch(`/api/reviews/${reviewId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: dir }),
    });
    if (!r.ok) return;
    const data = await r.json();
    setReviews((prev) =>
      prev.map((rv) => (rv.id === reviewId ? { ...rv, score: data.score, myVote: data.myVote } : rv)),
    );
  }

  const sorted = useMemo(
    () => [...reviews].sort((a, b) => b.score - a.score || +new Date(b.createdAt) - +new Date(a.createdAt)),
    [reviews],
  );

  return (
    <div>
      <h3>Reseñas</h3>
      <form onSubmit={submitReview} style={{ display: "grid", gap: 8, margin: "12px 0", border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Tu nombre"
            required
            style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
            {[5,4,3,2,1].map((n) => (
              <option key={n} value={n}>{n} ★</option>
            ))}
          </select>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu reseña…"
          required
          rows={4}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button
          disabled={submitting}
          type="submit"
          style={{ justifySelf: "start", padding: "10px 16px", borderRadius: 8, border: "1px solid #333", background: "#111", color: "#fff" }}
        >
          {submitting ? "Publicando…" : "Publicar reseña"}
        </button>
      </form>

      {loading ? (
        <p>Cargando…</p>
      ) : sorted.length === 0 ? (
        <p>¡Sé el primero en reseñar este libro!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {sorted.map((r) => (
            <li key={r.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <strong>{r.authorName}</strong>
                <span title={`${r.rating} de 5`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              </div>
              <p style={{ marginTop: 8 }}>{r.content}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => vote(r.id, "up")}
                  aria-pressed={r.myVote === 1}
                  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: r.myVote === 1 ? "#e6ffe6" : "#fff" }}
                >
                  👍
                </button>
                <button
                  onClick={() => vote(r.id, "down")}
                  aria-pressed={r.myVote === -1}
                  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: r.myVote === -1 ? "#ffecec" : "#fff" }}
                >
                  👎
                </button>
                <span style={{ color: "#555" }}>Puntaje: {r.score}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
