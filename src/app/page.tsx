// src/app/page.tsx
import Link from "next/link";

async function searchBooks(q: string) {
  const url = q ? `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/search?q=${encodeURIComponent(q)}` : "";
  if (!q) return [];
  const resp = await fetch(url, { cache: "no-store" });
  const data = await resp.json();
  return (data.items ?? []) as Array<{ id: string; title: string; authors: string[]; thumbnail?: string; publishedDate?: string }>;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;   
  const items = await searchBooks(q);

  return (
    <div>
      <form action="/" method="GET" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por título, autor o ISBN…"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button type="submit" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #333", background: "#111", color: "#fff" }}>
          Buscar
        </button>
      </form>


      <ul style={{ listStyle: "none", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {items.map((b) => (
          <li key={b.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            {b.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.thumbnail} alt={b.title} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 8 }} />
            )}
            <h3 style={{ margin: "8px 0" }}>{b.title}</h3>
            <p style={{ color: "#555", margin: "4px 0" }}>{b.authors?.join(", ") || "Autor desconocido"}</p>
            <p style={{ color: "#777", margin: "4px 0" }}>{b.publishedDate || ""}</p>
            <Link href={`/book/${b.id}`} style={{ display: "inline-block", marginTop: 8, textDecoration: "none" }}>
              Ver detalles →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
