"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gauge } from "@/components/ui/primitives";

/**
 * Réglage de voile interactif. `sheet` 0 = bordée à fond, 100 = choquée à fond.
 * Modèle pédagogique : optimum vers 45-60 ; trop bordée = surpuissance/gîte,
 * trop choquée = faseyement = perte de vitesse.
 */
export function SailTrim() {
  const [sheet, setSheet] = useState(70);

  const optimal = 52;
  const dist = Math.abs(sheet - optimal);
  // Vitesse : cloche autour de l'optimum.
  const speed = Math.max(0.08, 1 - (dist / 48) ** 2);
  // Gîte / surpuissance : forte quand trop bordée (sheet bas).
  const heel = Math.max(0.05, Math.min(1, (60 - sheet) / 55 + 0.15));
  // Faseyement quand trop choquée (sheet haut).
  const luffing = sheet > 78;
  const overpowered = sheet < 28;

  let verdict: { text: string; tone: "spray" | "sun" | "coral" };
  if (dist <= 10) verdict = { text: "Réglage optimal : la voile tire, le bateau file à plat.", tone: "spray" };
  else if (luffing) verdict = { text: "Trop choquée : la voile faseye et ne tire plus. Borde un peu.", tone: "sun" };
  else if (overpowered) verdict = { text: "Trop bordée : surpuissance, le bateau gîte et freine. Choque.", tone: "coral" };
  else verdict = { text: "Presque ! Ajuste l'écoute pour gonfler la voile sans excès.", tone: "sun" };

  // Angle de la voile : choquée = ouverte (grand angle), bordée = serrée.
  const sailAngle = 12 + (sheet / 100) * 62;
  // Amplitude du flottement quand ça faseye.
  const flap = luffing ? 6 : 0.5;

  return (
    <div>
      <svg viewBox="0 0 220 200" className="mx-auto w-full max-w-[300px]" role="img" aria-label="Voile en cours de réglage">
        {/* mât */}
        <line x1="60" y1="20" x2="60" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth={4} strokeLinecap="round" />
        {/* indication vent */}
        <g opacity={0.6}>
          <line x1="14" y1="40" x2="44" y2="40" stroke="#2FE2C5" strokeWidth={2} strokeLinecap="round" />
          <path d="M38 35 L44 40 L38 45" fill="none" stroke="#2FE2C5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <text x="14" y="30" fontSize="9" fontWeight="700" className="fill-spray-400">VENT</text>
        </g>

        {/* voile (triangle déformable) */}
        <motion.path
          animate={{
            d: `M60 24 Q ${60 + Math.cos((sailAngle * Math.PI) / 180) * 120 + flap} ${100 - flap}, ${
              60 + Math.cos((sailAngle * Math.PI) / 180) * 100
            } 176 L60 176 Z`,
          }}
          transition={luffing ? { duration: 0.25, repeat: Infinity, repeatType: "reverse" } : { type: "spring", stiffness: 80, damping: 14 }}
          fill={verdict.tone === "spray" ? "rgba(47,226,197,0.22)" : verdict.tone === "coral" ? "rgba(255,107,94,0.22)" : "rgba(255,178,62,0.22)"}
          stroke={verdict.tone === "spray" ? "#2FE2C5" : verdict.tone === "coral" ? "#FF6B5E" : "#FFB23E"}
          strokeWidth={2}
        />
        {/* bôme */}
        <line
          x1="60"
          y1="176"
          x2={60 + Math.cos((sailAngle * Math.PI) / 180) * 100}
          y2="176"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>

      <div className="mt-2 px-1">
        <input
          type="range"
          min={0}
          max={100}
          value={sheet}
          onChange={(e) => setSheet(Number(e.target.value))}
          className="h-7 w-full cursor-pointer appearance-none rounded-full bg-transparent
            [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full
            [&::-webkit-slider-runnable-track]:bg-white/15
            [&::-webkit-slider-thumb]:mt-[-9px] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-spray-500 [&::-webkit-slider-thumb]:shadow-glow
            [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-spray-500"
          aria-label="Écoute de voile"
        />
        <div className="flex justify-between text-[0.65rem] font-semibold text-abyss-100/70">
          <span>← Border</span>
          <span>Choquer →</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Gauge value={speed} label="Vitesse" tone="spray" />
        <Gauge value={heel} label="Gîte" tone={heel > 0.7 ? "coral" : "sun"} />
      </div>

      <motion.div
        key={verdict.text}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-3 rounded-xl p-3 text-sm ring-1 ${
          verdict.tone === "spray"
            ? "bg-spray-500/10 text-spray-400 ring-spray-500/25"
            : verdict.tone === "coral"
              ? "bg-coral-500/10 text-coral-400 ring-coral-500/25"
              : "bg-sun-500/10 text-sun-400 ring-sun-500/25"
        }`}
      >
        {verdict.text}
      </motion.div>
    </div>
  );
}
