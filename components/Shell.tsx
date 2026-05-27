"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useKovela } from "@/lib/store";
import type { Role } from "@/lib/types";

const nav: Record<Role, { href: string; label: string }[]> = {
  admin: [
    { href: "/admin", label: "Tableau de bord" },
    { href: "/logs", label: "Logs" },
  ],
  superviseur: [
    { href: "/superviseur", label: "Inbox opérationnelle" },
    { href: "/logs", label: "Logs" },
  ],
  chirurgien: [
    { href: "/chirurgien", label: "Mes patients" },
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

const roleHome: Record<Role, string> = {
  admin: "/admin",
  superviseur: "/superviseur",
  chirurgien: "/chirurgien",
  patient: "/patient/onboarding",
};

export function Logo({ light }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
        K
      </div>
      <span className={`text-base font-semibold tracking-tight ${light ? "text-white" : "text-navy-900"}`}>
        KOVELA
      </span>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { role, setRole, currentUser } = useKovela();
  const pathname = usePathname();
  const router = useRouter();

  const items = nav[role];

  function switchRole(r: Role) {
    setRole(r);
    router.push(roleHome[r]);
  }

  return (
    <div className="flex min-h-screen bg-offwhite">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-900 px-4 py-5 md:flex">
        <Link href={roleHome[role]} className="px-2">
          <Logo light />
        </Link>
        <p className="mt-1 px-2 text-[11px] text-navy-100/60">Coordination post-opératoire</p>

        <nav className="mt-8 flex flex-col gap-1">
          {items.map((it) => {
            const active = pathname === it.href || pathname.startsWith(it.href + "/");
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-white/10 font-medium text-white" : "text-navy-100/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-[11px] uppercase tracking-wide text-navy-100/50">Rôle (démo)</p>
            <p className="mt-0.5 text-sm font-medium text-white">{currentUser}</p>
            <Link
              href="/login"
              className="mt-2 inline-block text-xs text-teal-400 hover:text-teal-300"
            >
              Changer de rôle →
            </Link>
          </div>
          <p className="mt-3 px-1 text-[10px] leading-tight text-navy-100/40">
            Prototype — données fictives. Pas une plateforme de production HDS.
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile + role pills */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur md:px-8">
          <div className="md:hidden">
            <Logo />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs text-slate-400">Vue :</span>
            {(Object.keys(roleLabel) as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  role === r
                    ? "bg-navy-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
