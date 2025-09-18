import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import HeaderAuthClient from "./HeaderAuthClient";
import "./globals.css";

export const metadata: Metadata = { 
  title: "LibroReseñas",
  description: "Descubre y reseña tus libros favoritos",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser();
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-neutral-950 font-sans antialiased" suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white/90 dark:bg-neutral-900/80 backdrop-blur border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-50 shadow-sm">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14 sm:h-16">
                <div className="flex items-center">
                  <a href="/" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                    📚 LibroReseñas
                  </a>
                </div>
                <HeaderAuthClient user={me ? { email: me.email, name: me.name } : null} />
              </div>
            </div>
          </header>
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-gray-900 dark:text-gray-100">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
