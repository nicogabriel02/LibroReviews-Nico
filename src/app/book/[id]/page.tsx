// src/app/book/[id]/page.tsx
import Reviews from "./reviews";
import Link from "next/link";

async function getBook(id: string) {
  const url = `https://www.googleapis.com/books/v1/volumes/${id}`;
  const resp = await fetch(url, { next: { revalidate: 3600 } });
  if (!resp.ok) return null;
  const data = await resp.json();
  const v = data.volumeInfo ?? {};
  return {
    id: data.id as string,
    title: v.title ?? "Sin título",
    authors: v.authors ?? [],
    description: v.description ?? "",
    image: v.imageLinks?.thumbnail ?? v.imageLinks?.small ?? null,
    pageCount: v.pageCount ?? null,
    categories: v.categories ?? [],
    publishedDate: v.publishedDate ?? "",
    publisher: v.publisher ?? "",
    language: v.language ?? "",
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>; // 👈 params es Promise en Next 15
}) {
  const { id } = await params;     // 👈 await
  const book = await getBook(id);
  if (!book) return <p>No encontrado</p>;

  return (
    <div>
      <Link href="/">← Volver</Link>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, marginTop: 12 }}>
        {book.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.image} alt={book.title} style={{ width: 220, height: 320, objectFit: "cover", borderRadius: 8 }} />
        ) : (
          <div style={{ width:220, height:320, border:"1px solid #eee", borderRadius:8, display:"grid", placeItems:"center" }}>Sin portada</div>
        )}
        <div>
          <h2 style={{ margin: "8px 0" }}>{book.title}</h2>
          <p style={{ color: "#555" }}>{book.authors.join(", ") || "Autor desconocido"}</p>
          <p style={{ marginTop: 8 }}>
            <strong>Publicado:</strong> {book.publishedDate} {book.publisher ? `· ${book.publisher}` : ""}
          </p>
          {book.pageCount ? <p><strong>Páginas:</strong> {book.pageCount}</p> : null}
          {book.categories?.length ? <p><strong>Categorías:</strong> {book.categories.join(", ")}</p> : null}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Descripción</h3>
        <div dangerouslySetInnerHTML={{ __html: book.description || "Sin descripción disponible." }} />
      </div>

      <div style={{ marginTop: 24 }}>
        <Reviews bookId={book.id} />
      </div>
    </div>
  );
}

// (Opcional) si usás metadata dinámica, también hay que await params:
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);
  return { title: book?.title ? `${book.title} | Libro Reviews` : "Libro | Libro Reviews" };
}
