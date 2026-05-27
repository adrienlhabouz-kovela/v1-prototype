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
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-navy-900">
            Sélection du rôle de démonstration
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Authentification fictive. Choisissez un espace pour explorer le prototype.
            Aucune donnée réelle, aucune vraie authentification.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => choose(r.role, r.href)}
              className="group rounded-2xl bg-white p-5 text-left shadow-card ring-1 ring-slate-100 transition-all hover:ring-teal-300"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-navy-900">{r.label}</h3>
                <span className="text-teal-600 opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{r.desc}</p>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Prototype KOVELA — pas une plateforme de production HDS.
        </p>
      </div>
    </div>
  );
}
