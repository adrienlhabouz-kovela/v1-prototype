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
    <div className="flex min-h-screen bg-bone">
      {/* Sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-navy-950/20 bg-navy-900 px-5 py-7 md:flex">
        <Link href={roleHome[role]} className="px-1.5">
          <Wordmark light tagline />
        </Link>

        <div className="mt-9 px-1.5">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-navy-100/40">
            Navigation
          </p>
        </div>

        <nav className="mt-3 flex flex-col gap-0.5">
          {items.map((it) => {
            const active = activeHref === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`relative rounded-lg px-3 py-2 text-[13px] tracking-tight transition-colors ${
                  active
                    ? "bg-white/[0.07] font-medium text-white"
                    : "text-navy-100/60 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-teal-400" />
                )}
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/[0.06]">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-navy-100/45">
              Rôle (démo)
            </p>
            <p className="mt-2 text-[13px] font-medium tracking-tight text-white">
              {displayedUser}
            </p>
            <Link
              href="/login"
              className="mt-3 inline-block text-[11.5px] text-teal-300/90 hover:text-teal-200"
            >
              Changer de rôle →
            </Link>
          </div>
          <p className="mt-4 px-1.5 text-[10px] leading-relaxed text-navy-100/30">
            Prototype — données fictives. Pas une plateforme de production HDS.
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-navy-900/[0.06] bg-bone/85 px-4 py-3 backdrop-blur-md md:px-9">
          <div className="md:hidden">
            <Wordmark />
          </div>
          <div className="hidden items-center gap-1.5 md:flex">
            <span className="mr-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-charcoal/45">
              Vue
            </span>
            {(Object.keys(roleLabel) as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`rounded-md px-3 py-1.5 text-[11.5px] font-medium tracking-tight transition-colors ${
                  displayedRole === r
                    ? "bg-navy-900 text-white shadow-soft"
                    : "bg-white/60 text-charcoal/70 ring-1 ring-navy-900/[0.06] hover:bg-white hover:text-navy-900"
                }`}
              >
                {roleLabel[r]}
              </button>
            ))}
          </div>
          <Link href="/login" className="text-xs font-medium text-teal-700 md:hidden">
            Rôle
          </Link>
        </header>

        {/* Navigation mobile — onglets du rôle */}
        <nav className="flex gap-1.5 overflow-x-auto border-b border-navy-900/[0.06] bg-bone/85 px-4 py-2 md:hidden">
          {items.map((it) => {
            const active = activeHref === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[11.5px] font-medium transition-colors ${
                  active
                    ? "bg-navy-900 text-white"
                    : "bg-white/60 text-charcoal/70 ring-1 ring-navy-900/[0.05]"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        {/* Bandeau prototype — discret, traçabilité du build */}
        <div className="flex items-center gap-2.5 border-b border-navy-900/[0.05] bg-bone/60 px-4 py-1.5 text-[10.5px] tracking-tight text-charcoal/50 md:px-9">
          <span className="h-1 w-1 shrink-0 rounded-full bg-teal-500/80" />
          <span>
            Prototype — build{" "}
            <span className="font-mono text-charcoal/65">{process.env.BUILD_SHA}</span> — données
            fictives, état non persistant.
          </span>
        </div>

        <main className="flex-1 px-4 py-8 md:px-9 md:py-10">{children}</main>
      </div>
    </div>
  );
}
