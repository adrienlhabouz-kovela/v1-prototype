"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useProgress } from "@/lib/progress/store";
import { MODULES } from "@/lib/content/modules";
import { ProgressBar, Pill } from "@/components/ui/primitives";

export default function LearnPage() {
  const { state, ready } = useProgress();

  const moduleStatus = MODULES.map((m, i) => {
    const doneLessons = m.lessons.filter((l) =>
      state.completedLessons.includes(l.id),
    ).length;
    const complete = doneLessons === m.lessons.length;
    return { module: m, doneLessons, complete, index: i };
  });

  // Un module est déverrouillé si le précédent est terminé.
  const isUnlocked = (i: number) =>
    i === 0 || moduleStatus[i - 1].complete;

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <div className="label-caps">Parcours</div>
        <h1 className="mt-1 font-display text-2xl text-sail">
          De moussaillon à skipper
        </h1>
        <p className="mt-1 text-sm text-abyss-100/80">
          10 modules progressifs. Chaque module débloque le suivant.
        </p>
      </header>

      <div className="relative space-y-3">
        {/* ligne du parcours */}
        <div className="absolute bottom-4 left-[39px] top-4 w-0.5 bg-white/10" />

        {moduleStatus.map(({ module, doneLessons, complete }, i) => {
          const unlocked = ready ? isUnlocked(i) : i === 0;
          const lesson = module.lessons[0];
          const prog = doneLessons / module.lessons.length;

          const node = (
            <div className="relative flex gap-4">
              {/* pastille du module */}
              <div className="relative z-10 shrink-0">
                <div
                  className={`flex h-[58px] w-[58px] items-center justify-center rounded-2xl text-2xl ring-1 transition ${
                    complete
                      ? "bg-spray-500/20 ring-spray-500/40"
                      : unlocked
                        ? "bg-lagoon-500/20 ring-lagoon-400/40"
                        : "bg-white/[0.03] ring-white/10 grayscale"
                  }`}
                >
                  {unlocked ? module.glyph : "🔒"}
                </div>
                {complete && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-spray-500 text-xs text-abyss-950">
                    ✓
                  </span>
                )}
              </div>

              {/* contenu */}
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[0.62rem] font-bold uppercase tracking-wide text-abyss-100/50">
                    Module {module.index}
                  </span>
                  {complete && <Pill tone="spray" className="!py-0.5 !text-[0.6rem]">Terminé</Pill>}
                  {!unlocked && <Pill tone="muted" className="!py-0.5 !text-[0.6rem]">Verrouillé</Pill>}
                </div>
                <h2 className={`font-display text-lg ${unlocked ? "text-sail" : "text-abyss-100/40"}`}>
                  {module.title}
                </h2>
                <p className={`text-xs ${unlocked ? "text-abyss-100/70" : "text-abyss-100/30"}`}>
                  {module.subtitle}
                </p>
                {unlocked && (
                  <>
                    <div className="mt-2 flex items-center gap-3">
                      <ProgressBar value={prog} className="flex-1" tone={complete ? "spray" : "sun"} />
                      <span className="text-[0.65rem] text-abyss-100/60">
                        {doneLessons}/{module.lessons.length}
                      </span>
                    </div>
                    <div className="mt-1 text-[0.65rem] text-abyss-100/50">
                      ~{lesson.minutes} min · +{lesson.xp} XP
                    </div>
                  </>
                )}
              </div>
            </div>
          );

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              {unlocked ? (
                <Link
                  href={`/lesson/${lesson.id}`}
                  className="block rounded-2xl p-2 transition active:scale-[0.99] hover:bg-white/[0.02]"
                >
                  {node}
                </Link>
              ) : (
                <div className="rounded-2xl p-2 opacity-90">{node}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
