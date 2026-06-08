"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress, useProfile } from "@/lib/progress/store";
import { levelForXp } from "@/lib/content/levels";

interface MenuItem {
  label: string;
  glyph: string;
  href?: string;
  action?: () => void;
}

/** Avatar du profil actif (haut à droite) + menu déroulant. */
export function ProfileMenu() {
  const { state } = useProgress();
  const { profile, switchProfile } = useProfile();
  const [open, setOpen] = useState(false);

  if (!profile) return null;

  const level = levelForXp(state.xp);

  const items: MenuItem[] = [
    { label: "Statistiques", glyph: "📊", href: "/progress" },
    { label: "Progression", glyph: "🧭", href: "/learn" },
    { label: "Paramètres", glyph: "⚙️", href: "/settings" },
    {
      label: "Changer de profil",
      glyph: "🔄",
      action: () => {
        setOpen(false);
        switchProfile();
      },
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Profil de ${profile.name}`}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl ring-1 ring-white/15 transition active:scale-95 focus-ring"
      >
        {profile.avatar}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* zone de fermeture */}
            <button
              aria-hidden
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-white/10 bg-abyss-950/95 p-2 shadow-lift backdrop-blur-xl"
            >
              {/* en-tête profil */}
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl">
                  {profile.avatar}
                </span>
                <div className="min-w-0">
                  <div className="font-display text-base text-sail">{profile.name}</div>
                  <div className="text-[0.65rem] text-abyss-100/60">
                    Niveau {level.id} · {state.xp} XP
                  </div>
                </div>
              </div>

              <div className="mt-1.5 space-y-0.5">
                {items.map((item) =>
                  item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-abyss-100 transition hover:bg-white/5 focus-ring"
                    >
                      <span className="text-base">{item.glyph}</span>
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-spray-400 transition hover:bg-white/5 focus-ring"
                    >
                      <span className="text-base">{item.glyph}</span>
                      {item.label}
                    </button>
                  ),
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
