"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WindCircle } from "@/components/svg/WindCircle";
import { pointOfSailForAngle } from "@/lib/engine/points-of-sail";
import { Pill } from "@/components/ui/primitives";

/** Bloc d'exploration des allures : on déplace le bateau, l'app décrit l'allure. */
export function PointsOfSailExplorer() {
  const [angle, setAngle] = useState(75);
  const pos = pointOfSailForAngle(angle);
  const tack = angle === 0 ? "" : angle > 0 ? "tribord amures" : "bâbord amures";

  return (
    <div>
      <WindCircle angle={angle} onChange={setAngle} accentColor="#2FE2C5" />

      <div className="-mt-2 text-center text-xs text-abyss-100/70">
        Fais glisser le bateau autour du vent
      </div>

      <motion.div
        key={pos.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="font-display text-xl text-spray-400">{pos.name}</div>
          <div className="text-right text-xs text-abyss-100/70">
            <div className="tabular-nums">{Math.abs(angle)}° au vent</div>
            {tack && <div>{tack}</div>}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <Info label="Vitesse" value={pos.speed} />
          <Info label="Voile" value={pos.sails} />
          <Info label="Barreur" value={pos.helm} />
          <Info label="Erreur fréquente" value={pos.commonError} tone="coral" />
        </div>
      </motion.div>
    </div>
  );
}

function Info({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "coral";
}) {
  return (
    <div className="rounded-lg bg-white/[0.03] p-2">
      <div className="mb-0.5">
        <Pill tone={tone === "coral" ? "coral" : "muted"} className="!px-2 !py-0.5 !text-[0.6rem]">
          {label}
        </Pill>
      </div>
      <div className="text-abyss-100">{value}</div>
    </div>
  );
}
