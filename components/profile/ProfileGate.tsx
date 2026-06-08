"use client";

import type { ReactNode } from "react";
import { useProfile } from "@/lib/progress/store";
import { ProfilePicker } from "./ProfilePicker";

/**
 * Affiche l'écran « Qui apprend aujourd'hui ? » tant qu'aucun profil n'est
 * actif ; sinon rend l'application (avec sa coquille / navigation).
 */
export function ProfileGate({ children }: { children: ReactNode }) {
  const { ready, activeId } = useProfile();

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
        <div className="animate-pulse text-3xl">⛵</div>
      </div>
    );
  }

  if (!activeId) return <ProfilePicker />;

  return <>{children}</>;
}
