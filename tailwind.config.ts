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
        // Charte KOVELA — Anthracite warm (registre Apple/Linear premium).
        // Le nom "navy" est conservé pour éviter une refonte des classes ;
        // la teinte sous-jacente est désormais un graphite chaud sans
        // cast bleu, plus juste pour le secteur (chirurgie esthétique
        // privée premium B2B).
        navy: {
          DEFAULT: "#1A1916",
          50: "#F2F1EF",
          100: "#DCDAD6",
          200: "#BAB7B0",
          600: "#3F3D38",
          700: "#2F2C27",
          800: "#22201C",
          900: "#1A1916",
          950: "#100F0D",
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
        // Neutres pearl stone — fonds, surfaces alternatives, séparateurs.
        // Bascule depuis l'ancienne échelle crème (boutique beige) vers
        // une stone pearl légèrement froide : la complémentarité avec
        // l'anthracite warm crée la profondeur Apple/Hermès/Linear.
        // Les noms de classes restent identiques pour ne pas casser les
        // ~140 usages dans l'app.
        ivory: "#F6F7F8",
        bone: "#EEEFF1",
        sand: "#DEE0E3",
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
          DEFAULT: "#F8F9FA",  // fond principal éditorial (stone pearl)
          shade: "#E9EBED",    // fond contrasté section (stone)
        },
        cream: "#EEEEEC",      // ex-chaleur beige — neutralisée stone
        rule: "#D4D6D9",       // filets, séparateurs (stone)
        accent: "#2A6B5C",     // status valid, lien actif, focus (vert lichen)
        "warm-accent": "#A06B3F", // cuivre patiné — éléments humains/photo
        alert: "#B85F3A",      // status critique (orange brûlé)
      },
      fontFamily: {
        // Registre Apple : SF Pro natif sur appareils Apple
        // (-apple-system / BlinkMacSystemFont), Inter ailleurs.
        // Une seule famille sans-serif partout (plus de display serif).
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "\"SF Pro Text\"",
          "var(--font-sans)",
          "Inter",
          "\"Segoe UI\"",
          "system-ui",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          "\"SF Pro Display\"",
          "var(--font-sans)",
          "Inter",
          "\"Segoe UI\"",
          "system-ui",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        editorial: [
          "-apple-system",
          "BlinkMacSystemFont",
          "\"SF Pro Display\"",
          "var(--font-sans)",
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
        // Ombres très douces — registre premium / B2B santé, calées
        // sur l'anthracite warm (#1A1916, expresso/charbon).
        soft: "0 1px 1px rgba(26,25,22,0.03)",
        card: "0 1px 2px rgba(26,25,22,0.025), 0 4px 14px -8px rgba(26,25,22,0.08)",
        lift: "0 8px 28px -14px rgba(26,25,22,0.18)",
        hairline: "inset 0 0 0 1px rgba(26,25,22,0.04)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
