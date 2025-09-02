// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reseñas de Libros",
  description: "Busca libros, reseñas y votaciones comunitarias",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
          <h1 style={{ fontSize: 28, margin: "12px 0" }}>📚 Reseñas de Libros</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
