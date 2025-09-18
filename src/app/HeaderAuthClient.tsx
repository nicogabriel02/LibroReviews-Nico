"use client";

export default function HeaderAuthClient({ user }: { user: { email: string; name?: string } | null }) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }
  
  if (!user) {
    return (
  <div className="flex items-center gap-2 sm:gap-3">
        <a 
          href="/login" 
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors text-sm sm:text-base"
        >
          Ingresar
        </a>
        <a 
          href="/register" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
        >
          Crear cuenta
        </a>
      </div>
    );
  }
  
  return (
  <div className="flex items-center gap-2 sm:gap-3">
      <a 
        href="/profile" 
        className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors text-sm sm:text-base"
      >
        Mi Perfil
      </a>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full max-w-24 sm:max-w-none truncate">
          {user.name ?? user.email}
        </span>
        <button 
          onClick={logout}
          className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors text-sm sm:text-base"
        >
          Salir
        </button>
      </div>
    </div>
  );
}
