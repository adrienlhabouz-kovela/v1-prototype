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
        // Neutres chauds — fonds, surfaces alternatives, séparateurs
        ivory: "#FAF8F4",
        bone: "#F4F1EC",
        sand: "#EAE5DC",
        offwhite: "#E6E9EC",
        charcoal: "#1B1F23",

        // ─── Système éditorial KOVELA (Clinical Trust Premium) ───────────
        // Direction artistique validée — voir docs/strategy/.
        // Coexiste avec l'ancien système (navy/teal/bone) pendant la
        // bascule progressive page par page.
        ink: {
          DEFAULT: "#0F1419",  // text principal éditorial
          60: "#4A4F55",       // text secondaire
          30: "#8C9098",       // text tertiaire, métadonnées
        },
        paper: {
          DEFAULT: "#FAFAF7",  // fond principal éditorial
          shade: "#F1EFE8",    // fond contrasté section
        },
        cream: "#F1EBE0",      // chaleur — bandes réassurance, photos
        rule: "#D8D6D0",       // filets, séparateurs
        accent: "#2A6B5C",     // status valid, lien actif, focus (vert lichen)
        "warm-accent": "#A06B3F", // cuivre patiné — éléments humains/photo
        alert: "#B85F3A",      // status critique (orange brûlé)
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        // ─── Famille éditoriale (Operating Room Discipline) ──────────────
        // Söhne en cible. Inter Display + Inter en fallback open source.
        // Mono : JetBrains Mono / Geist Mono.
        editorial: [
          "var(--font-editorial)",
          "Inter Display",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        "editorial-mono": [
          "var(--font-editorial-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        brand: "0.18em",
      },
      boxShadow: {
        // Ombres très douces — registre premium / B2B santé
        soft: "0 1px 1px rgba(10,31,45,0.03)",
        card: "0 1px 2px rgba(10,31,45,0.025), 0 4px 14px -8px rgba(10,31,45,0.08)",
        lift: "0 8px 28px -14px rgba(10,31,45,0.18)",
        hairline: "inset 0 0 0 1px rgba(10,31,45,0.04)",
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
