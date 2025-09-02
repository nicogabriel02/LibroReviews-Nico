import { describe, it, expect } from "vitest";
import { CreateReview } from "@/lib/validation";

describe("CreateReview schema", () => {
  it("acepta datos válidos", () => {
    const parsed = CreateReview.parse({
      bookId: "abc",
      authorName: "Fede",
      rating: 5,
      content: "Excelente libro",
    });
    expect(parsed.bookId).toBe("abc");
  });

  it("rechaza rating fuera de rango", () => {
    const res = CreateReview.safeParse({
      bookId: "abc",
      authorName: "X",
      rating: 6,
      content: "ok",
    });
    expect(res.success).toBe(false);
  });

  it("rechaza authorName vacío", () => {
    const res = CreateReview.safeParse({
      bookId: "abc",
      authorName: "",
      rating: 3,
      content: "ok",
    });
    expect(res.success).toBe(false);
  });
});
