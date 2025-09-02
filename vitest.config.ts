// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",           // por defecto jsdom (para componentes)
    globals: true,
    setupFiles: ["./vitest.setup.tsx"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    css: false,
  },
});
