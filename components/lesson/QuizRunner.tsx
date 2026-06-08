"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Question } from "@/lib/types";
import { useProgress } from "@/lib/progress/store";
import { prioritizeQuestions } from "@/lib/engine/adaptive";
import { buildQuestionHelp } from "@/lib/engine/help";
import { HelpButton } from "@/components/help/HelpButton";
import { BoatTopView } from "@/components/svg/BoatTopView";
import { WindCircle } from "@/components/svg/WindCircle";
import { pointOfSailForAngle } from "@/lib/engine/points-of-sail";

const ENCOURAGE = [
  "Bonne réponse. Là, tu commences à parler bateau.",
  "Exact. À ce rythme, tu seras vite utile à bord.",
  "Pile. Bertrand n'aura rien à redire.",
  "Bien vu. Ce réflexe-là sauve des manœuvres.",
];
const CONSOLE = [
  "Pas grave. Tout le monde se trompe au début — le tout, c'est de ne pas le faire au ponton.",
  "Raté, mais c'est comme ça qu'on apprend. Relis l'explication, ça rentre.",
  "Presque. Cette notion mérite un deuxième passage, on la reverra.",
];
// Variante enfant : plus courte, plus enthousiaste.
const ENCOURAGE_KID = [
  "Super ! 🎉",
  "Trop fort ! ⭐",
  "Bravo, exact ! 🐬",
  "Bien joué, marin ! ⛵",
];
const CONSOLE_KID = [
  "Presque ! Regarde l'astuce 👀",
  "Pas grave, on apprend en essayant 💪",
  "Encore un essai et c'est bon 🚀",
];

function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function QuizRunner({
  questions,
  onComplete,
}: {
  questions: Question[];
  onComplete: (score: number) => void;
}) {
  const { state, answerConcept, recordHelp, tuning } = useProgress();
  const kid = tuning.extraPositiveFeedback;
  // Ordonne selon le moteur adaptatif (concepts fragiles / dus en premier).
  const ordered = useMemo(
    () => prioritizeQuestions(questions, state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null); // correct?
  const [correctCount, setCorrectCount] = useState(0);
  const q = ordered[idx];

  const submit = (correct: boolean) => {
    if (answered !== null) return;
    setAnswered(correct);
    answerConcept(q.concept, correct);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (idx + 1 >= ordered.length) {
      onComplete(correctCount / ordered.length);
    } else {
      setIdx((i) => i + 1);
      setAnswered(null);
    }
  };

  return (
    <div>
      {/* progression du quiz */}
      <div className="mb-4 flex items-center gap-1.5">
        {ordered.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < idx ? "bg-spray-400" : i === idx ? "bg-spray-400/60" : "bg-white/12"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="mb-4 font-display text-lg leading-snug text-sail">{q.prompt}</h3>

          <QuestionBody q={q} answered={answered} onSubmit={submit} />

          {/* aide contextuelle — toujours disponible avant de répondre */}
          {answered === null && (
            <div className="mt-4">
              <HelpButton
                tiers={buildQuestionHelp(q)}
                onUse={() => recordHelp(q.concept)}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* feedback */}
      <AnimatePresence>
        {answered !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 overflow-hidden"
          >
            <div
              className={`rounded-2xl p-4 ring-1 ${
                answered
                  ? "bg-spray-500/10 ring-spray-500/25"
                  : "bg-coral-500/10 ring-coral-500/25"
              }`}
            >
              <div className={`mb-1 text-sm font-bold ${answered ? "text-spray-400" : "text-coral-400"}`}>
                {answered
                  ? pick(kid ? ENCOURAGE_KID : ENCOURAGE)
                  : pick(kid ? CONSOLE_KID : CONSOLE)}
              </div>
              <p className="text-sm text-abyss-100">{q.explanation}</p>
            </div>
            <button onClick={next} className="btn-primary mt-3 w-full">
              {idx + 1 >= ordered.length ? "Voir mon résultat" : "Continuer"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Rendu d'une question selon son type ──────────────────────────────────

function QuestionBody({
  q,
  answered,
  onSubmit,
}: {
  q: Question;
  answered: boolean | null;
  onSubmit: (correct: boolean) => void;
}) {
  switch (q.kind) {
    case "qcm":
    case "chooseSail":
    case "chooseManeuver":
    case "goNoGo":
      return <ChoiceQuestion q={q} answered={answered} onSubmit={onSubmit} />;
    case "trueFalse":
      return <TrueFalseQuestion q={q} answered={answered} onSubmit={onSubmit} />;
    case "clickZone":
      return <ClickZoneQuestion q={q} answered={answered} onSubmit={onSubmit} />;
    case "windAngle":
      return <WindAngleQuestion q={q} answered={answered} onSubmit={onSubmit} />;
    case "orderSteps":
      return <OrderStepsQuestion q={q} answered={answered} onSubmit={onSubmit} />;
    default:
      return null;
  }
}

function ChoiceQuestion({
  q,
  answered,
  onSubmit,
}: {
  q: Question;
  answered: boolean | null;
  onSubmit: (c: boolean) => void;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const correct = q.correct as number;
  return (
    <div className="space-y-2">
      {(q.options ?? []).map((opt, i) => {
        const isChosen = chosen === i;
        const reveal = answered !== null;
        let cls = "bg-white/5 ring-white/10 text-sail";
        if (reveal && i === correct) cls = "bg-spray-500/15 ring-spray-500/40 text-spray-400";
        else if (reveal && isChosen) cls = "bg-coral-500/15 ring-coral-500/40 text-coral-400";
        else if (isChosen) cls = "bg-spray-500/15 ring-spray-500/40";
        return (
          <button
            key={i}
            disabled={answered !== null}
            onClick={() => {
              setChosen(i);
              onSubmit(i === correct);
            }}
            className={`w-full rounded-xl px-4 py-3.5 text-left text-sm font-medium ring-1 transition-all active:scale-[0.99] ${cls}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function TrueFalseQuestion({
  q,
  answered,
  onSubmit,
}: {
  q: Question;
  answered: boolean | null;
  onSubmit: (c: boolean) => void;
}) {
  const [chosen, setChosen] = useState<boolean | null>(null);
  const options: { label: string; val: boolean }[] = [
    { label: "Vrai", val: true },
    { label: "Faux", val: false },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((o) => {
        const reveal = answered !== null;
        const isChosen = chosen === o.val;
        let cls = "bg-white/5 ring-white/10 text-sail";
        if (reveal && o.val === q.answer) cls = "bg-spray-500/15 ring-spray-500/40 text-spray-400";
        else if (reveal && isChosen) cls = "bg-coral-500/15 ring-coral-500/40 text-coral-400";
        return (
          <button
            key={o.label}
            disabled={answered !== null}
            onClick={() => {
              setChosen(o.val);
              onSubmit(o.val === q.answer);
            }}
            className={`rounded-xl px-4 py-5 text-center text-base font-bold ring-1 transition-all active:scale-[0.98] ${cls}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ClickZoneQuestion({
  q,
  answered,
  onSubmit,
}: {
  q: Question;
  answered: boolean | null;
  onSubmit: (c: boolean) => void;
}) {
  const [feedback, setFeedback] = useState<{ id: string; status: "correct" | "wrong" } | null>(null);
  return (
    <BoatTopView
      mode="quiz"
      highlightId={answered !== null ? (q.target as string) : null}
      feedback={feedback}
      onPick={(id) => {
        if (answered !== null) return;
        const ok = id === q.target;
        setFeedback({ id, status: ok ? "correct" : "wrong" });
        onSubmit(ok);
      }}
    />
  );
}

function WindAngleQuestion({
  q,
  answered,
  onSubmit,
}: {
  q: Question;
  answered: boolean | null;
  onSubmit: (c: boolean) => void;
}) {
  const [angle, setAngle] = useState(75);
  const pos = pointOfSailForAngle(angle);
  const tol = q.tolerance ?? 15;
  return (
    <div>
      <WindCircle angle={angle} onChange={answered === null ? setAngle : undefined} />
      <div className="-mt-2 mb-3 text-center text-xs text-abyss-100/70">
        {Math.abs(angle)}° au vent · {pos.name}
      </div>
      {answered === null && (
        <button
          onClick={() => onSubmit(Math.abs(Math.abs(angle) - (q.target as number)) <= tol)}
          className="btn-primary w-full"
        >
          Valider la position
        </button>
      )}
    </div>
  );
}

function OrderStepsQuestion({
  q,
  answered,
  onSubmit,
}: {
  q: Question;
  answered: boolean | null;
  onSubmit: (c: boolean) => void;
}) {
  const correctOrder = q.steps ?? [];
  // Mélange stable pour l'affichage.
  const shuffled = useMemo(() => {
    const arr = correctOrder.map((s, i) => ({ s, i }));
    for (let k = arr.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [arr[k], arr[j]] = [arr[j], arr[k]];
    }
    // Évite l'ordre déjà correct.
    if (arr.every((x, k) => x.i === k) && arr.length > 1) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [picked, setPicked] = useState<number[]>([]);
  const remaining = shuffled.filter((x) => !picked.includes(x.i));

  const tap = (origIndex: number) => {
    if (answered !== null) return;
    const next = [...picked, origIndex];
    setPicked(next);
    if (next.length === correctOrder.length) {
      const ok = next.every((v, k) => v === k);
      onSubmit(ok);
    }
  };

  return (
    <div>
      <p className="mb-2 text-xs text-abyss-100/70">Touche les étapes dans le bon ordre :</p>
      {/* étapes choisies */}
      <ol className="mb-3 space-y-2">
        {picked.map((origIndex, pos) => {
          const reveal = answered !== null;
          const ok = origIndex === pos;
          return (
            <li
              key={pos}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ring-1 ${
                reveal
                  ? ok
                    ? "bg-spray-500/15 ring-spray-500/40 text-spray-400"
                    : "bg-coral-500/15 ring-coral-500/40 text-coral-400"
                  : "bg-white/5 ring-white/10 text-sail"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                {pos + 1}
              </span>
              {correctOrder[origIndex]}
            </li>
          );
        })}
      </ol>
      {/* étapes restantes */}
      <div className="space-y-2">
        {remaining.map((x) => (
          <button
            key={x.i}
            onClick={() => tap(x.i)}
            disabled={answered !== null}
            className="w-full rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-3 py-2.5 text-left text-sm text-abyss-100 transition active:scale-[0.99] hover:bg-white/5"
          >
            {x.s}
          </button>
        ))}
      </div>
    </div>
  );
}
