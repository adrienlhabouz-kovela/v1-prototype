"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Lesson, LessonBlock } from "@/lib/types";
import { useProgress } from "@/lib/progress/store";
import { badgeById } from "@/lib/content/badges";
import { FlashcardDeck } from "./FlashcardDeck";
import { BoatTopView } from "@/components/svg/BoatTopView";
import { WindRoseExplorer } from "./WindRoseExplorer";
import { PointsOfSailExplorer } from "./PointsOfSailExplorer";
import { SailTrim } from "@/components/svg/SailTrim";
import { ManeuverTimeline } from "./ManeuverTimeline";
import { QuizRunner } from "./QuizRunner";
import { ScoreRing } from "@/components/ui/primitives";

type Phase = "learn" | "quiz" | "done";

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const { completeLesson } = useProgress();
  const [phase, setPhase] = useState<Phase>("learn");
  const [result, setResult] = useState<{
    score: number;
    xpGained: number;
    newBadges: string[];
    leveledUp: boolean;
  } | null>(null);

  const finishQuiz = (score: number) => {
    const r = completeLesson(lesson.id, score);
    setResult({ score, ...r });
    setPhase("done");
  };

  return (
    <div>
      {/* header leçon */}
      <div className="mb-4 flex items-center justify-between">
        <Link href="/learn" className="text-sm text-abyss-100/70 hover:text-sail">
          ← Parcours
        </Link>
        <span className="label-caps">
          {phase === "learn" ? "Leçon" : phase === "quiz" ? "Exercices" : "Résultat"}
        </span>
      </div>

      {phase === "learn" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-2xl text-sail">{lesson.title}</h1>
          <p className="mt-1 text-sm text-abyss-100/80">{lesson.goal}</p>

          <div className="mt-5 space-y-5">
            {lesson.blocks.map((b) => (
              <BlockView key={b.id} block={b} />
            ))}
          </div>

          <button onClick={() => setPhase("quiz")} className="btn-primary mt-6 w-full">
            Passer aux exercices →
          </button>
        </motion.div>
      )}

      {phase === "quiz" && (
        <QuizRunner questions={lesson.questions} onComplete={finishQuiz} />
      )}

      {phase === "done" && result && (
        <ResultView
          lesson={lesson}
          result={result}
          onReplay={() => {
            setResult(null);
            setPhase("quiz");
          }}
          onNext={() => router.push("/learn")}
        />
      )}
    </div>
  );
}

function BlockView({ block }: { block: LessonBlock }) {
  return (
    <section>
      {block.title && (
        <h2 className="mb-2 font-display text-lg text-sail">{block.title}</h2>
      )}
      {block.kind === "text" && (
        <p className="text-sm leading-relaxed text-abyss-100">{block.body}</p>
      )}
      {block.kind === "callout" && (
        <div className="rounded-2xl bg-sun-500/10 p-4 text-sm leading-relaxed text-sun-400 ring-1 ring-sun-500/25">
          {block.body}
        </div>
      )}
      {block.kind === "flashcards" && block.flashcards && (
        <FlashcardDeck cards={block.flashcards} />
      )}
      {block.kind === "boatDiagram" && (
        <>
          {block.body && <p className="mb-3 text-sm text-abyss-100">{block.body}</p>}
          <BoatTopView mode="explore" />
        </>
      )}
      {block.kind === "windRose" && (
        <>
          {block.body && <p className="mb-3 text-sm text-abyss-100">{block.body}</p>}
          <WindRoseExplorer />
        </>
      )}
      {block.kind === "pointsOfSail" && (
        <>
          {block.body && <p className="mb-3 text-sm text-abyss-100">{block.body}</p>}
          <PointsOfSailExplorer />
        </>
      )}
      {block.kind === "sailTrim" && (
        <>
          {block.body && <p className="mb-3 text-sm text-abyss-100">{block.body}</p>}
          <SailTrim />
        </>
      )}
      {block.kind === "maneuverTimeline" && (
        <ManeuverTimeline steps={(block.data?.steps as string[]) ?? []} />
      )}
    </section>
  );
}

function ResultView({
  lesson,
  result,
  onReplay,
  onNext,
}: {
  lesson: Lesson;
  result: { score: number; xpGained: number; newBadges: string[]; leveledUp: boolean };
  onReplay: () => void;
  onNext: () => void;
}) {
  const pct = Math.round(result.score * 100);
  const tone = pct >= 80 ? "spray" : pct >= 50 ? "sun" : "coral";
  const msg =
    pct >= 80
      ? "Solide. Tu maîtrises l'essentiel de cette leçon."
      : pct >= 50
        ? "Pas mal ! Quelques notions à consolider — on les reverra."
        : "On va y revenir. Reprends les exercices, ça va rentrer.";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="mx-auto mt-6 flex justify-center">
        <ScoreRing value={result.score} size={120} stroke={10} tone={tone} label={`${pct}%`} />
      </div>
      <h1 className="mt-5 font-display text-2xl text-sail">{lesson.title}</h1>
      <p className="mx-auto mt-2 max-w-xs text-sm text-abyss-100/80">{msg}</p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-sun-500/15 px-5 py-2 ring-1 ring-sun-500/30"
      >
        <span className="text-lg">⭐</span>
        <span className="font-bold text-sun-400">+{result.xpGained} XP</span>
      </motion.div>

      {result.leveledUp && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-3 rounded-xl bg-spray-500/10 p-3 text-sm font-semibold text-spray-400 ring-1 ring-spray-500/25"
        >
          🎉 Niveau supérieur débloqué !
        </motion.div>
      )}

      {result.newBadges.length > 0 && (
        <div className="mt-3 space-y-2">
          {result.newBadges.map((id) => {
            const b = badgeById(id);
            if (!b) return null;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-3 rounded-xl bg-white/5 p-3 text-left ring-1 ring-white/10"
              >
                <span className="text-2xl">{b.glyph}</span>
                <div>
                  <div className="text-sm font-bold text-sail">Badge : {b.name}</div>
                  <div className="text-xs text-abyss-100/70">{b.description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-7 space-y-2">
        <button onClick={onNext} className="btn-primary w-full">
          Continuer le parcours
        </button>
        <button onClick={onReplay} className="btn-ghost w-full">
          Refaire les exercices
        </button>
      </div>
    </motion.div>
  );
}
