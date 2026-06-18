"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, CardHeader, DoctrineNote, PageHeader, SectionTitle } from "@/components/ui";
import { useKovela } from "@/lib/store";
import { formationLabels, formationStyles } from "@/lib/format";

const MY_SUPERVISOR_ID = "sup1"; // Inès Carvalho (superviseur de démo)

// Cas pratiques (NON cliniques) — uniquement process et wording.
const CASES = [
  {
    id: "c1",
    title: "Cas 1 — Patient silencieux après activation",
    context:
      "Un patient a été activé il y a 5 jours mais n'a pas répondu à la relance d'onboarding. Aucune nouvelle dans la messagerie.",
    goodAnswer:
      "Sélectionner le template « Patient silencieux », envoyer la relance, vérifier que le statut bascule, et noter l'action dans les logs.",
    badAnswer: "Improviser un message personnel sans utiliser de template ni de log.",
  },
  {
    id: "c2",
    title: "Cas 2 — Message patient nécessitant une transmission cabinet",
    context:
      "Un patient envoie un message + une photo en demandant que le chirurgien voie l'élément avant la prochaine consultation.",
    goodAnswer:
      "Préparer la compilation factuelle (brouillon interne), faire valider par un humain le contenu, puis cliquer explicitement « Transmettre au chirurgien ». Vérifier le log de transmission cabinet.",
    badAnswer: "Cliquer directement sur un bouton « urgence » qui transmettrait sans validation humaine.",
  },
  {
    id: "c3",
    title: "Cas 3 — Cycle de vie d'un CR",
    context:
      "Vous venez de préparer un CR via l'IA assistive. Le superviseur a validé en interne. Le chirurgien vous demande où en est son CR.",
    goodAnswer:
      "Le CR passe par trois états : Brouillon → Validé en interne → Disponible pour le chirurgien. Cliquer explicitement « Rendre disponible pour le chirurgien » avant que le CR n'apparaisse côté chirurgien. Vérifier les logs cr_valide puis cr_disponible.",
    badAnswer:
      "Considérer qu'un CR validé en interne est automatiquement visible côté chirurgien — il ne l'est pas tant que la mise à disposition n'est pas faite.",
  },
  {
    id: "c4",
    title: "Cas 4 — Préparer ≠ Transmettre",
    context:
      "Vous avez généré une compilation factuelle via l'IA pour un patient. Le brouillon est sauvegardé.",
    goodAnswer:
      "Préparer la compilation = brouillon interne ; le chirurgien ne la voit pas. La transmission au chirurgien est une action humaine explicite via « Transmettre au chirurgien ». Le log compilation_preparee précède la transmission cabinet effective.",
    badAnswer:
      "Confondre les deux étapes et supposer que préparer une compilation déclenche une transmission cabinet visible chirurgien.",
  },
];

// Quiz court — uniquement process, jamais clinique.
const QUIZ: { q: string; options: string[]; correct: number }[] = [
  {
    q: "Quelle action permet de préparer une transmission au chirurgien SANS la déclencher ?",
    options: [
      "Préparer la compilation factuelle (brouillon interne)",
      "Cliquer sur « Transmettre au chirurgien »",
      "Envoyer un message au patient",
    ],
    correct: 0,
  },
  {
    q: "Où vérifier les CR en file de validation ?",
    options: [
      "Sur la fiche patient superviseur, dans la carte Compte-rendu",
      "Sur la landing publique",
      "Dans l'espace patient",
    ],
    correct: 0,
  },
  {
    q: "Que doit faire le superviseur avant d'utiliser une suggestion IA ?",
    options: [
      "La valider (Accepter / Modifier / Refuser) — l'humain valide",
      "L'envoyer directement au patient",
      "Rien — l'IA décide seule",
    ],
    correct: 0,
  },
  {
    q: "Où consulter les logs ?",
    options: [
      "Page /logs (filtres par type : IA / CR / Transmissions / Patient / Cabinet / CRM)",
      "Aucun log n'est conservé",
      "Sur la page Patient",
    ],
    correct: 0,
  },
];

const LEXIQUE_OK = [
  "coordination",
  "suivi structuré",
  "supervision humaine spécialisée",
  "compte-rendu factuel",
  "compilation factuelle",
  "transmission au chirurgien",
  "message non traité",
  "patient silencieux",
  "IA assistive",
];

const TEMPLATES = [
  "Message reçu",
  "Demande de précision",
  "Demande de photo",
  "Rappel 15 / 112",
  "Relance patient silencieux",
  "Transmission cabinet en cours",
  "Clôture",
];

export default function FormationPage() {
  const k = useKovela();
  const me = k.supervisors.find((s) => s.id === MY_SUPERVISOR_ID);

  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => QUIZ.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0),
    [answers]
  );

  function submit() {
    setSubmitted(true);
    if (score === QUIZ.length) k.setSupervisorFormation(MY_SUPERVISOR_ID, "pret");
  }

  return (
    <Shell>
      <PageHeader
        eyebrow="Espace superviseur"
        title="Formation superviseur"
        subtitle="Les superviseurs KOVELA sont formés au rôle, au wording, aux templates, à l'IA assistive et à la traçabilité. Ils ne sont jamais lâchés seuls."
      >
        {me && (
          <Badge className={formationStyles[me.formationStatus]}>{formationLabels[me.formationStatus]}</Badge>
        )}
      </PageHeader>

      <DoctrineNote className="mb-6" />

      {/* Checklist de démarrage */}
      <SectionTitle>Checklist de démarrage</SectionTitle>
      <Card className="mb-8 p-5">
        <ul className="grid gap-2 text-sm text-charcoal/75 sm:grid-cols-2">
          {[
            "Comprendre le rôle du superviseur",
            "Connaître les limites du service",
            "Utiliser les templates",
            "Utiliser l'IA assistive (human-in-the-loop)",
            "Relire et valider un brouillon IA de CR",
            "Préparer une compilation factuelle",
            "Tracer ses actions",
            "Savoir quand transmettre au chirurgien selon procédure interne",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-xl bg-navy-50/40 p-3">
              <span className="mt-0.5 text-teal-500">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </Card>

      {/* Règles KOVELA */}
      <SectionTitle>Règles KOVELA</SectionTitle>
      <Card className="mb-8 p-5">
        <ul className="space-y-2 text-sm text-charcoal/75">
          <li>• KOVELA structure, trace, priorise opérationnellement et transmet au cabinet selon le référentiel.</li>
          <li>• KOVELA est un service opéré — pas un logiciel laissé au chirurgien.</li>
          <li>• Le superviseur ne formule pas d'avis médical.</li>
          <li>• L'IA assiste, l'humain valide.</li>
          <li>• Le chirurgien garde la main.</li>
        </ul>
      </Card>

      {/* Lexique */}
      <SectionTitle>Lexique</SectionTitle>
      <Card className="mb-8 p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-charcoal/55">Termes à utiliser</p>
        <div className="flex flex-wrap gap-1.5">
          {LEXIQUE_OK.map((w) => (
            <Badge key={w} className="bg-teal-50/60 text-navy-700 ring-teal-100">{w}</Badge>
          ))}
        </div>
        <p className="mt-5 rounded-xl bg-amber-50/60 p-3 text-xs leading-relaxed text-amber-800">
          Éviter tout vocabulaire qui pourrait laisser penser à une évaluation, un jugement ou une
          décision médicale. En cas de doute, préférer une formulation strictement organisationnelle
          ou demander une revue qualité.
        </p>
      </Card>

      {/* Templates */}
      <SectionTitle>Templates disponibles</SectionTitle>
      <Card className="mb-8 p-5">
        <div className="flex flex-wrap gap-1.5">
          {TEMPLATES.map((t) => (
            <span key={t} className="rounded-md bg-navy-50 px-2.5 py-1 text-xs text-charcoal/70">
              {t}
            </span>
          ))}
        </div>
      </Card>

      {/* Cas pratiques */}
      <SectionTitle>Cas pratiques (non cliniques)</SectionTitle>
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        {CASES.map((c) => (
          <Card key={c.id} className="p-5">
            <h3 className="text-sm font-semibold text-navy-900">{c.title}</h3>
            <p className="mt-2 text-sm text-charcoal/70">{c.context}</p>
            <div className="mt-3 rounded-xl bg-teal-50/60 p-3 text-xs text-teal-700">
              <span className="font-semibold">Bonne action :</span> {c.goodAnswer}
            </div>
            <div className="mt-2 rounded-xl bg-amber-50/60 p-3 text-xs text-amber-800">
              <span className="font-semibold">À éviter :</span> {c.badAnswer}
            </div>
          </Card>
        ))}
      </div>

      {/* Mini quiz */}
      <SectionTitle hint="Process & wording — uniquement">Mini quiz</SectionTitle>
      <Card className="mb-8 p-5">
        <div className="space-y-5">
          {QUIZ.map((q, i) => (
            <div key={i}>
              <p className="text-sm font-medium text-navy-900">
                {i + 1}. {q.q}
              </p>
              <div className="mt-2 space-y-1.5">
                {q.options.map((o, j) => {
                  const selected = answers[i] === j;
                  const correct = submitted && q.correct === j;
                  const wrong = submitted && selected && q.correct !== j;
                  return (
                    <label
                      key={j}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                        correct
                          ? "border-teal-300 bg-teal-50/60 text-navy-900"
                          : wrong
                          ? "border-amber-200 bg-amber-50/60 text-amber-800"
                          : selected
                          ? "border-navy-200 bg-navy-50 text-navy-900"
                          : "border-navy-100 text-charcoal/75 hover:bg-navy-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        checked={selected}
                        onChange={() => setAnswers((prev) => ({ ...prev, [i]: j }))}
                        className="h-3.5 w-3.5"
                      />
                      {o}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-navy-900/[0.06] pt-4">
          <Button
            variant="primary"
            disabled={Object.keys(answers).length < QUIZ.length}
            onClick={submit}
          >
            Valider mes réponses
          </Button>
          {submitted && (
            <p className="text-sm text-charcoal/70">
              Score : <span className="font-semibold text-navy-900">{score} / {QUIZ.length}</span>{" "}
              {score === QUIZ.length ? "— badge « Prêt à suivre des patients » obtenu." : "— relancer le quiz pour finaliser la complétude formation."}
            </p>
          )}
        </div>
      </Card>

      <p className="text-[11px] text-charcoal/45">
        « Complétude formation » — indicateur de progression interne KOVELA. Aucune portée
        d'évaluation à caractère médical. Voir{" "}
        <Link href="/superviseur" className="text-teal-600 hover:text-teal-700">mes indicateurs</Link>.
      </p>
    </Shell>
  );
}
