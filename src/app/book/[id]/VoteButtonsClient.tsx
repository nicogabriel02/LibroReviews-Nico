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
      let nextMy: -1 | 0 | 1 = target as -1 | 1;
      let delta = target;

      if (myVote === target) {
        // mismo voto -> quitar
        nextMy = 0;
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
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={() => vote("up")}
        disabled={loading || disabled}
        className={`p-2 rounded-lg transition-colors ${
          myVote === 1
            ? "bg-green-100 text-green-600"
            : "text-gray-400 hover:text-green-600 hover:bg-green-50"
        } ${loading || disabled ? "cursor-not-allowed opacity-50" : ""}`}
        title={disabled ? "Inicia sesión para votar" : "Votar positivo"}
        aria-label="Votar positivo"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L10 4.414 4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      
      <span className={`min-w-[2rem] text-center font-medium ${
        score > 0 ? "text-green-600" : score < 0 ? "text-red-600" : "text-gray-500"
      }`}>
        {score}
      </span>
      
      <button
        type="button"
        onClick={() => vote("down")}
        disabled={loading || disabled}
        className={`p-2 rounded-lg transition-colors ${
          myVote === -1
            ? "bg-red-100 text-red-600"
            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
        } ${loading || disabled ? "cursor-not-allowed opacity-50" : ""}`}
        title={disabled ? "Inicia sesión para votar" : "Votar negativo"}
        aria-label="Votar negativo"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 15.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
