"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useProgress } from "@/lib/progress/store";
import { levelForXp, nextLevelFor, levelProgress, LEVELS } from "@/lib/content/levels";
import { BADGES } from "@/lib/content/badges";
import { ALL_LESSONS, conceptLabel } from "@/lib/content/modules";
import { weakestConcepts } from "@/lib/engine/adaptive";
import { ProgressBar, ScoreRing, Gauge, Pill } from "@/components/ui/primitives";
import type { TrainingSession } from "@/lib/types";

export default function ProgressPage() {
  const { state, ready, tuning } = useProgress();

  if (!ready) return <div className="pt-10 text-center text-abyss-100/60">Chargement…</div>;

  const level = levelForXp(state.xp);
  const next = nextLevelFor(state.xp);
  const errors = weakestConcepts(state, 5);
  const unlocked = new Set(state.badges);
  const history = [...state.trainingHistory].reverse().slice(0, 8);

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <div className="label-caps">Progression</div>
        <h1 className="mt-1 font-display text-2xl text-sail">Ton carnet de bord</h1>
      </header>

      {/* niveau */}
      <div className="card flex items-center gap-4 p-5">
        <ScoreRing value={levelProgress(state.xp)} size={88} stroke={9} tone="spray" label={`Niv.${level.id}`} />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl text-sail">{level.name}</h2>
          <p className="text-xs text-abyss-100/70">{level.tagline}</p>
          <div className="mt-2">
            <ProgressBar value={levelProgress(state.xp)} />
            <div className="mt-1 text-[0.65rem] text-abyss-100/60">
              {state.xp} XP{next ? ` · ${next.minXp - state.xp} XP avant ${next.name}` : " · niveau max ⚓"}
            </div>
          </div>
        </div>
      </div>

      {/* échelle des niveaux */}
      <div>
        <div className="label-caps mb-2">Les grades</div>
        <div className="space-y-1.5">
          {LEVELS.map((l) => {
            const reached = state.xp >= l.minXp;
            const current = l.id === level.id;
            return (
              <div
                key={l.id}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 ring-1 ${
                  current ? "bg-spray-500/12 ring-spray-500/30" : reached ? "bg-white/5 ring-white/10" : "bg-white/[0.02] ring-white/5"
                }`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${reached ? "bg-spray-500 text-abyss-950" : "bg-white/10 text-abyss-100/50"}`}>
                  {l.id}
                </span>
                <span className={`flex-1 text-sm ${reached ? "text-sail" : "text-abyss-100/40"}`}>{l.name}</span>
                {current && <Pill tone="spray" className="!py-0.5 !text-[0.6rem]">Actuel</Pill>}
                {!reached && <span className="text-[0.65rem] text-abyss-100/40">{l.minXp} XP</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* scores thématiques */}
      <div className="card space-y-3 p-4">
        <div className="label-caps">Tes scores</div>
        <Gauge value={state.scores.securite / 100} label="🦺 Sécurité" tone="spray" />
        <Gauge value={state.scores.meteo / 100} label="🌦️ Météo" tone="sun" />
        <Gauge value={state.scores.manoeuvres / 100} label="🔄 Manœuvres" tone="spray" />
        <Gauge value={state.scores.regate / 100} label="🏁 Régate" tone="sun" />
        <p className="text-[0.7rem] text-abyss-100/50">
          Ces scores montent dans les simulateurs et les modules. Lance une croisière ou une régate pour les faire grimper.
        </p>
      </div>

      {/* badges */}
      <div>
        <div className="label-caps mb-2">Badges · {unlocked.size}/{BADGES.length}</div>
        <div className="grid grid-cols-3 gap-2.5">
          {BADGES.map((b, i) => {
            const has = unlocked.has(b.id);
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`flex flex-col items-center rounded-2xl p-3 text-center ring-1 ${
                  has ? "bg-sun-500/10 ring-sun-500/25" : "bg-white/[0.02] ring-white/8"
                }`}
                title={has ? b.description : b.hint}
              >
                <span className={`text-2xl ${has ? "" : "opacity-30 grayscale"}`}>{b.glyph}</span>
                <span className={`mt-1 text-[0.62rem] font-semibold leading-tight ${has ? "text-sun-400" : "text-abyss-100/40"}`}>
                  {b.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* points faibles */}
      {errors.length > 0 && (
        <div>
          <div className="label-caps mb-2">Notions à consolider</div>
          <div className="space-y-2">
            {errors.map((e) => (
              <div key={e.concept} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm text-sail">{conceptLabel(e.concept)}</span>
                  <span className="text-xs text-abyss-100/60">{Math.round(e.rate * 100)}%</span>
                </div>
                <ProgressBar value={e.rate} tone={e.rate < 0.5 ? "sun" : "spray"} />
              </div>
            ))}
          </div>
          {!tuning.hideJargon && (
            <p className="mt-2 text-[0.7rem] text-abyss-100/50">
              Le moteur de tests te reposera ces notions en priorité, et plus souvent tant qu'elles ne sont pas acquises (répétition espacée).
            </p>
          )}
        </div>
      )}

      {/* historique d'entraînement */}
      {history.length > 0 && (
        <div>
          <div className="label-caps mb-2">Historique d'entraînement</div>
          <div className="space-y-2">
            {history.map((s, i) => (
              <TrainingRow key={`${s.at}-${i}`} session={s} />
            ))}
          </div>
        </div>
      )}

      {/* stats globales */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/5 p-4 text-center ring-1 ring-white/10">
          <div className="font-display text-2xl text-sail">
            {state.completedLessons.length}/{ALL_LESSONS.length}
          </div>
          <div className="text-[0.65rem] uppercase tracking-wide text-abyss-100/60">Leçons validées</div>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 text-center ring-1 ring-white/10">
          <div className="font-display text-2xl text-sun-400">🔥 {state.streak}</div>
          <div className="text-[0.65rem] uppercase tracking-wide text-abyss-100/60">Jours de série</div>
        </div>
      </div>

      {/* paramètres */}
      <div className="pt-2 text-center">
        <Link href="/settings" className="text-xs text-abyss-100/40 hover:text-spray-400">
          Paramètres du profil
        </Link>
      </div>
    </div>
  );
}

function TrainingRow({ session }: { session: TrainingSession }) {
  const glyph =
    session.kind === "lesson"
      ? "📘"
      : session.kind === "cruise"
        ? "⚓"
        : session.kind === "regatta"
          ? "🏁"
          : "🌬️";
  const pct = session.score != null ? Math.round(session.score * 100) : null;
  const tone = pct == null ? "muted" : pct >= 80 ? "spray" : pct >= 50 ? "sun" : "coral";
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
      <span className="text-lg">{glyph}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm text-sail">{session.label}</div>
        <div className="text-[0.65rem] text-abyss-100/50">
          {formatDay(session.day)}
          {session.xpGained ? ` · +${session.xpGained} XP` : ""}
        </div>
      </div>
      {pct != null && <Pill tone={tone}>{pct}%</Pill>}
    </div>
  );
}

function formatDay(day: string): string {
  const today = new Date().toISOString().slice(0, 10);
  if (day === today) return "Aujourd'hui";
  const d = new Date(day + "T00:00:00");
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
