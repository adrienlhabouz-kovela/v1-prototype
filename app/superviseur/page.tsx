"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Card, DoctrineNote, PageHeader } from "@/components/ui";
import { useKovela } from "@/lib/store";
import { relativeDays, statusLabels, statusStyles } from "@/lib/format";
import type { Patient } from "@/lib/types";

interface Section {
  key: string;
  title: string;
  hint: string;
  match: (p: Patient, ctx: { unTreated: (p: Patient) => number }) => boolean;
}

const sections: Section[] = [
  {
    key: "non_traites",
    title: "Messages non traités",
    hint: "Critère : message patient non lu / non traité",
    match: (p, ctx) => ctx.unTreated(p) > 0,
  },
  {
    key: "silencieux",
    title: "Patients silencieux",
    hint: "Critère : absence de réponse patient",
    match: (p) => p.status === "silencieux",
  },
  {
    key: "escalades",
    title: "Escalades ouvertes",
    hint: "Critère : escalade ouverte (signal déclaré)",
    match: (p) => p.status === "escalade_ouverte",
  },
  {
    key: "cr",
    title: "CR à faire",
    hint: "Critère : CR en attente",
    match: (p) => p.status === "cr_en_attente",
  },
  {
    key: "suivis",
    title: "Suivis du jour",
    hint: "Critère : suivi actif en cours",
    match: (p) => p.status === "actif",
  },
  {
    key: "clotures",
    title: "Clôtures à faire",
    hint: "Critère : onboarding incomplet à finaliser",
    match: (p) => p.status === "onboarding_incomplet",
  },
];

export default function SuperviseurInbox() {
  const k = useKovela();
  const [onlyMine, setOnlyMine] = useState(true);
  const myId = "sup1"; // Inès Carvalho (superviseur de démo)

  const unTreated = (p: Patient) => p.messages.filter((m) => m.author === "patient" && !m.treated).length;

  const scope = useMemo(() => {
    return onlyMine ? k.patients.filter((p) => p.supervisorId === myId) : k.patients;
  }, [k.patients, onlyMine]);

  return (
    <Shell>
      <PageHeader
        eyebrow="Espace superviseur"
        title="Inbox opérationnelle"
        subtitle="File organisée selon des critères opérationnels : messages non traités, délais, CR en attente et escalades ouvertes."
      >
        <label className="flex cursor-pointer select-none items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 text-xs text-navy-100/80 ring-1 ring-white/10">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
            className="h-4 w-4 rounded border-navy-200 text-teal-500"
          />
          Mes patients uniquement
        </label>
      </PageHeader>

      <DoctrineNote className="mb-6" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const list = scope.filter((p) => section.match(p, { unTreated }));
          return (
            <Card key={section.key} className="flex flex-col">
              <div className="flex items-center justify-between border-b border-navy-900/[0.06] px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-navy-900">{section.title}</h2>
                  <p className="text-[11px] text-charcoal/45">{section.hint}</p>
                </div>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-navy-900 px-1.5 text-xs font-semibold text-white">
                  {list.length}
                </span>
              </div>
              <div className="flex-1 divide-y divide-navy-900/[0.05]">
                {list.length === 0 && (
                  <p className="px-4 py-6 text-center text-xs text-charcoal/45">Rien à traiter ici.</p>
                )}
                {list.map((p) => {
                  const n = unTreated(p);
                  const lastMsg = p.messages[p.messages.length - 1];
                  return (
                    <Link
                      key={p.id}
                      href={`/superviseur/patient/${p.id}`}
                      className="group block px-4 py-3 hover:bg-teal-50/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-navy-900">{p.name}</p>
                        <span className="shrink-0 text-[11px] text-charcoal/40">
                          {relativeDays(p.lastMessageAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-charcoal/50">
                        {k.surgeonName(p.surgeonId)}
                        {lastMsg ? ` · ${lastMsg.text}` : ""}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {n > 0 && (
                            <Badge className="bg-amber-50 text-amber-700 ring-amber-100">
                              {n} non traité
                            </Badge>
                          )}
                          <Badge className={statusStyles[p.status]}>{statusLabels[p.status]}</Badge>
                        </div>
                        <span className="shrink-0 text-xs font-medium text-teal-600 opacity-0 transition-opacity group-hover:opacity-100">
                          Ouvrir →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
}
