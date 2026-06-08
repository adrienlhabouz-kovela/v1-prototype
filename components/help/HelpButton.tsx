"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HelpTier } from "@/lib/engine/help";

const TONE: Record<HelpTier["kind"], string> = {
  hint: "bg-sun-500/10 ring-sun-500/25 text-sun-400",
  explanation: "bg-lagoon-400/10 ring-lagoon-400/25 text-lagoon-300",
  answer: "bg-spray-500/12 ring-spray-500/30 text-spray-400",
};

/**
 * Bouton « Aide » toujours disponible. Dévoile l'aide par paliers, sans quitter
 * l'exercice : indices → explication → réponse (en dernier recours).
 * `onUse` est appelé une fois, à la première demande d'aide (pour les stats).
 */
export function HelpButton({
  tiers,
  onUse,
  className = "",
}: {
  tiers: HelpTier[];
  onUse?: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  // Nombre de paliers révélés (0 = aucun).
  const [revealed, setRevealed] = useState(0);
  const used = useRef(false);

  const firstUse = () => {
    if (used.current) return;
    used.current = true;
    onUse?.();
  };

  const openHelp = () => {
    setOpen(true);
    if (revealed === 0) {
      setRevealed(1);
      firstUse();
    }
  };

  const nextLabel =
    revealed >= tiers.length
      ? null
      : tiers[revealed].kind === "answer"
        ? "Voir la réponse"
        : tiers[revealed].kind === "explanation"
          ? "Voir l'explication"
          : revealed === 0
            ? "Voir un indice"
            : "Encore un indice";

  if (!open) {
    return (
      <button
        type="button"
        onClick={openHelp}
        className={`inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-abyss-100/80 ring-1 ring-white/10 transition active:scale-95 hover:text-sun-400 ${className}`}
      >
        <span aria-hidden>🛟</span> Aide
      </button>
    );
  }

  return (
    <div className={`rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/10 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="label-caps !text-sun-400/90">🛟 Aide</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-abyss-100/50 hover:text-abyss-100"
        >
          Fermer
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {tiers.slice(0, revealed).map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-3 ring-1 ${TONE[tier.kind]}`}
            >
              <div className="mb-0.5 text-[0.62rem] font-bold uppercase tracking-wide opacity-80">
                {tier.label}
              </div>
              <p className="text-sm leading-relaxed text-abyss-100">{tier.body}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {nextLabel ? (
        <button
          type="button"
          onClick={() => setRevealed((r) => Math.min(tiers.length, r + 1))}
          className="btn-ghost mt-3 w-full text-sm"
        >
          {nextLabel} →
        </button>
      ) : (
        <p className="mt-3 text-center text-[0.7rem] text-abyss-100/40">
          Tu as toute l'aide. À toi de jouer 💪
        </p>
      )}
    </div>
  );
}
