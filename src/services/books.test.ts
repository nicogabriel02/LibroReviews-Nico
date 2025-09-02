import { describe, it, expect, vi } from "vitest";
import { searchBooksService } from "@/services/books";

describe("searchBooksService", () => {
  it("devuelve [] si q está vacío", async () => {
    expect(await searchBooksService("   ")).toEqual([]);
  });

  it("mapea items de Google Books", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { id: "x1", volumeInfo: { title: "Biblia", authors: ["Varios"], publishedDate: "2000" } },
        ],
      }),
    } as any);

    const res = await searchBooksService("biblia");
    expect(res[0]).toMatchObject({ id: "x1", title: "Biblia", authors: ["Varios"] });
  });

  it("tolera error de API", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({ ok: false } as any);
    const res = await searchBooksService("biblia");
    expect(res).toEqual([]);
  });
});
