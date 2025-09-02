import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Reviews from "./reviews";

beforeEach(() => {
  vi.restoreAllMocks();
});

function mockFetchSequence(sequence: Array<any>) {
  const fn = vi.fn();
  sequence.forEach((value) => {
    fn.mockResolvedValueOnce({
      ok: true,
      json: async () => value,
    } as any);
  });
  vi.spyOn(global, "fetch").mockImplementation(fn as any);
  return fn;
}

describe("Reviews component", () => {
  it("muestra lista y permite votar 👍", async () => {
    // 1) GET reseñas
    const initial = {
      reviews: [
        { id: "r1", authorName: "Ana", rating: 5, content: "Genial", createdAt: new Date().toISOString(), score: 0, myVote: 0 },
      ],
    };
    // 2) POST vote
    const afterVote = { ok: true, score: 1, myVote: 1 };
    mockFetchSequence([initial, afterVote]);

    render(<Reviews bookId="book-123" />);

    // espera que cargue
    expect(await screen.findByText("Genial")).toBeInTheDocument();
    expect(screen.getByText(/Puntaje: 0/)).toBeInTheDocument();

    // click 👍
    fireEvent.click(screen.getByRole("button", { name: "👍" }));

    await waitFor(() => {
      expect(screen.getByText(/Puntaje: 1/)).toBeInTheDocument();
    });
  });

  it("publica una reseña nueva", async () => {
    // GET -> vacío, POST -> ok, GET -> con 1
    const afterCreate = { ok: true, id: "r2" };
    const finalList = {
      reviews: [
        { id: "r2", authorName: "Fede", rating: 5, content: "Top", createdAt: new Date().toISOString(), score: 0, myVote: 0 },
      ],
    };
    mockFetchSequence([{ reviews: [] }, afterCreate, finalList]);

    render(<Reviews bookId="book-xyz" />);

    // completa el formulario
    fireEvent.change(screen.getByPlaceholderText("Tu nombre"), { target: { value: "Fede" } });
    fireEvent.change(screen.getByPlaceholderText("Escribe tu reseña…"), { target: { value: "Top" } });
    fireEvent.submit(screen.getByRole("button", { name: /Publicar/ }).closest("form")!);

    // aparece en la lista
    expect(await screen.findByText("Top")).toBeInTheDocument();
  });
});
