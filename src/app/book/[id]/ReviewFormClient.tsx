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
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Escribir una reseña</h4>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-gray-700"
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-600">
              {rating}/5 estrellas
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu reseña
          </label>
          <textarea
            placeholder="Comparte tu opinión sobre este libro..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Mínimo 3 caracteres
          </p>
          <button 
            type="submit" 
            disabled={loading || content.trim().length < 3}
            className="px-6 py-2 bg-blue-600 text-gray 700 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Publicando..." : "Publicar reseña"}
          </button>
        </div>

        {err && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{err}</p>
          </div>
        )}
      </form>
    </div>
  );
}
