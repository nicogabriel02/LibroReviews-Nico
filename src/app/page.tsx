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
  const sp = await searchParams; 
  const q = (sp?.q ?? "").toString();

  let items: Awaited<ReturnType<typeof searchBooksService>> = [];
  try {
    items = await searchBooksService(q);
  } catch {
    // ante cualquier error de red, seguimos con lista vacía
    items = [];
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 px-4 pt-8 sm:pt-12 lg:pt-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold  dark:text-white flex items-center justify-center gap-2">
          Descubre tu próxima lectura
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Busca libros, lee reseñas de otros lectores y comparte tus propias experiencias
        </p>
      </div>

      {/* Search Form */}
      <div className="w-full max-w-2xl mx-auto px-4">
        <form action="/" className="flex items-stretch gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por título, autor o ISBN..."
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <button 
            type="submit"
            className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="w-full space-y-6 px-4">
        {!q && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">📚</div>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400">Comienza buscando un libro</p>
          </div>
        )}
        
        {q && items.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400">No se encontraron resultados para "{q}"
            </p>
          </div>
        )}

        {items.length > 0 && (
          <div className="w-full space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Resultados ({items.length})
            </h2>
            <div className="grid gap-4 sm:gap-6">
              {items.map((b) => (
                <div key={b.id} className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {b.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={b.thumbnail} 
                        alt="" 
                        width={96} 
                        height={144} 
                        className="w-20 h-30 sm:w-24 sm:h-36 rounded-lg object-cover flex-shrink-0 shadow-sm mx-auto sm:mx-0"
                      />
                    ) : (
                      <div className="w-20 h-30 sm:w-24 sm:h-36 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-2xl sm:text-3xl mx-auto sm:mx-0">
                        📖
                      </div>
                    )}
                    <div className="flex-1 space-y-2 sm:space-y-3 text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                        {b.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {b.authors.join(", ")}
                      </p>
                      <Link 
                        href={`/book/${b.id}`}
                        className="inline-flex items-center text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm sm:text-base"
                      >
                        Ver detalles y reseñas →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
