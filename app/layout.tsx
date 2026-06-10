import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { KovelaProvider } from "@/lib/store";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// ─── Système éditorial (Operating Room Discipline) ────────────────────────
// Direction artistique validée — voir docs/strategy/.
//
// Cible production : Söhne (Klim Type) en display + body + mono.
// Fallback open source en attendant l'achat de licence Söhne :
//   - Display + body : Inter — letter-spacing négatif sur grands titres
//     simule la densité de Söhne Halbfett. (Söhne et Inter ont des
//     proportions très proches.)
//   - Mono : JetBrains Mono Light — clarté monospace cohérente avec
//     l'esprit éditorial.
//
// Variables CSS exposées :
//   --font-editorial      — display + body éditorial
//   --font-editorial-mono — monospace éditorial
// -------------------------------------------------------------------------
const editorial = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-editorial",
  display: "swap",
});

const editorialMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-editorial-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KOVELA — Infrastructure de suivi post-opératoire (prototype)",
  description:
    "Prototype de démonstration KOVELA. Données fictives. Pas une plateforme de production HDS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${fraunces.variable} ${editorial.variable} ${editorialMono.variable}`}
    >
      <body className="font-sans">
        <KovelaProvider>{children}</KovelaProvider>
      </body>
    </html>
  );
}
