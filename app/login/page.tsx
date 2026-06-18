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
    desc: "Inbox opérationnelle, fiches patients, IA assistive, CR factuels et transmissions cabinet.",
    href: "/superviseur",
  },
  {
    role: "chirurgien",
    label: "Chirurgien",
    desc: "Mise en place du service, planning opératoire, référentiel de suivi, CR factuels et transmissions.",
    href: "/chirurgien",
  },
  {
    role: "patient",
    label: "Patient",
    desc: "Onboarding, consentement, messagerie encadrée, rappel urgence.",
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
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-14 text-white">
      <div className="w-full max-w-2xl">
        <div className="mb-11 flex flex-col items-center text-center">
          <Logo light />
          <p className="mt-9 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-teal-300/85">
            Espace de démonstration
          </p>
          <h1 className="mt-3 font-display text-[2rem] font-medium leading-tight tracking-tight text-white md:text-[2.2rem]">
            Sélection du rôle
          </h1>
          <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-navy-100/65">
            Authentification fictive. Choisissez un espace pour explorer le prototype. Aucune
            donnée réelle, aucune vraie authentification.
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => choose(r.role, r.href)}
              className="group rounded-xl bg-white/[0.04] p-5 text-left ring-1 ring-white/10 backdrop-blur-sm transition-all hover:bg-white/[0.07] hover:ring-teal-400/40"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[15px] font-semibold tracking-tight text-white">
                  {r.label}
                </h3>
                <span className="text-teal-300/80 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-navy-100/60">{r.desc}</p>
            </button>
          ))}
        </div>

        <p className="mt-11 text-center text-[10.5px] tracking-tight text-navy-100/40">
          Prototype KOVELA — pas une plateforme de production HDS.
        </p>
      </div>
    </div>
  );
}
