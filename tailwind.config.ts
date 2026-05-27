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
        navy: {
          DEFAULT: "#0A1A2F",
          50: "#F2F5F9",
          100: "#E2E8F0",
          700: "#142C4A",
          800: "#0F2238",
          900: "#0A1A2F",
          950: "#06101D",
        },
        teal: {
          DEFAULT: "#0FB5AE",
          50: "#EBFBFA",
          100: "#CFF5F2",
          400: "#33C9C2",
          500: "#0FB5AE",
          600: "#0B928C",
          700: "#0A736E",
        },
        offwhite: "#F7F9FB",
        ink: "#0A1A2F",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,26,47,0.04), 0 8px 24px rgba(10,26,47,0.06)",
        soft: "0 1px 3px rgba(10,26,47,0.08)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
