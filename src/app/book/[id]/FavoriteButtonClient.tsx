"use client";

import { useEffect, useState } from "react";

type Props = {
  bookId: string;
  loggedIn: boolean;
};

export default function FavoriteButtonClient({ bookId, loggedIn }: Props) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchFav() {
      if (!loggedIn) return;
      try {
        const r = await fetch("/api/favorites", { cache: "no-store" });
        if (!r.ok) return; // si 401 u otro error, ignoramos
        const data = await r.json();
        const has = Array.isArray(data?.favorites)
          ? data.favorites.some((f: any) => f.bookId === bookId)
          : false;
        if (!ignore) setIsFav(!!has);
      } catch {
        // ignorar
      }
    }
    fetchFav();
    return () => { ignore = true; };
  }, [bookId, loggedIn]);

  async function toggle() {
    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }
    if (loading) return;
    setLoading(true);
    const next = !isFav;
    setIsFav(next); // optimista
    try {
      const method = next ? "PUT" : "DELETE";
      const res = await fetch(`/api/favorites/${encodeURIComponent(bookId)}`, { method });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        // revertir
        setIsFav(!next);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 border text-sm font-medium transition-colors
        ${isFav
          ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900 dark:hover:bg-rose-950/40"
          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-neutral-900 dark:text-gray-200 dark:border-neutral-800 dark:hover:bg-neutral-800"}
        ${loading ? "opacity-60 cursor-not-allowed" : ""}
      `}
      title={loggedIn ? (isFav ? "Quitar de favoritos" : "Agregar a favoritos") : "Inicia sesión para guardar"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`w-4 h-4 ${isFav ? "" : "opacity-70"}`}
        aria-hidden
      >
        <path d="M11.645 20.91l-.007-.003-.022-.011a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.232 3 12.766 3 10.25 3 7.322 5.2 5 8 5c1.676 0 3.08.693 4 1.733C12.92 5.693 14.324 5 16 5c2.8 0 5 2.322 5 5.25 0 2.516-1.688 4.981-3.989 7.259a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.011-.007.003a.75.75 0 01-.668 0z" />
      </svg>
      {isFav ? "Guardado" : "Guardar"}
    </button>
  );
}
