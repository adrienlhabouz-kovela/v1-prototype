import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
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

export const metadata: Metadata = {
  title: "KOVELA — Infrastructure de suivi post-opératoire (prototype)",
  description:
    "Prototype de démonstration KOVELA. Données fictives. Pas une plateforme de production HDS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <KovelaProvider>{children}</KovelaProvider>
      </body>
    </html>
  );
}
