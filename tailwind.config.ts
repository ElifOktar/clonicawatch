import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Refined luxury palette — deep midnight + platinum accents
        bg: {
          DEFAULT: "#0a0e17",        // deep midnight navy
          elev: "#111827",           // elevated cards
          soft: "#1a2236",           // hover / subtle
        },
        // Light sections for breathing room
        cream: {
          DEFAULT: "#f8f6f3",        // warm white
          elev: "#ffffff",
          ink: "#0f1419",            // dark text on cream
          muted: "#5a6577",
          line: "#e2e4e9",
        },
        ink: {
          DEFAULT: "#f0f2f5",        // clean off-white
          muted: "#8b95a5",          // cool muted
          dim: "#5a6577",
        },
        gold: {
          DEFAULT: "#c9a84c",        // refined gold
          bright: "#e0c068",         // highlight
          deep: "#a08030",           // borders
        },
        platinum: {
          DEFAULT: "#c0c8d4",        // platinum accent
          bright: "#dde3eb",
          deep: "#8a96a8",
        },
        line: "#1e293b",
        danger: "#ef4444",
        success: "#22c55e",
        wine: "#7a2a2a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      container: {
        center: true,
        padding: { DEFAULT: "1rem", lg: "2rem" },
        screens: { "2xl": "1400px" },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "shimmer": "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
