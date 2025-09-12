"use client";

export default function HeaderAuthClient({ user }: { user: { email: string; name?: string } | null }) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }
  if (!user) {
    return (
      <div style={{ display: "flex", gap: 12 }}>
        <a href="/login">Ingresar</a>
        <a href="/register">Crear cuenta</a>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <span style={{ color: "#666" }}>{user.name ?? user.email}</span>
      <button onClick={logout}>Salir</button>
    </div>
  );
}
