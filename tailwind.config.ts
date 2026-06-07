import type { Config } from "tailwindcss";

/**
 * Cap au Vent — design system.
 * Registre « premium nautique » : bleus profonds de mer, écume, accents
 * solaires pour la gamification. Mobile-first, contrastes lisibles au soleil.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bleu profond — fond principal, registre nuit en mer
        abyss: {
          DEFAULT: "#0B1B2B",
          50: "#E7EDF3",
          100: "#C2D1DF",
          800: "#0F2438",
          900: "#0B1B2B",
          950: "#06121C",
        },
        // Bleu lagon — surfaces, cartes sur fond clair
        lagoon: {
          DEFAULT: "#0E7C9B",
          50: "#E8F6FA",
          100: "#C5E9F1",
          300: "#67C7DC",
          400: "#36AECB",
          500: "#0E7C9B",
          600: "#0B6580",
          700: "#0A5267",
        },
        // Turquoise écume — accent primaire interactif
        spray: {
          DEFAULT: "#2FE2C5",
          400: "#54E9D1",
          500: "#2FE2C5",
          600: "#16C2A6",
        },
        // Or solaire — XP, badges, récompenses
        sun: {
          DEFAULT: "#FFB23E",
          400: "#FFC163",
          500: "#FFB23E",
          600: "#F0991C",
        },
        // Corail — erreurs, danger, no-go
        coral: {
          DEFAULT: "#FF6B5E",
          400: "#FF8A80",
          500: "#FF6B5E",
          600: "#E84F42",
        },
        // Voile / écume — surfaces claires
        sail: "#F6FAFC",
        foam: "#EAF2F6",
        rope: "#D9E4EB",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      letterSpacing: {
        brand: "0.22em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(8,24,40,0.04), 0 10px 30px -18px rgba(8,24,40,0.35)",
        lift: "0 16px 40px -20px rgba(8,24,40,0.45)",
        glow: "0 0 0 1px rgba(47,226,197,0.4), 0 8px 30px -10px rgba(47,226,197,0.35)",
        innerline: "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "sea-deep":
          "radial-gradient(130% 120% at 80% -10%, #11405C 0%, #0B1B2B 48%, #06121C 100%)",
        "sea-card":
          "linear-gradient(160deg, rgba(47,226,197,0.10) 0%, rgba(14,124,155,0.04) 60%)",
        "spray-sheen":
          "linear-gradient(135deg, rgba(47,226,197,0.25) 0%, rgba(47,226,197,0) 55%)",
      },
      keyframes: {
        "wind-drift": {
          "0%": { transform: "translateX(-6%)", opacity: "0" },
          "20%": { opacity: "0.7" },
          "100%": { transform: "translateX(120%)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "wind-drift": "wind-drift 3.5s linear infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
