"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WindCircle } from "@/components/svg/WindCircle";
import { adviseWind, windCategory } from "@/lib/engine/wind-trainer";
import { useProgress } from "@/lib/progress/store";
import { HelpButton } from "@/components/help/HelpButton";
import type { HelpTier } from "@/lib/engine/help";
import { Pill } from "@/components/ui/primitives";
import { Term } from "@/components/ui/Term";

export default function WindTrainerPage() {
  const { recordHelp } = useProgress();
  const [angle, setAngle] = useState(45);
  const [knots, setKnots] = useState(18);
  const advice = adviseWind(angle, knots);
  const cat = windCategory(knots);

  const riskTone =
    advice.riskLevel === "musclé" ? "coral" : advice.riskLevel === "vigilance" ? "sun" : "spray";

  const helpTiers: HelpTier[] = [
    { kind: "hint", label: "Indice 1", body: "L'angle au vent donne l'allure ; la force du vent donne le niveau de risque." },
    { kind: "hint", label: "Indice 2", body: "Plus l'allure s'ouvre, plus on choque la voile ; quand ça forcit, on réduit la toile." },
    { kind: "explanation", label: "Explication", body: `${advice.pos.name} : ${advice.trim}` },
    { kind: "answer", label: "La lecture", body: `${advice.sail} — ${advice.action}` },
  ];

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="label-caps">Outil</div>
            <h1 className="mt-1 font-display text-2xl text-sail">
              <Term term="Smart Wind Trainer" />
            </h1>
          </div>
          <HelpButton tiers={helpTiers} onUse={() => recordHelp("lecture-vent")} />
        </div>
      </header>

      {/* contrôles : angle (rose) + grand affichage de l'angle */}
      <div className="card p-4">
        <WindCircle angle={angle} onChange={setAngle} accentColor="#2FE2C5" />
        <div className="-mt-1 flex items-center justify-center gap-2 text-center">
          <span className="font-display text-3xl text-spray-400 tabular-nums">{Math.abs(angle)}°</span>
          <span className="text-xs text-abyss-100/70">au vent · glisse le bateau</span>
        </div>
      </div>

      {/* force du vent */}
      <div className="card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-sail">Force du vent</span>
          <span className="flex items-baseline gap-1">
            <span className="font-display text-2xl text-spray-400 tabular-nums">{knots}</span>
            <span className="text-xs text-abyss-100/70">nœuds · {cat}</span>
          </span>
        </div>
        <input
          type="range"
          min={3}
          max={40}
          value={knots}
          onChange={(e) => setKnots(Number(e.target.value))}
          className="h-7 w-full cursor-pointer appearance-none rounded-full bg-transparent
            [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/15
            [&::-webkit-slider-thumb]:mt-[-9px] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-spray-500 [&::-webkit-slider-thumb]:shadow-glow
            [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-spray-500"
          aria-label="Force du vent en nœuds"
        />
        <div className="flex justify-between text-[0.62rem] font-semibold text-abyss-100/60">
          <span>Léger</span>
          <span>Établi</span>
          <span>Frais</span>
          <span>Fort</span>
        </div>
      </div>

      {/* HÉRO : allure mise en avant */}
      <motion.div
        key={advice.pos.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl bg-gradient-to-br from-lagoon-500/30 via-abyss-800 to-abyss-900 p-5 ring-1 ring-white/10 shadow-card"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="label-caps">Allure</div>
            <div className="mt-1 font-display text-3xl text-sail">{advice.pos.name}</div>
          </div>
          <div className="text-right">
            <Pill tone={riskTone}>{advice.riskLevel}</Pill>
            <div className="mt-1.5 text-[0.65rem] uppercase tracking-wide text-abyss-100/60">
              Vitesse : {advice.pos.speed}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-abyss-100/85">{advice.pos.helm}</p>
      </motion.div>

      {/* voile recommandée — carte dédiée */}
      <div className="card flex items-start gap-4 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-spray-500/12 text-2xl">
          🪂
        </span>
        <div className="min-w-0">
          <div className="label-caps">Voile recommandée</div>
          <p className="mt-1 text-base font-semibold leading-snug text-sail">{advice.sail}</p>
          <p className="mt-1 text-xs text-abyss-100/70">Réglage : {advice.trim}</p>
        </div>
      </div>

      {/* décision de skipper — risque + action */}
      <div
        className={`overflow-hidden rounded-2xl ring-1 ${
          riskTone === "coral"
            ? "bg-coral-500/10 ring-coral-500/30"
            : riskTone === "sun"
              ? "bg-sun-500/10 ring-sun-500/30"
              : "bg-spray-500/10 ring-spray-500/25"
        }`}
      >
        <div className="flex items-center gap-2 px-4 pt-3">
          <span className="text-lg">🧭</span>
          <span className="label-caps">Décision de skipper</span>
        </div>
        <div className="space-y-3 p-4 pt-2">
          <div>
            <div className="text-[0.62rem] font-bold uppercase tracking-wide text-abyss-100/50">
              ⚠️ Risque
            </div>
            <p className="text-sm text-abyss-100">{advice.risk}</p>
          </div>
          <div
            className={`rounded-xl p-3 ${
              riskTone === "coral"
                ? "bg-coral-500/15"
                : riskTone === "sun"
                  ? "bg-sun-500/15"
                  : "bg-spray-500/15"
            }`}
          >
            <div className="text-[0.62rem] font-bold uppercase tracking-wide text-abyss-100/60">
              👉 Action
            </div>
            <p
              className={`text-sm font-semibold ${
                riskTone === "coral" ? "text-coral-400" : riskTone === "sun" ? "text-sun-400" : "text-spray-400"
              }`}
            >
              {advice.action}
            </p>
          </div>
        </div>
      </div>

      {/* question de chef de bord */}
      <motion.div
        key={advice.question}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10"
      >
        <div className="label-caps">Question de chef de bord</div>
        <p className="mt-1 text-sm font-medium text-sail">{advice.question}</p>
        <p className="mt-1 text-xs text-abyss-100/60">
          Pose-toi la question à voix haute. Si tu hésites, le module concerné t'attend dans le parcours.
        </p>
      </motion.div>
    </div>
  );
}
