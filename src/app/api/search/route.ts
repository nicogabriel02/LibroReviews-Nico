import { NextRequest, NextResponse } from "next/server";

type GImageLinks = { thumbnail?: string; smallThumbnail?: string };
type GVolumeInfo = {
  title?: string;
  authors?: string[];
  imageLinks?: GImageLinks;
  publishedDate?: string;
};
type GBookItem = { id: string; volumeInfo?: GVolumeInfo };
type SearchItem = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string | null;
  publishedDate: string;
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ items: [] as SearchItem[] });

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20`;
  const resp = await fetch(url, { next: { revalidate: 3600 } });
  const data = (await resp.json()) as { items?: GBookItem[] };

  const items: SearchItem[] = (data.items ?? []).map((it) => {
    const v = it.volumeInfo ?? {};
    return {
      id: it.id,
      title: v.title ?? "Sin título",
      authors: v.authors ?? [],
      thumbnail: v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail ?? null,
      publishedDate: v.publishedDate ?? "",
    };
  });

  return NextResponse.json({ items });
}
