// src/app/error.tsx
"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ maxWidth: 680, margin: "40px auto", padding: 16 }}>
      <h2>Uy, algo salió mal</h2>
      <p>Probá de nuevo. Si persiste, recargá la página.</p>
      <pre style={{ whiteSpace: "pre-wrap", background: "#111", color: "#eee", padding: 12, borderRadius: 8 }}>
        {error.message}
      </pre>
      <button onClick={() => reset()} style={{ marginTop: 12 }}>Reintentar</button>
    </main>
  );
}
