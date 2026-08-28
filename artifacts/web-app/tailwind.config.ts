import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdfaf5",
          100: "#faf3e6",
          200: "#f5e6cc",
          300: "#efd0ad",
          400: "#e8b369",
          500: "#d4a574",
          600: "#b8945f",
          700: "#8a6f45",
          800: "#6b5836",
          900: "#4a3d27",
          950: "#2a2118",
        },
        luxury: {
          black: "#0a0a0a",
          dark: "#1a1a1a",
          card: "#1f1f1f",
          border: "#2a2a2a",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #d4a574 0%, #b8945f 50%, #8a6f45 100%)",
        "gold-gradient-inverse": "linear-gradient(135deg, #8a6f45 0%, #b8945f 50%, #d4a574 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
