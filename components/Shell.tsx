"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useKovela } from "@/lib/store";
import type { Role } from "@/lib/types";
import { Wordmark } from "@/components/Brand";

// Mappe le préfixe d'URL au rôle métier correspondant.
function roleFromPathname(pathname: string): Role | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/superviseur")) return "superviseur";
  if (pathname.startsWith("/chirurgien")) return "chirurgien";
  if (pathname.startsWith("/patient")) return "patient";
  if (pathname.startsWith("/sales")) return "admin"; // vue sales = sous-espace admin
  return null;
}

const nav: Record<Role, { href: string; label: string }[]> = {
  admin: [
    { href: "/admin", label: "Tableau de bord" },
    { href: "/admin/crm", label: "CRM Chirurgiens" },
    { href: "/sales", label: "Vue sales" },
    { href: "/admin/supervision", label: "Supervision & qualité" },
    { href: "/logs", label: "Logs" },
  ],
  superviseur: [
    { href: "/superviseur", label: "Inbox opérationnelle" },
    { href: "/superviseur/formation", label: "Formation" },
    { href: "/logs", label: "Logs" },
  ],
  chirurgien: [
    { href: "/chirurgien", label: "Mes patients" },
    { href: "/chirurgien/planning", label: "Planning opératoire" },
    { href: "/chirurgien/onboarding", label: "Mise en place cabinet" },
    { href: "/logs", label: "Logs" },
  ],
  patient: [
    { href: "/patient/onboarding", label: "Onboarding" },
    { href: "/patient/messages", label: "Messagerie" },
  ],
};

const roleLabel: Record<Role, string> = {
  admin: "Admin KOVELA",
  superviseur: "Superviseur",
  chirurgien: "Chirurgien",
  patient: "Patient",
};

// Utilisateur de démo affiché dans la sidebar — dérivé du chemin pour éviter
// tout flash SSR « Admin KOVELA » sur les autres espaces.
const userByRoleLabel: Record<Role, string> = {
  admin: "Admin KOVELA",
  superviseur: "Inès Carvalho",
  chirurgien: "Dr. Camille Aragon",
  patient: "Camille Moreau",
};

const roleHome: Record<Role, string> = {
  admin: "/admin",
  superviseur: "/superviseur",
  chirurgien: "/chirurgien",
  patient: "/patient/onboarding",
};

// Conservé pour compatibilité (utilisé par /login).
export function Logo({ light }: { light?: boolean }) {
  return <Wordmark light={light} />;
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useKovela();
  const pathname = usePathname();
  const router = useRouter();

  // Rôle/utilisateur dérivés du chemin — cohérent dès le SSR (pas de flash).
  const displayedRole: Role = roleFromPathname(pathname) ?? role;
  const displayedUser = userByRoleLabel[displayedRole];

  // Aligne le rôle du store sur l'URL (pills + nav restent cohérents).
  useEffect(() => {
    const r = roleFromPathname(pathname);
    if (r && r !== role) setRole(r);
  }, [pathname, role, setRole]);

  const items = nav[displayedRole];

  const activeHref = items
    .filter((x) => pathname === x.href || pathname.startsWith(x.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  function switchRole(r: Role) {
    setRole(r);
    router.push(roleHome[r]);
  }

  return (
    <div className="flex min-h-screen bg-[#eef1f3]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-depth px-4 py-6 md:flex">
        <Link href={roleHome[role]} className="px-2">
          <Wordmark light tagline />
        </Link>

        <nav className="mt-10 flex flex-col gap-1">
          {items.map((it) => {
            const active = activeHref === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`relative rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-white/10 font-medium text-white"
                    : "text-navy-100/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-teal-400" />
                )}
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
            <p className="text-[10px] uppercase tracking-[0.14em] text-navy-100/45">Rôle (démo)</p>
            <p className="mt-1 text-sm font-medium text-white">{displayedUser}</p>
            <Link href="/login" className="mt-2.5 inline-block text-xs text-teal-300 hover:text-teal-200">
              Changer de rôle →
            </Link>
          </div>
          <p className="mt-3 px-1 text-[10px] leading-tight text-navy-100/35">
            Prototype — données fictives. Pas une plateforme de production HDS.
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-navy-900/[0.07] bg-white/85 px-4 py-3 backdrop-blur-md md:px-8">
          <div className="md:hidden">
            <Wordmark />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs text-charcoal/45">Vue&nbsp;:</span>
            {(Object.keys(roleLabel) as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  displayedRole === r
                    ? "bg-navy-900 text-white"
                    : "bg-navy-50 text-charcoal/70 hover:bg-navy-100"
                }`}
              >
                {roleLabel[r]}
              </button>
            ))}
          </div>
          <Link href="/login" className="text-xs font-medium text-teal-600 md:hidden">
            Rôle
          </Link>
        </header>

        {/* Navigation mobile — onglets du rôle */}
        <nav className="flex gap-1.5 overflow-x-auto border-b border-navy-900/[0.06] bg-white px-4 py-2 md:hidden">
          {items.map((it) => {
            const active = activeHref === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active ? "bg-navy-900 text-white" : "bg-navy-50 text-charcoal/70"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        {/* Bandeau prototype — état non persistant + SHA de build pour traçabilité */}
        <div className="flex items-center gap-2 border-b border-navy-900/[0.06] bg-navy-50/60 px-4 py-1.5 text-[11px] text-charcoal/55 md:px-8">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
          <span>
            Prototype — build{" "}
            <span className="font-mono text-charcoal/75">{process.env.BUILD_SHA}</span> — données
            fictives, état non persistant. Un rafraîchissement peut réinitialiser la démo.
          </span>
        </div>

        <main className="flex-1 px-4 py-7 md:px-8 md:py-9">{children}</main>
      </div>
    </div>
  );
}
