export type BookItem = { id: string; title: string; authors: string[]; thumbnail?: string; publishedDate?: string };

export async function searchBooksService(q: string): Promise<BookItem[]> {
  if (!q.trim()) return [];
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20`;
  const resp = await fetch(url);
  if (!resp.ok) return [];
  const data = await resp.json();
  return (data.items ?? []).map((it: any) => {
    const v = it.volumeInfo ?? {};
    return {
      id: it.id,
      title: v.title ?? "Sin título",
      authors: v.authors ?? [],
      thumbnail: v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail ?? undefined,
      publishedDate: v.publishedDate ?? "",
    };
  });
}
