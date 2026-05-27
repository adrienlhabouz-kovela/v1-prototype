import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charte KOVELA
        navy: {
          DEFAULT: "#0A1F2D", // Deep Navy
          50: "#EAF0F2",
          100: "#C8D5DC",
          200: "#9CB1BC",
          600: "#21495E",
          700: "#16384A",
          800: "#0E2835",
          900: "#0A1F2D",
          950: "#06121B",
        },
        teal: {
          DEFAULT: "#1FA7A0", // Surgical Teal
          50: "#ECF7F5",
          100: "#BFE3DE", // Soft Teal
          200: "#9FD6CF",
          400: "#38B8B1",
          500: "#1FA7A0",
          600: "#178F89",
          700: "#137C76",
        },
        offwhite: "#E6E9EC",
        charcoal: "#1B1F23",
        ink: "#0A1F2D",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      letterSpacing: {
        brand: "0.18em",
      },
      boxShadow: {
        // Ombres très douces
        soft: "0 1px 2px rgba(10,31,45,0.04)",
        card: "0 1px 2px rgba(10,31,45,0.03), 0 6px 24px -12px rgba(10,31,45,0.10)",
        lift: "0 12px 40px -16px rgba(10,31,45,0.22)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "navy-depth":
          "radial-gradient(120% 120% at 85% -10%, #16384A 0%, #0A1F2D 45%, #06121B 100%)",
        "teal-sheen":
          "linear-gradient(135deg, rgba(31,167,160,0.16) 0%, rgba(31,167,160,0) 55%)",
      },
    },
  },
  plugins: [],
};

export default config;
