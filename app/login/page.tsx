"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/Shell";
import { useKovela } from "@/lib/store";
import type { Role } from "@/lib/types";

const roles: { role: Role; label: string; desc: string; href: string }[] = [
  {
    role: "admin",
    label: "Admin KOVELA",
    desc: "Pilotage : chirurgiens, patients, charge superviseur, attribution, facturation.",
    href: "/admin",
  },
  {
    role: "superviseur",
    label: "Superviseur",
    desc: "Inbox opérationnelle, fiches patients, IA assistive, CR et escalades.",
    href: "/superviseur",
  },
  {
    role: "chirurgien",
    label: "Chirurgien",
    desc: "Vue claire : CR disponibles, escalades reçues, dossiers résumés.",
    href: "/chirurgien",
  },
  {
    role: "patient",
    label: "Patient",
    desc: "Onboarding, consentement, messagerie sécurisée, rappel urgence.",
    href: "/patient/onboarding",
  },
];

export default function Login() {
  const { setRole } = useKovela();
  const router = useRouter();

  function choose(role: Role, href: string) {
    setRole(role);
    router.push(href);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-depth px-4 py-12 text-white">
      <div className="w-full max-w-2xl">
        <div className="mb-9 flex flex-col items-center text-center">
          <Logo light />
          <h1 className="mt-7 font-display text-3xl tracking-tight text-white">
            Sélection du rôle de démonstration
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-100/70">
            Authentification fictive. Choisissez un espace pour explorer le prototype.
            Aucune donnée réelle, aucune vraie authentification.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => choose(r.role, r.href)}
              className="group rounded-2xl bg-white/[0.04] p-5 text-left ring-1 ring-white/10 backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:ring-teal-400/40"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">{r.label}</h3>
                <span className="text-teal-300 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-100/65">{r.desc}</p>
            </button>
          ))}
        </div>

        <p className="mt-9 text-center text-xs text-navy-100/40">
          Prototype KOVELA — pas une plateforme de production HDS.
        </p>
      </div>
    </div>
  );
}
