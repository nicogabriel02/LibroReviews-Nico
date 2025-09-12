// src/app/book/[id]/reviews.tsx
import { getCurrentUser } from "@/lib/auth";
import { listReviewsByBook } from "@/services/reviews.mongo";
import ReviewFormClient from "./ReviewFormClient";
import VoteButtonsClient from "./VoteButtonsClient";
import Link from "next/link";

type ReviewVM = {
  id: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: Date | string;
  score: number;
  myVote: -1 | 0 | 1;
};

export default async function Reviews({ bookId }: { bookId: string }) {
  const me = await getCurrentUser(); // null si no está logueado
  const reviews = (await listReviewsByBook(bookId, me?.id)) as ReviewVM[];

  return (
    <section style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 12 }}>Reseñas</h3>

      {/* Si NO está logueado: mensaje + links */}
      {!me && (
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, marginBottom: 12 }}>
          <p>Para escribir reseñas y votar, iniciá sesión.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/login">Ingresar</Link>
            <Link href="/register">Crear cuenta</Link>
          </div>
        </div>
      )}

      {/* Si está logueado: formulario para crear reseña */}
      {me && <ReviewFormClient bookId={bookId} />}

      {/* Listado */}
      <ul style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {reviews.map((r) => (
          <li key={r.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <strong>{Array(r.rating).fill("★").join("")}</strong>
                <span style={{ color: "#888", marginLeft: 8 }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              {/* Botones de voto:
                  - Si NO hay usuario, se mandan deshabilitados y con link a /login.
                  - Si hay usuario, funcionales. */}
              <VoteButtonsClient
                reviewId={r.id}
                initialScore={r.score}
                initialMyVote={r.myVote}
                disabled={!me}
                loginHref="/login"
              />
            </div>
            <p style={{ marginTop: 8 }}>{r.content}</p>
          </li>
        ))}
        {reviews.length === 0 && <p>No hay reseñas todavía.</p>}
      </ul>
    </section>
  );
}
