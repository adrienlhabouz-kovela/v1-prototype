"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useProgress } from "@/lib/progress/store";
import { levelForXp, nextLevelFor, levelProgress } from "@/lib/content/levels";
import { ALL_LESSONS } from "@/lib/content/modules";
import { buildCoachPlan, type CoachAction } from "@/lib/engine/coach";
import { ProgressBar, ScoreRing, Pill } from "@/components/ui/primitives";
import { Term } from "@/components/ui/Term";

export default function DashboardPage() {
  const { state, ready, profile, tuning } = useProgress();

  if (!ready) return <DashboardSkeleton />;

  const level = levelForXp(state.xp);
  const next = nextLevelFor(state.xp);
  const lvlProg = levelProgress(state.xp);
  const done = state.completedLessons.length;
  const total = ALL_LESSONS.length;
  const globalProgress = total ? done / total : 0;

  const plan = buildCoachPlan(state, profile?.kind ?? "adult");

  const name = profile?.name ?? "marin";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bel après-midi" : "Bonsoir";
  const title = tuning.playful
    ? `Salut ${name} ! ${profile?.avatar ?? "⛵"}`
    : `${greeting}, ${name} 👋`;

  return (
    <div className="space-y-5">
      {/* en-tête */}
      <header className="pt-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="label-caps">Ton coach voile</div>
            <h1 className="mt-1 font-display text-2xl text-sail">{title}</h1>
          </div>
          <StreakBadge streak={state.streak} />
        </div>
        <p className="mt-2 text-sm italic text-spray-400/90">{plan.motivation}</p>
      </header>

      {/* objectif du jour + sessions guidées */}
      <div className="rounded-3xl bg-gradient-to-br from-lagoon-500/20 via-abyss-800 to-abyss-900 p-5 ring-1 ring-white/10 shadow-card">
        <div className="label-caps">🎯 Objectif du jour</div>
        <p className="mt-1.5 font-display text-lg leading-snug text-sail">{plan.objective}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <SessionChip action={plan.sessions.short} />
          <SessionChip action={plan.sessions.normal} />
        </div>
      </div>

      {/* action principale */}
      <div>
        <div className="label-caps mb-2">Prochaine action recommandée</div>
        <Link
          href={plan.primary.href}
          className="block overflow-hidden rounded-2xl bg-sail p-4 text-abyss-900 shadow-card transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lagoon-500/15 text-3xl">
              {plan.primary.glyph}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-lg">{plan.primary.title}</div>
              <div className="text-xs text-abyss-900/60">{plan.primary.sub}</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-spray-500 text-abyss-950">
              ▶
            </div>
          </div>
        </Link>
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10">
          <span className="text-sm">💡</span>
          <p className="text-xs leading-relaxed text-abyss-100/80">
            <span className="font-semibold text-abyss-100">Pourquoi maintenant : </span>
            {plan.primaryWhy}
          </p>
        </div>
      </div>

      {/* actions secondaires */}
      <div>
        <div className="label-caps mb-2">Et aussi</div>
        <div className="grid grid-cols-2 gap-3">
          {plan.secondary.map((a) => (
            <ActionCard key={a.title} action={a} />
          ))}
        </div>
      </div>

      {/* points faibles */}
      {plan.weakPoints.length > 0 && (
        <div>
          <div className="label-caps mb-2">À revoir — tes points faibles</div>
          <div className="space-y-2">
            {plan.weakPoints.map((w) => (
              <Link
                key={w.concept}
                href={w.href}
                className="flex items-center justify-between rounded-xl bg-coral-500/8 p-3 ring-1 ring-coral-500/20 transition active:scale-[0.99] hover:bg-coral-500/12"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-abyss-100">
                  Tu as eu du mal sur <span className="font-semibold text-sail">{w.label}</span> — revois ce point.
                </span>
                <Pill tone="coral" className="ml-2 shrink-0">
                  {Math.round(w.rate * 100)}%
                </Pill>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* progression compacte */}
      <div className="card flex items-center gap-4 p-4">
        <ScoreRing value={lvlProg} size={72} stroke={8} tone="spray" label={`Niv.${level.id}`} />
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg text-sail">{level.name}</div>
          <div className="mt-1.5">
            <ProgressBar value={lvlProg} />
            <div className="mt-1 flex justify-between text-[0.65rem] text-abyss-100/60">
              <span>
                <Term term="XP" /> : {state.xp}
              </span>
              {next ? <span>{next.minXp - state.xp} avant {next.name}</span> : <span>niveau max ⚓</span>}
            </div>
          </div>
          <div className="mt-2 flex gap-2 text-[0.65rem] text-abyss-100/70">
            <span>📘 {done}/{total} leçons</span>
            <span>·</span>
            <span>🏅 {state.badges.length} badges</span>
            <span>·</span>
            <span>{Math.round(globalProgress * 100)}% parcours</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionChip({ action }: { action: CoachAction }) {
  return (
    <Link
      href={action.href}
      className="flex flex-col gap-0.5 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 transition active:scale-[0.98] hover:bg-white/10"
    >
      <span className="text-lg">{action.glyph}</span>
      <span className="text-sm font-semibold text-sail">{action.title}</span>
      <span className="text-[0.65rem] text-abyss-100/60">{action.sub}</span>
    </Link>
  );
}

function ActionCard({ action }: { action: CoachAction }) {
  return (
    <Link
      href={action.href}
      className="card flex flex-col gap-1 p-4 transition active:scale-[0.98]"
    >
      <span className="text-2xl">{action.glyph}</span>
      <span className="font-semibold text-sail">{action.title}</span>
      <span className="text-xs text-abyss-100/60">{action.sub}</span>
    </Link>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  return (
    <div
      className="flex flex-col items-center rounded-2xl bg-sun-500/10 px-3 py-2 ring-1 ring-sun-500/25"
      title="Streak (série de jours)"
    >
      <span className="text-xl">🔥</span>
      <span className="text-lg font-bold leading-none text-sun-400">{streak}</span>
      <span className="text-[0.55rem] text-sun-400/80">Streak</span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5 pt-6">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-white/5" />
      <div className="h-32 animate-pulse rounded-3xl bg-white/5" />
      <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}
