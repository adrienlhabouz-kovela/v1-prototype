"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const NAV = [
  { href: "/", label: "Accueil", icon: HomeIcon },
  { href: "/learn", label: "Parcours", icon: PathIcon },
  { href: "/wind-trainer", label: "Vent", icon: WindIcon },
  { href: "/cruise-simulator", label: "Croisière", icon: AnchorIcon },
  { href: "/progress", label: "Progrès", icon: TrophyIcon },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto max-w-md px-3 pb-3">
          <div className="flex items-stretch justify-between rounded-2xl border border-white/10 bg-abyss-950/80 p-1.5 backdrop-blur-xl shadow-lift">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 focus-ring"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-spray-500/15 ring-1 ring-spray-500/30"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`relative h-5 w-5 ${
                      active ? "text-spray-400" : "text-abyss-100"
                    }`}
                  />
                  <span
                    className={`relative text-[0.62rem] font-semibold ${
                      active ? "text-spray-400" : "text-abyss-100/80"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

// ── Icônes SVG natives (pas de dépendance externe) ───────────────────────

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}
function PathIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="M8 6h6a3 3 0 0 1 3 3v6M6 8v4a3 3 0 0 0 3 3h3" />
    </svg>
  );
}
function WindIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 12h14a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 16h7a2 2 0 1 1-2 2" />
    </svg>
  );
}
function AnchorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v13M5 12a7 7 0 0 0 14 0M9 10H7m10 0h-2" />
    </svg>
  );
}
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v1a4 4 0 0 0 3 3.9M17 6h3v1a4 4 0 0 1-3 3.9M9 20h6M12 14v6" />
    </svg>
  );
}
