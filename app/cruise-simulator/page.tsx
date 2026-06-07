"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CRUISE_SCENARIOS, type CruiseScenario, type Choice } from "@/lib/content/scenarios";
import { useProgress } from "@/lib/progress/store";
import { Gauge, Pill } from "@/components/ui/primitives";

type Phase = "select" | "briefing" | "decision" | "followup" | "result";

export default function CruiseSimulatorPage() {
  const { bumpScore, flagAchievement, recordSession } = useProgress();
  const [phase, setPhase] = useState<Phase>("select");
  const [scenario, setScenario] = useState<CruiseScenario | null>(null);
  const [decisionGood, setDecisionGood] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);

  const start = (s: CruiseScenario) => {
    setScenario(s);
    setChoice(null);
    setPhase("briefing");
  };

  const decide = (answer: "GO" | "NO-GO") => {
    if (!scenario) return;
    const good = answer === scenario.recommended;
    setDecisionGood(good);
    if (good) {
      bumpScore("securite", 8);
      flagAchievement({ goNoGoSuccess: true });
    } else {
      bumpScore("securite", -4);
    }
    setPhase("decision");
  };

  const pickFollowUp = (c: Choice) => {
    setChoice(c);
    bumpScore("securite", c.securite ?? 0);
    if (scenario) {
      recordSession({
        kind: "cruise",
        ref: scenario.id,
        label: `Croisière · ${scenario.title}`,
        score: (decisionGood ? 0.6 : 0.2) + (c.good ? 0.4 : 0),
      });
    }
    setPhase("result");
  };

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <div className="label-caps">Simulateur</div>
        <h1 className="mt-1 font-display text-2xl text-sail">Croisière Méditerranée</h1>
        <p className="mt-1 text-sm text-abyss-100/80">
          Décide go / no-go, choisis ta route et ton mouillage comme un vrai chef de bord.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {phase === "select" && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {CRUISE_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => start(s)}
                className="card flex w-full items-center gap-3 p-4 text-left transition active:scale-[0.99]"
              >
                <RouteGlyph />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-base text-sail">{s.title}</div>
                  <div className="text-xs text-abyss-100/70">
                    {s.from} → {s.to} · {s.distanceNM} milles
                  </div>
                </div>
                <span className="text-spray-400">→</span>
              </button>
            ))}
          </motion.div>
        )}

        {phase === "briefing" && scenario && (
          <motion.div key="briefing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <RouteCard s={scenario} />
            <div className="card space-y-3 p-4">
              <Brief label="🌬️ Vent" value={scenario.conditions.wind} />
              <Brief label="🌊 Mer" value={scenario.conditions.sea} />
              <Brief label="📈 Évolution" value={scenario.conditions.evolution} />
              <Brief label="👥 Équipage" value={scenario.crew} />
              <Brief label="⚙️ Contraintes" value={scenario.constraints} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => decide("GO")} className="btn-primary py-4 text-base">
                ✅ GO
              </button>
              <button onClick={() => decide("NO-GO")} className="btn bg-coral-500 py-4 text-base text-white hover:bg-coral-400">
                ⛔ NO-GO
              </button>
            </div>
          </motion.div>
        )}

        {phase === "decision" && scenario && (
          <motion.div key="decision" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div
              className={`rounded-2xl p-4 ring-1 ${
                decisionGood ? "bg-spray-500/10 ring-spray-500/25" : "bg-coral-500/10 ring-coral-500/25"
              }`}
            >
              <div className={`mb-1 font-display text-lg ${decisionGood ? "text-spray-400" : "text-coral-400"}`}>
                {decisionGood ? "Bonne décision." : "Décision risquée."}
              </div>
              <p className="text-sm text-abyss-100">{scenario.decisionExplain}</p>
              <div className="mt-2">
                <Pill tone={scenario.recommended === "GO" ? "spray" : "coral"}>
                  Recommandation : {scenario.recommended}
                </Pill>
              </div>
            </div>
            <div className="card p-4">
              <p className="mb-3 text-sm font-semibold text-sail">{scenario.followUp.prompt}</p>
              <div className="space-y-2">
                {scenario.followUp.options.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => pickFollowUp(o)}
                    className="w-full rounded-xl bg-white/5 px-4 py-3 text-left text-sm text-sail ring-1 ring-white/10 transition active:scale-[0.99] hover:bg-white/10"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === "result" && scenario && choice && (
          <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div
              className={`rounded-2xl p-4 ring-1 ${
                choice.good ? "bg-spray-500/10 ring-spray-500/25" : "bg-sun-500/10 ring-sun-500/25"
              }`}
            >
              <div className="text-4xl">{choice.good ? "⚓" : "🤔"}</div>
              <p className="mt-2 text-sm text-abyss-100">{choice.feedback}</p>
            </div>
            <div className="card space-y-3 p-4">
              <div className="label-caps">Bilan de l'étape</div>
              <Gauge value={clamp((50 + (decisionGood ? 25 : -15) + (choice.securite ?? 0)) / 100)} label="Sécurité" tone="spray" />
              <Gauge value={clamp((50 + (choice.confort ?? 0)) / 100)} label="Confort" tone="sun" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setPhase("select")} className="btn-ghost">
                Autre scénario
              </button>
              <button onClick={() => start(scenario)} className="btn-primary">
                Rejouer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function clamp(v: number) {
  return Math.max(0.05, Math.min(1, v));
}

function Brief({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-28 shrink-0 text-xs font-semibold text-abyss-100/60">{label}</span>
      <span className="text-sm text-abyss-100">{value}</span>
    </div>
  );
}

function RouteCard({ s }: { s: CruiseScenario }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-lagoon-500/25 to-abyss-900 p-4 ring-1 ring-white/10">
      <svg viewBox="0 0 300 90" className="w-full" role="img" aria-label="Carte de route">
        <path d="M0 70 Q 80 40 150 60 T 300 50" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
        <circle cx="30" cy="64" r="6" fill="#2FE2C5" />
        <text x="30" y="84" textAnchor="middle" fontSize="9" className="fill-white/80">{s.from}</text>
        <circle cx="265" cy="52" r="6" fill="#FFB23E" />
        <text x="265" y="40" textAnchor="middle" fontSize="9" className="fill-white/80">{s.to}</text>
        <path d="M30 64 Q 150 30 265 52" fill="none" stroke="#2FE2C5" strokeWidth={2} strokeDasharray="4 4" />
      </svg>
      <div className="mt-1 flex items-center justify-between">
        <span className="font-display text-lg text-sail">{s.title}</span>
        <Pill tone="muted">{s.distanceNM} milles</Pill>
      </div>
    </div>
  );
}

function RouteGlyph() {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0">
      <circle cx="20" cy="20" r="18" fill="rgba(47,226,197,0.10)" />
      <path d="M10 26 Q 20 14 30 22" fill="none" stroke="#2FE2C5" strokeWidth={2} strokeDasharray="3 3" />
      <circle cx="10" cy="26" r="3" fill="#2FE2C5" />
      <circle cx="30" cy="22" r="3" fill="#FFB23E" />
    </svg>
  );
}
