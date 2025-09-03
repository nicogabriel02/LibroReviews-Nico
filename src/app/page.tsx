// src/app/page.tsx
import Link from "next/link";
import { searchBooksService } from "@/services/books";

export const runtime = "nodejs"; // o dejalo sin esto, es opcional

export default async function Home({
  searchParams,
}: {
  // 👇 Next 15: es Promise
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams; // 👈 clave
  const q = (sp?.q ?? "").toString();

  let items: Awaited<ReturnType<typeof searchBooksService>> = [];
  try {
    items = await searchBooksService(q);
  } catch {
    // ante cualquier error de red, seguimos con lista vacía
    items = [];
  }

  return (
    <main style={{ maxWidth: 880, margin: "40px auto", padding: "0 16px" }}>
      <h1>Reseñas de Libros</h1>

      <form action="/" style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por título, autor o ISBN"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Buscar</button>
      </form>

      <ul style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {items.map((b) => (
          <li key={b.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", gap: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {b.thumbnail ? <img src={b.thumbnail} alt="" width={90} height={120} /> : null}
              <div>
                <h3 style={{ margin: 0 }}>{b.title}</h3>
                <p style={{ margin: "4px 0", color: "#555" }}>{b.authors.join(", ")}</p>
                <Link href={`/book/${b.id}`}>Ver detalles</Link>
              </div>
            </div>
          </li>
        ))}
        {!q && <p>Empezá buscando un libro 🙂</p>}
        {q && items.length === 0 && <p>No se encontraron resultados.</p>}
      </ul>
    </main>
  );
}
