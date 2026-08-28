import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { devBanner } from "@replit/vite-plugin-dev-banner";
import runtimeError from "@replit/vite-plugin-runtime-error-modal";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    react(),
    ...(command === "serve" ? [devBanner(), runtimeError()] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
}));
