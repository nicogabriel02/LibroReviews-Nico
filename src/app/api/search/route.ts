// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ items: [] });

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20`;
  const resp = await fetch(url, { next: { revalidate: 3600 } }); // cache 1h
  const data = await resp.json();

  const items =
    data.items?.map((it: any) => {
      const v = it.volumeInfo ?? {};
      return {
        id: it.id,
        title: v.title ?? "Sin título",
        authors: v.authors ?? [],
        thumbnail: v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail ?? null,
        publishedDate: v.publishedDate ?? "",
      };
    }) ?? [];

  return NextResponse.json({ items });
}
// ahi esta creo xd