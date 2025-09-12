import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import HeaderAuthClient from "./HeaderAuthClient";

export const metadata: Metadata = { title: "Libro Reviews" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser();
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <header style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
          <a href="/">Inicio</a>
          <div style={{ marginLeft: "auto" }}>
            <HeaderAuthClient user={me ? { email: me.email, name: me.name } : null} />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
