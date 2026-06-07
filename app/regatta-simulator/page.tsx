"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REGATTA_STEPS } from "@/lib/content/scenarios";
import { useProgress } from "@/lib/progress/store";
import { Pill } from "@/components/ui/primitives";

const FLEET = 8;
const START_PLACE = 5;

export default function RegattaSimulatorPage() {
  const { bumpScore, flagAchievement } = useProgress();
  const [started, setStarted] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [place, setPlace] = useState(START_PLACE);
  const [lastFeedback, setLastFeedback] = useState<{ text: string; places: number } | null>(null);
  const [done, setDone] = useState(false);
  const [gained, setGained] = useState(false);

  const step = REGATTA_STEPS[stepIdx];

  const reset = () => {
    setStarted(true);
    setStepIdx(0);
    setPlace(START_PLACE);
    setLastFeedback(null);
    setDone(false);
    setGained(false);
  };

  const choose = (places: number, feedback: string) => {
    if (lastFeedback) return;
    // Gagner des places = remonter au classement (place diminue).
    const newPlace = Math.max(1, Math.min(FLEET, place - places));
    setPlace(newPlace);
    setLastFeedback({ text: feedback, places });
    if (places > 0) {
      bumpScore("regate", places * 4);
      setGained(true);
      flagAchievement({ regattaPlaceGained: true });
    } else if (places < 0) {
      bumpScore("regate", places * 2);
    }
  };

  const next = () => {
    setLastFeedback(null);
    if (stepIdx + 1 >= REGATTA_STEPS.length) {
      setDone(true);
    } else {
      setStepIdx((i) => i + 1);
    }
  };

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <div className="label-caps">Simulateur</div>
        <h1 className="mt-1 font-display text-2xl text-sail">Régate avec Bertrand</h1>
        <p className="mt-1 text-sm text-abyss-100/80">
          Chaque choix tactique te fait gagner ou perdre des places. Sois lucide.
        </p>
      </header>

      {!started ? (
        <div className="card p-5 text-center">
          <div className="text-5xl">🏁</div>
          <h2 className="mt-3 font-display text-xl text-sail">Briefing de Bertrand</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm text-abyss-100/80">
            « On part {ordinal(START_PLACE)} sur {FLEET}. Cinq décisions, du départ au passage de bouée.
            Garde la tête froide, lis le plan d'eau, et on remonte. »
          </p>
          <button onClick={reset} className="btn-primary mt-5 w-full">
            Lancer la régate
          </button>
        </div>
      ) : done ? (
        <ResultScreen place={place} gained={gained} onReplay={reset} />
      ) : (
        <>
          <RaceTrack place={place} stepIdx={stepIdx} />

          <div className="flex items-center justify-between rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
            <span className="text-sm text-abyss-100/80">Étape {stepIdx + 1}/{REGATTA_STEPS.length}</span>
            <Pill tone={place <= START_PLACE ? "spray" : "coral"}>
              {ordinal(place)} sur {FLEET}
            </Pill>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="label-caps mb-1">{step.phase}</div>
              <p className="mb-4 text-sm leading-relaxed text-abyss-100">{step.situation}</p>

              {!lastFeedback ? (
                <div className="space-y-2">
                  {step.options.map((o, i) => (
                    <button
                      key={i}
                      onClick={() => choose(o.places, o.feedback)}
                      className="w-full rounded-xl bg-white/5 px-4 py-3.5 text-left text-sm font-medium text-sail ring-1 ring-white/10 transition active:scale-[0.99] hover:bg-white/10"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div
                    className={`rounded-2xl p-4 ring-1 ${
                      lastFeedback.places > 0
                        ? "bg-spray-500/10 ring-spray-500/25"
                        : lastFeedback.places < 0
                          ? "bg-coral-500/10 ring-coral-500/25"
                          : "bg-white/5 ring-white/10"
                    }`}
                  >
                    <div
                      className={`mb-1 font-bold ${
                        lastFeedback.places > 0
                          ? "text-spray-400"
                          : lastFeedback.places < 0
                            ? "text-coral-400"
                            : "text-abyss-100"
                      }`}
                    >
                      {lastFeedback.places > 0
                        ? `+${lastFeedback.places} place${lastFeedback.places > 1 ? "s" : ""} 🎉`
                        : lastFeedback.places < 0
                          ? `${lastFeedback.places} place${lastFeedback.places < -1 ? "s" : ""} 😬`
                          : "Statu quo"}
                    </div>
                    <p className="text-sm text-abyss-100">{lastFeedback.text}</p>
                  </div>
                  <button onClick={next} className="btn-primary mt-3 w-full">
                    {stepIdx + 1 >= REGATTA_STEPS.length ? "Voir l'arrivée" : "Suite"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function ordinal(n: number) {
  return n === 1 ? "1er" : `${n}e`;
}

function RaceTrack({ place, stepIdx }: { place: number; stepIdx: number }) {
  // progression horizontale selon l'étape, verticale selon la place.
  const x = 20 + (stepIdx / (REGATTA_STEPS.length - 1)) * 250;
  const y = 20 + ((place - 1) / (FLEET - 1)) * 70;
  return (
    <div className="card p-3">
      <svg viewBox="0 0 300 110" className="w-full" role="img" aria-label="Plan d'eau de la régate">
        {/* ligne de départ */}
        <line x1="20" y1="8" x2="20" y2="102" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
        <text x="20" y="6" fontSize="7" className="fill-white/40">DÉPART</text>
        {/* bouée au vent */}
        <circle cx="278" cy="20" r="5" fill="#FFB23E" />
        <text x="278" y="14" textAnchor="middle" fontSize="7" className="fill-sun-400">BOUÉE</text>

        {/* concurrents fantômes */}
        {Array.from({ length: FLEET }).map((_, i) => (
          <circle key={i} cx={40 + i * 12} cy={30 + ((i * 9) % 60)} r="3" fill="rgba(255,255,255,0.18)" />
        ))}

        {/* ton bateau */}
        <motion.g animate={{ x, y }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
          <path d="M0 -7 L4 6 L-4 6 Z" fill="#2FE2C5" stroke="#0B1B2B" strokeWidth={0.5} />
        </motion.g>
      </svg>
    </div>
  );
}

function ResultScreen({ place, gained, onReplay }: { place: number; gained: boolean; onReplay: () => void }) {
  const delta = START_PLACE - place;
  const podium = place <= 3;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5 text-center">
      <div className="text-5xl">{podium ? "🏆" : delta > 0 ? "📈" : "🚩"}</div>
      <h2 className="mt-3 font-display text-2xl text-sail">{ordinal(place)} sur {FLEET}</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm text-abyss-100/80">
        {podium
          ? "Podium ! Bertrand est impressionné. Tu as lu le plan d'eau comme un régatier."
          : delta > 0
            ? `Tu remontes de ${delta} place${delta > 1 ? "s" : ""}. Solide pour un équipier qui débute en régate.`
            : "Régate compliquée. Reprends : les priorités et les bascules font toute la différence."}
      </p>
      {gained && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-spray-500/15 px-4 py-1.5 ring-1 ring-spray-500/30">
          <span>🏁</span>
          <span className="text-sm font-semibold text-spray-400">Score régate en hausse</span>
        </div>
      )}
      <button onClick={onReplay} className="btn-primary mt-5 w-full">
        Refaire la régate
      </button>
    </motion.div>
  );
}
