"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WindCircle } from "@/components/svg/WindCircle";
import { adviseWind, windCategory } from "@/lib/engine/wind-trainer";
import { Pill } from "@/components/ui/primitives";

export default function WindTrainerPage() {
  const [angle, setAngle] = useState(45);
  const [knots, setKnots] = useState(18);
  const advice = adviseWind(angle, knots);
  const cat = windCategory(knots);

  const riskTone =
    advice.riskLevel === "musclé" ? "coral" : advice.riskLevel === "vigilance" ? "sun" : "spray";

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <div className="label-caps">Outil</div>
        <h1 className="mt-1 font-display text-2xl text-sail">Smart Wind Trainer</h1>
        <p className="mt-1 text-sm text-abyss-100/80">
          Place le bateau et règle la force du vent. L'app lit la situation comme un chef de bord.
        </p>
      </header>

      <div className="card p-4">
        <WindCircle angle={angle} onChange={setAngle} accentColor="#2FE2C5" />
        <div className="-mt-1 text-center text-xs text-abyss-100/70">
          Glisse le bateau · {Math.abs(angle)}° au vent
        </div>
      </div>

      {/* force du vent */}
      <div className="card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-sail">Force du vent</span>
          <span className="flex items-baseline gap-1">
            <span className="font-display text-2xl text-spray-400">{knots}</span>
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

      {/* lecture */}
      <motion.div
        key={`${advice.pos.id}-${cat}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden p-0"
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-lagoon-500/25 to-transparent p-4">
          <div>
            <div className="label-caps">Allure</div>
            <div className="font-display text-2xl text-sail">{advice.pos.name}</div>
          </div>
          <Pill tone={riskTone}>{advice.riskLevel}</Pill>
        </div>

        <div className="divide-y divide-white/5">
          <Row label="Voile" value={advice.sail} icon="🪂" />
          <Row label="Réglage" value={advice.trim} icon="🎚️" />
          <Row label="Risque" value={advice.risk} icon="⚠️" tone={riskTone} />
          <Row label="Action" value={advice.action} icon="🧭" />
        </div>
      </motion.div>

      {/* question adaptée */}
      <motion.div
        key={advice.question}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-sun-500/10 p-4 ring-1 ring-sun-500/25"
      >
        <div className="label-caps !text-sun-400/90">Question de chef de bord</div>
        <p className="mt-1 text-sm font-medium text-sun-400">{advice.question}</p>
        <p className="mt-1 text-xs text-sun-400/70">
          Pose-toi la question à voix haute. Si tu hésites, le module concerné t'attend dans le parcours.
        </p>
      </motion.div>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: string;
  tone?: "coral" | "sun" | "spray";
}) {
  const color =
    tone === "coral" ? "text-coral-400" : tone === "sun" ? "text-sun-400" : "text-abyss-100";
  return (
    <div className="flex gap-3 p-4">
      <span className="text-lg">{icon}</span>
      <div className="min-w-0">
        <div className="text-[0.62rem] font-bold uppercase tracking-wide text-abyss-100/50">{label}</div>
        <div className={`text-sm ${color}`}>{value}</div>
      </div>
    </div>
  );
}
