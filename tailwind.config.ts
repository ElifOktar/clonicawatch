import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm luxury palette — not harsh black, more "deep espresso"
        bg: {
          DEFAULT: "#14100c",        // warm near-black
          elev: "#1f1914",           // elevated cards (warmer)
          soft: "#2a2219",           // hover / subtle
        },
        // Light / "ivory" sections for breathing room
        cream: {
          DEFAULT: "#f5efe3",
          elev: "#ffffff",
          ink: "#1a1510",            // dark text on cream
          muted: "#6b5f4e",
          line: "#e5dcc9",
        },
        ink: {
          DEFAULT: "#faf5ea",        // warmer off-white
          muted: "#b8a990",          // warm muted
          dim: "#7a6f5e",
        },
        gold: {
          DEFAULT: "#d4b86e",        // warmer gold
          bright: "#f0d78c",         // highlight
          deep: "#9b7f3a",           // borders
        },
        line: "#2e261c",
        danger: "#e25858",
        success: "#7fb76b",
        wine: "#7a2a2a",             // optional secondary accent
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
