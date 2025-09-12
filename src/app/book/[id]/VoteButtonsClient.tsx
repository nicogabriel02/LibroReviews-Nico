"use client";

import { useState } from "react";

type Props = {
  reviewId: string;
  initialScore: number;
  initialMyVote: -1 | 0 | 1;
  disabled?: boolean;
  loginHref?: string;
};

export default function VoteButtonsClient({
  reviewId,
  initialScore,
  initialMyVote,
  disabled,
  loginHref = "/login",
}: Props) {
  const [score, setScore] = useState(initialScore);
  const [myVote, setMyVote] = useState(initialMyVote);
  const [loading, setLoading] = useState(false);

  async function vote(dir: "up" | "down") {
    if (disabled) {
      // redirigimos a login si viene deshabilitado (no autenticado)
      window.location.href = loginHref;
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      // optimista simple:
      const target = dir === "up" ? 1 : -1;
      let nextMy = target as -1 | 1;
      let delta = target;

      if (myVote === target) {
        // mismo voto -> quitar
        nextMy = 0 as 0;
        delta = -target;
      } else if (myVote === -target) {
        // cambio de voto -> +/- 2
        delta = target * 2;
      }

      setScore((s) => s + delta);
      setMyVote(nextMy);

      const res = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: dir }),
      });

      if (res.status === 401) {
        window.location.href = loginHref;
        return;
      }

      if (!res.ok) {
        // revertir si falla
        setScore((s) => s - delta);
        setMyVote(myVote);
      } else {
        // opcional: sincronizar con server
        const data = await res.json();
        if (typeof data?.score === "number") setScore(data.score);
        if (typeof data?.myVote === "number") setMyVote(data.myVote);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        type="button"
        onClick={() => vote("up")}
        disabled={loading}
        style={{ color: myVote === 1 ? "green" : undefined }}
        aria-label="Votar positivo"
      >
        ▲
      </button>
      <strong>{score}</strong>
      <button
        type="button"
        onClick={() => vote("down")}
        disabled={loading}
        style={{ color: myVote === -1 ? "crimson" : undefined }}
        aria-label="Votar negativo"
      >
        ▼
      </button>
    </div>
  );
}
