import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress/store";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Cap au Vent — Apprends la voile",
  description:
    "L'app privée d'Adrien pour apprendre la voile : vent, allures, manœuvres, croisière et régate. Visuel, interactif, 15 minutes par jour.",
  applicationName: "Cap au Vent",
};

export const viewport: Viewport = {
  themeColor: "#0B1B2B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-sea-deep">
        <ProgressProvider>
          <AppShell>{children}</AppShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
