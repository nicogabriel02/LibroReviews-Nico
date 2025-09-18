"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [name, setName] = useState(""); 
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); 
    setErr("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      
      if (!res.ok) { 
        const errorData = await res.json();
        setErr(errorData.error === "EMAIL_TAKEN" ? "Este email ya está registrado" : "Error al registrar usuario"); 
        return; 
      }
      
      // Usar window.location.href para forzar recarga completa
      window.location.href = "/";
    } catch (error) {
      setErr("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-neutral-800">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📚</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Únete a LibroReseñas</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">Crea tu cuenta y comparte tus reseñas</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre (opcional)
              </label>
              <input 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                placeholder="Tu nombre" 
                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                placeholder="tu@email.com" 
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                placeholder="••••••••" 
                type="password" 
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mínimo 8 caracteres</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>

            {err && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl p-3">
                <p className="text-red-700 dark:text-red-300 text-sm text-center">{err}</p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                Ingresar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
