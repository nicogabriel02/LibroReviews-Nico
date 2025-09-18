"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserProfile = {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  stats: {
    totalReviews: number;
    totalFavorites: number;
    avgRating: number;
  };
  recentReviews: Array<{
    id: string;
    bookId: string;
    rating: number;
    content: string;
    createdAt: string;
  }>;
  favorites: Array<{
    id: string;
    bookId: string;
    createdAt: string;
  }>;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data.profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>No se pudo cargar el perfil.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Mi Perfil</h1>
      
      {/* User Info */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8 text-gray-800">
        <h2 className="text-xl font-semibold mb-3">Información Personal</h2>
        <p className="mb-2"><strong>Email:</strong> {profile.user.email}</p>
        {profile.user.name && <p><strong>Nombre:</strong> {profile.user.name}</p>}
      </div>

      {/* Statistics */}
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Estadísticas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
          <div>
        <p><strong>Total de reseñas:</strong> {profile.stats.totalReviews}</p>
          </div>
          <div>
        <p><strong>Libros favoritos:</strong> {profile.stats.totalFavorites}</p>
          </div>
          <div>
        <p><strong>Calificación promedio:</strong> {profile.stats.avgRating.toFixed(1)} ⭐</p>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div style={{ marginBottom: "2rem" }}>
        <h2>Reseñas Recientes</h2>
        {profile.recentReviews.length === 0 ? (
          <p style={{ color: "#666" }}>No has escrito reseñas aún.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {profile.recentReviews.map((review) => (
              <div 
                key={review.id} 
                style={{ 
                  border: "1px solid #ddd", 
                  padding: "1rem", 
                  borderRadius: "8px" 
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: "bold" }}>
                    Libro: {review.bookId}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>{"⭐".repeat(review.rating)}</span>
                    <span style={{ fontSize: "0.8rem", color: "#666" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p style={{ color: "#333", lineHeight: "1.4" }}>
                  {review.content.length > 150 
                    ? `${review.content.substring(0, 150)}...` 
                    : review.content
                  }
                </p>
                <a 
                  href={`/book/${review.bookId}`}
                  style={{ color: "#0066cc", textDecoration: "none", fontSize: "0.9rem" }}
                >
                  Ver libro →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorites */}
      <div>
        <h2>Libros Favoritos</h2>
        {profile.favorites.length === 0 ? (
          <p style={{ color: "#666" }}>No tienes libros favoritos aún.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {profile.favorites.map((favorite) => (
              <div 
                key={favorite.id}
                style={{ 
                  border: "1px solid #ddd", 
                  padding: "1rem", 
                  borderRadius: "8px",
                  textAlign: "center"
                }}
              >
                <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  {favorite.bookId}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "1rem" }}>
                  Agregado: {new Date(favorite.createdAt).toLocaleDateString()}
                </p>
                <a 
                  href={`/book/${favorite.bookId}`}
                  style={{ 
                    color: "#0066cc", 
                    textDecoration: "none",
                    fontSize: "0.9rem"
                  }}
                >
                  Ver libro →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}