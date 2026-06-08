"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProfile } from "@/lib/progress/store";
import {
  summarize,
  type ProfileMeta,
  type ProfileSummary,
} from "@/lib/profiles/profiles";
import { loadProfileState } from "@/lib/progress/storage";

const ACCENT: Record<ProfileMeta["accent"], string> = {
  spray: "from-spray-500/25 ring-spray-500/40 text-spray-400",
  sun: "from-sun-500/25 ring-sun-500/40 text-sun-400",
  lagoon: "from-lagoon-400/25 ring-lagoon-400/40 text-lagoon-300",
  coral: "from-coral-500/25 ring-coral-500/40 text-coral-400",
};

export function ProfilePicker() {
  const { profiles, chooseProfile } = useProfile();
  // Résumé de chaque profil (lu sans activer le profil) → aperçu du niveau.
  const [summaries, setSummaries] = useState<Record<string, ProfileSummary>>({});

  useEffect(() => {
    const next: Record<string, ProfileSummary> = {};
    for (const p of profiles) next[p.id] = summarize(loadProfileState(p.id));
    setSummaries(next);
  }, [profiles]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="text-4xl">⛵</div>
        <div className="label-caps mt-3">Cap au Vent</div>
        <h1 className="mt-1 font-display text-3xl text-sail">
          Qui apprend aujourd&apos;hui ?
        </h1>
        <p className="mt-2 text-sm text-abyss-100/70">
          Choisis ton profil. Chacun a sa propre progression.
        </p>
      </motion.header>

      <div className="space-y-3">
        {profiles.map((p, i) => {
          const s = summaries[p.id];
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              onClick={() => chooseProfile(p.id)}
              className={`flex w-full items-center gap-4 rounded-3xl bg-gradient-to-br to-abyss-900 p-5 text-left ring-1 shadow-card transition active:scale-[0.99] ${ACCENT[p.accent]}`}
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-4xl">
                {p.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-display text-2xl text-sail">{p.name}</div>
                <div className="text-xs text-abyss-100/70">{p.tagline}</div>
                {s && (
                  <div className="mt-1.5 text-[0.7rem] text-abyss-100/60">
                    Niveau {s.level} · {s.levelName} · {s.xp} XP
                  </div>
                )}
              </div>
              <span className="text-xl text-current">→</span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-8 text-center text-[0.7rem] text-abyss-100/40">
        Les progressions ne sont jamais mélangées entre profils.
      </p>
    </div>
  );
}
