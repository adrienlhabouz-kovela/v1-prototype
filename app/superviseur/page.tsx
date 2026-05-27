"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Card, DoctrineNote } from "@/components/ui";
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
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy-900">Inbox opérationnelle</h1>
          <p className="text-sm text-slate-500">
            Classement strictement opérationnel. Aucun tri médical, aucune notion de gravité.
          </p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-teal-600"
          />
          Mes patients uniquement
        </label>
      </div>

      <DoctrineNote className="mb-6" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const list = scope.filter((p) => section.match(p, { unTreated }));
          return (
            <Card key={section.key} className="flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-navy-900">{section.title}</h2>
                  <p className="text-[11px] text-slate-400">{section.hint}</p>
                </div>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-navy-900 px-1.5 text-xs font-semibold text-white">
                  {list.length}
                </span>
              </div>
              <div className="flex-1 divide-y divide-slate-50">
                {list.length === 0 && (
                  <p className="px-4 py-6 text-center text-xs text-slate-400">Rien à traiter ici.</p>
                )}
                {list.map((p) => {
                  const n = unTreated(p);
                  return (
                    <Link
                      key={p.id}
                      href={`/superviseur/patient/${p.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/70"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-navy-900">{p.name}</p>
                        <p className="truncate text-xs text-slate-400">
                          {k.surgeonName(p.surgeonId)} · {relativeDays(p.lastMessageAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {n > 0 && (
                          <Badge className="bg-rose-50 text-rose-600 ring-rose-200">{n} non traité</Badge>
                        )}
                        <Badge className={statusStyles[p.status]}>{statusLabels[p.status]}</Badge>
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
