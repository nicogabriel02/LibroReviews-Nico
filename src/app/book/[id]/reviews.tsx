// src/app/book/[id]/reviews.tsx
import { getCurrentUser } from "@/lib/auth";
import { listReviewsByBook } from "@/services/reviews";
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
    <section className="space-y-8">
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Reseñas ({reviews.length})
        </h3>

        {/* Si NO está logueado: mensaje + links */}
        {!me && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-2">¡Únete a la conversación!</h4>
            <p className="text-blue-800 mb-4">Para escribir reseñas y votar, necesitas una cuenta.</p>
            <div className="flex gap-3">
              <Link 
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Ingresar
              </Link>
              <Link 
                href="/register"
                className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        )}

        {/* Si está logueado: formulario para crear reseña */}
        {me && (
          <div className="mb-8">
            <ReviewFormClient bookId={bookId} />
          </div>
        )}

        {/* Listado de reseñas */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💭</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Aún no hay reseñas
            </h4>
            <p className="text-gray-600">
              {me ? "¡Sé el primero en escribir una reseña!" : "Sé el primero en compartir tu opinión sobre este libro."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Rating Stars */}
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 text-lg">
                        {Array(5).fill(0).map((_, i) => (
                          <span key={i}>
                            {i < r.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {r.rating}/5
                      </span>
                    </div>
                    
                    {/* Date */}
                    <span className="text-sm text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Vote Buttons */}
                  <VoteButtonsClient
                    reviewId={r.id}
                    initialScore={r.score}
                    initialMyVote={r.myVote}
                    disabled={!me}
                    loginHref="/login"
                  />
                </div>
                
                {/* Review Content */}
                <p className="text-gray-700 leading-relaxed">
                  {r.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
