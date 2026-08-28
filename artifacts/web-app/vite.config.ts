import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cartographer from "@replit/vite-plugin-cartographer";
import devBanner from "@replit/vite-plugin-dev-banner";
import runtimeError from "@replit/vite-plugin-runtime-error-modal";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    cartographer(),
    devBanner(),
    runtimeError(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
});
