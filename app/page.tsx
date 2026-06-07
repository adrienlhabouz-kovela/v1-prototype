"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useProgress } from "@/lib/progress/store";
import { levelForXp, nextLevelFor, levelProgress } from "@/lib/content/levels";
import { ALL_LESSONS, MODULES, moduleById, conceptLabel } from "@/lib/content/modules";
import { weakestConcepts } from "@/lib/engine/adaptive";
import { ProgressBar, ScoreRing, Card, Pill } from "@/components/ui/primitives";

export default function DashboardPage() {
  const { state, ready, profile, tuning } = useProgress();

  if (!ready) return <DashboardSkeleton />;

  const level = levelForXp(state.xp);
  const next = nextLevelFor(state.xp);
  const lvlProg = levelProgress(state.xp);
  const done = state.completedLessons.length;
  const total = ALL_LESSONS.length;
  const globalProgress = total ? done / total : 0;

  // Prochaine leçon recommandée : première non complétée dans l'ordre des modules.
  const nextLesson =
    ALL_LESSONS.find((l) => !state.completedLessons.includes(l.id)) ?? null;
  const nextModule = nextLesson ? moduleById(nextLesson.moduleId) : null;

  const errors = weakestConcepts(state, 3);
  const name = profile?.name ?? "marin";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bel après-midi" : "Bonsoir";
  const title = tuning.playful
    ? `Salut ${name} ! On embarque ? ${profile?.avatar ?? "⛵"}`
    : `${greeting}, ${name} 👋`;

  return (
    <div className="space-y-5">
      {/* en-tête */}
      <header className="pt-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="label-caps">Cap au Vent</div>
            <h1 className="mt-1 font-display text-2xl text-sail">{title}</h1>
          </div>
          <StreakBadge streak={state.streak} />
        </div>
      </header>

      {/* carte niveau */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl bg-gradient-to-br from-lagoon-500/30 via-abyss-800 to-abyss-900 p-5 ring-1 ring-white/10 shadow-card"
      >
        <div className="flex items-center justify-between">
          <div>
            <Pill tone="spray">Niveau {level.id}</Pill>
            <h2 className="mt-2 font-display text-2xl text-sail">{level.name}</h2>
            <p className="text-sm text-abyss-100/80">{level.tagline}</p>
          </div>
          <ScoreRing value={lvlProg} size={84} stroke={8} tone="spray" label={`${state.xp}`} />
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-abyss-100/70">
            <span>{state.xp} XP</span>
            {next ? <span>{next.minXp} XP → {next.name}</span> : <span>Niveau max ⚓</span>}
          </div>
          <ProgressBar value={lvlProg} />
        </div>
      </motion.div>

      {/* stats rapides */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile value={`${Math.round(globalProgress * 100)}%`} label="Parcours" />
        <StatTile value={`${done}/${total}`} label="Leçons" />
        <StatTile value={`${state.badges.length}`} label="Badges" />
      </div>

      {/* prochaine leçon / continuer */}
      {nextLesson && nextModule ? (
        <div>
          <div className="label-caps mb-2">Reprends ici</div>
          <Link
            href={`/lesson/${nextLesson.id}`}
            className="block overflow-hidden rounded-2xl bg-sail p-4 text-abyss-900 shadow-card transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lagoon-500/15 text-3xl">
                {nextModule.glyph}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-lagoon-600">
                  Module {nextModule.index} · {nextModule.title}
                </div>
                <div className="truncate font-display text-lg">{nextLesson.title}</div>
                <div className="text-xs text-abyss-900/60">
                  ~{nextLesson.minutes} min · +{nextLesson.xp} XP
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-spray-500 text-abyss-950">
                ▶
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <Card className="text-center">
          <div className="text-3xl">🏆</div>
          <p className="mt-2 font-display text-lg text-sail">Parcours terminé !</p>
          <p className="text-sm text-abyss-100/70">
            Entretiens tes acquis avec le Wind Trainer et les simulateurs.
          </p>
        </Card>
      )}

      {/* erreurs fréquentes */}
      {errors.length > 0 && (
        <div>
          <div className="label-caps mb-2">À revoir — tes points faibles</div>
          <div className="space-y-2">
            {errors.map((e) => (
              <div
                key={e.concept}
                className="flex items-center justify-between rounded-xl bg-coral-500/8 p-3 ring-1 ring-coral-500/20"
              >
                <span className="text-sm text-abyss-100">{conceptLabel(e.concept)}</span>
                <Pill tone="coral">{Math.round(e.rate * 100)}% réussi</Pill>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* accès rapides outils */}
      <div>
        <div className="label-caps mb-2">Tes outils</div>
        <div className="grid grid-cols-2 gap-3">
          <ToolCard href="/wind-trainer" glyph="🌬️" title="Wind Trainer" sub="Lis le vent en direct" />
          <ToolCard href="/cruise-simulator" glyph="⚓" title="Croisière" sub="Go / No-Go Méditerranée" />
          <ToolCard href="/regatta-simulator" glyph="🏁" title="Régate" sub="Tactique avec Bertrand" />
          <ToolCard href="/learn" glyph="🧭" title="Parcours" sub="10 modules" />
        </div>
      </div>
    </div>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-sun-500/10 px-3 py-2 ring-1 ring-sun-500/25">
      <span className="text-xl">🔥</span>
      <span className="text-lg font-bold leading-none text-sun-400">{streak}</span>
      <span className="text-[0.6rem] text-sun-400/80">jours</span>
    </div>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 text-center ring-1 ring-white/10">
      <div className="font-display text-xl text-sail">{value}</div>
      <div className="text-[0.65rem] uppercase tracking-wide text-abyss-100/60">{label}</div>
    </div>
  );
}

function ToolCard({ href, glyph, title, sub }: { href: string; glyph: string; title: string; sub: string }) {
  return (
    <Link href={href} className="card flex flex-col gap-1 p-4 transition active:scale-[0.98]">
      <span className="text-2xl">{glyph}</span>
      <span className="font-semibold text-sail">{title}</span>
      <span className="text-xs text-abyss-100/60">{sub}</span>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5 pt-6">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-white/5" />
      <div className="h-44 animate-pulse rounded-3xl bg-white/5" />
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
    </div>
  );
}
