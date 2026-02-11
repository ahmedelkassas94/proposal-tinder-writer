import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Base palette inspired by the reference UI
        background: "#f5f7fb",
        foreground: "#0f172a",
        accent: "#1b7985",        // deep teal
        accentSoft: "#e1f1f4",    // soft teal background
        accentAlt: "#f4b661",     // warm gold
        surface: "#ffffff",
        surfaceMuted: "#f1f5f9",
        borderSoft: "#e2e8f0"
      }
    }
  },
  plugins: []
};

export default config;

