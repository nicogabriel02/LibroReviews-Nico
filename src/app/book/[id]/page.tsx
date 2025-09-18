// src/app/book/[id]/page.tsx
import Reviews from "./reviews";
import FavoriteButtonClient from "./FavoriteButtonClient";
import { getCurrentUser } from "@/lib/auth";
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
  params: Promise<{ id: string }>; 
}) {
  const { id } = await params;     
  const book = await getBook(id);
  const me = await getCurrentUser();
  if (!book) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Libro no encontrado</h1>
        <p className="text-gray-600 mb-6">El libro que buscas no existe o no está disponible.</p>
        <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
        ← Volver a la búsqueda
      </Link>

      {/* Book Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid md:grid-cols-[300px_1fr] gap-8 p-8">
          {/* Book Cover */}
          <div className="flex justify-center md:justify-start">
            {book.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={book.image} 
                alt={book.title} 
                className="w-60 h-80 object-cover rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-60 h-80 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-4xl">
                📖
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {book.title}
                  </h1>
                  <p className="text-xl text-gray-600">
                    {book.authors.join(", ") || "Autor desconocido"}
                  </p>
                </div>
                <FavoriteButtonClient bookId={book.id} loggedIn={!!me} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {book.publishedDate && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="font-medium text-gray-700">Publicado:</span>
                  <p className="text-gray-600">{book.publishedDate}</p>
                </div>
              )}
              {book.publisher && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="font-medium text-gray-700">Editorial:</span>
                  <p className="text-gray-600">{book.publisher}</p>
                </div>
              )}
              {book.pageCount && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="font-medium text-gray-700">Páginas:</span>
                  <p className="text-gray-600">{book.pageCount}</p>
                </div>
              )}
              {book.categories?.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="font-medium text-gray-700">Categorías:</span>
                  <p className="text-gray-600">{book.categories.slice(0, 2).join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="border-t border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h3>
            <div 
              className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: book.description }}
            />
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <Reviews bookId={book.id} />
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
  return { title: book?.title ? `${book.title} | LibroReseñas` : "Libro | LibroReseñas" };
}
