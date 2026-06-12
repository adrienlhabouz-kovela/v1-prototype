import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { KovelaProvider } from "@/lib/store";

// Typographie KOVELA — registre Apple (SF Pro Display / SF Pro Text).
// Sur appareils Apple : SF Pro natif via -apple-system (cf. tailwind config).
// Sur autres OS : Inter (proportions très proches de SF Pro), chargée via
// Next/font. Une seule famille sans-serif, plus de display serif.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
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
      className={`${inter.variable} ${editorialMono.variable}`}
    >
      <body className="font-sans">
        <KovelaProvider>{children}</KovelaProvider>
      </body>
    </html>
  );
}
