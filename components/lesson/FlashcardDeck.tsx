"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Flashcard } from "@/lib/types";

export function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[i];

  const go = (dir: 1 | -1) => {
    setFlipped(false);
    setI((v) => (v + dir + cards.length) % cards.length);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-abyss-100/70">
        <span className="font-semibold">
          Carte {i + 1} / {cards.length}
        </span>
        <span>Touche pour retourner</span>
      </div>

      <div className="relative h-48" style={{ perspective: 1200 }}>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="relative h-full w-full focus-ring rounded-2xl"
          aria-label="Retourner la carte"
        >
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* recto */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-lagoon-500/30 to-abyss-800 p-5 ring-1 ring-white/10"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="font-display text-2xl text-sail">{card.front}</div>
              {card.hint && (
                <div className="mt-2 text-xs text-spray-400">💡 {card.hint}</div>
              )}
            </div>
            {/* verso */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-2xl bg-sail p-5 text-center ring-1 ring-white/10"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <p className="text-sm font-medium leading-relaxed text-abyss-900">
                {card.back}
              </p>
            </div>
          </motion.div>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button onClick={() => go(-1)} className="btn-ghost px-4 py-2 text-sm">
          ← Préc.
        </button>
        <div className="flex gap-1.5">
          {cards.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-5 bg-spray-400" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
        <button onClick={() => go(1)} className="btn-ghost px-4 py-2 text-sm">
          Suiv. →
        </button>
      </div>
    </div>
  );
}
