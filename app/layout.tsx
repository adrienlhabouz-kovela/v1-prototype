import type { Metadata } from "next";
import "./globals.css";
import { KovelaProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "KOVELA — Coordination post-opératoire (prototype)",
  description:
    "Prototype de démonstration KOVELA. Données fictives. Pas une plateforme de production HDS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <KovelaProvider>{children}</KovelaProvider>
      </body>
    </html>
  );
}
