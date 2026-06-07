"use client";

// ---------------------------------------------------------------------------
// QueueRail — colonne de gauche permanente du workspace superviseur.
//
// Objectif : permettre à la superviseuse de scanner et changer de patient
// sans jamais quitter le workspace. Pattern Front / Intercom / Help Scout.
//
// Filtres : 7 chips compactes (À traiter / Sans réponse / Transmissions /
// CR / Retours cabinet / Suivis / Clôtures). Recherche en haut. Liste
// scrollable. Chaque rang patient = lien direct vers la fiche.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { useMemo, useState } from "react";
import { useKovela } from "@/lib/store";
import {
  getLastEvent,
  getOperationalStatus,
  getPostOpDay,
  getRecommendedAction,
  getUrgence,
} from "@/lib/supervisor";
import type { Patient } from "@/lib/types";

export type QueueFilter =
  | "all"
  | "a_traiter"
  | "a_relancer"
  | "a_transmettre_cabinet"
  | "cr_factuels"
  | "en_attente_cabinet"
  | "suivi_habituel"
  | "cloture_a_preparer";

const FILTER_LABELS: Record<QueueFilter, string> = {
  all: "Toutes",
  a_traiter: "À traiter",
  a_relancer: "Sans réponse",
  a_transmettre_cabinet: "Transmissions",
  cr_factuels: "CR factuels",
  en_attente_cabinet: "Retours cabinet",
  suivi_habituel: "Suivis",
  cloture_a_preparer: "Clôtures",
};

const MY_SUPERVISOR_ID = "sup1";

export function QueueRail({
  selectedPatientId,
}: {
  selectedPatientId?: string;
}) {
  const k = useKovela();
  const [filter, setFilter] = useState<QueueFilter>("a_traiter");
  const [search, setSearch] = useState("");
  const [onlyMine, setOnlyMine] = useState(true);

  const ctx = useMemo(
    () => ({ reportFor: k.reportFor, escalationFor: k.escalationFor }),
    [k.reportFor, k.escalationFor]
  );

  const scope = useMemo(() => {
    const list = onlyMine
      ? k.patients.filter((p) => p.supervisorId === MY_SUPERVISOR_ID)
      : k.patients;
    return list.filter((p) => p.status !== "cloture");
  }, [k.patients, onlyMine]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scope.filter((p) => {
      // Filtre par catégorie opérationnelle.
      if (filter === "cr_factuels") {
        const r = k.reportFor(p.id);
        if (!r || (r.status !== "brouillon" && r.status !== "valide")) return false;
      } else if (filter !== "all") {
        if (getOperationalStatus(p, ctx) !== filter) return false;
      }
      // Filtre recherche.
      if (q) {
        const surgeon = k.surgeonName(p.surgeonId).toLowerCase();
        const hit =
          p.name.toLowerCase().includes(q) ||
          surgeon.includes(q) ||
          p.intervention.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [scope, filter, search, ctx, k]);

  // Tri : urgence en retard d'abord, puis par âge du dernier message
  // (plus ancien en haut = plus urgent à scanner).
  const sorted = useMemo(() => {
    const lastMsgTs = (p: Patient) => {
      const lm = p.messages[p.messages.length - 1];
      return lm ? new Date(lm.at).getTime() : 0;
    };
    return [...filtered].sort((a, b) => {
      const ua = getUrgence(a, ctx);
      const ub = getUrgence(b, ctx);
      const order = { en_retard: 0, aujourdhui: 1, a_venir: 2 } as const;
      const da = order[ua as keyof typeof order] ?? 3;
      const db = order[ub as keyof typeof order] ?? 3;
      if (da !== db) return da - db;
      return lastMsgTs(a) - lastMsgTs(b);
    });
  }, [filtered, ctx]);

  // Compteurs par filtre — affichés en chips.
  const counts = useMemo(() => {
    const map: Record<QueueFilter, number> = {
      all: scope.length,
      a_traiter: 0,
      a_relancer: 0,
      a_transmettre_cabinet: 0,
      cr_factuels: 0,
      en_attente_cabinet: 0,
      suivi_habituel: 0,
      cloture_a_preparer: 0,
    };
    scope.forEach((p) => {
      const s = getOperationalStatus(p, ctx);
      if (s) map[s as QueueFilter] = (map[s as QueueFilter] ?? 0) + 1;
      const r = k.reportFor(p.id);
      if (r && (r.status === "brouillon" || r.status === "valide")) {
        map.cr_factuels += 1;
      }
    });
    return map;
  }, [scope, ctx, k]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
      {/* En-tête rail : filtre Mes patients + recherche */}
      <div className="border-b border-navy-900/[0.06] bg-bone/40 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
            File de travail
          </p>
          <label className="flex cursor-pointer select-none items-center gap-1.5 text-[10.5px] tracking-tight text-charcoal/65">
            <input
              type="checkbox"
              checked={onlyMine}
              onChange={(e) => setOnlyMine(e.target.checked)}
              className="h-3 w-3"
            />
            Mes patients
          </label>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher…"
          className="mt-2 w-full rounded-md bg-white px-2.5 py-1.5 text-[11.5px] tracking-tight text-navy-900 placeholder:text-charcoal/40 ring-1 ring-navy-900/[0.06] focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        />
      </div>

      {/* Chips filtres compactes */}
      <div className="flex flex-wrap gap-1 border-b border-navy-900/[0.05] bg-bone/20 px-3 py-2">
        {(Object.keys(FILTER_LABELS) as QueueFilter[]).map((f) => {
          const active = filter === f;
          const c = counts[f];
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-medium tracking-tight transition-colors ${
                active
                  ? "bg-navy-900 text-white shadow-soft"
                  : "bg-white text-charcoal/65 ring-1 ring-navy-900/[0.06] hover:text-navy-900"
              }`}
            >
              <span>{FILTER_LABELS[f]}</span>
              <span
                className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-semibold ${
                  active
                    ? "bg-white/15 text-white"
                    : c === 0
                    ? "bg-navy-900/[0.05] text-charcoal/45"
                    : "bg-amber-100/80 text-amber-800"
                }`}
              >
                {c}
              </span>
            </button>
          );
        })}
      </div>

      {/* Liste patients — scrollable */}
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <p className="px-3 py-10 text-center text-[11px] tracking-tight text-charcoal/45">
            Aucun patient dans cette file.
          </p>
        ) : (
          sorted.map((p) => (
            <QueueRow
              key={p.id}
              patient={p}
              selected={p.id === selectedPatientId}
            />
          ))
        )}
      </div>

      {/* Pied : total et lien dashboard global */}
      <div className="border-t border-navy-900/[0.05] bg-bone/40 px-3 py-2 text-[10px] tracking-tight text-charcoal/55">
        {sorted.length} patient{sorted.length > 1 ? "s" : ""} affiché
        {sorted.length > 1 ? "s" : ""}
        {sorted.length !== scope.length && ` · ${scope.length} au total`}
      </div>
    </div>
  );
}

function QueueRow({
  patient,
  selected,
}: {
  patient: Patient;
  selected: boolean;
}) {
  const k = useKovela();
  const ctx = { reportFor: k.reportFor, escalationFor: k.escalationFor };
  const day = getPostOpDay(patient);
  const action = getRecommendedAction(patient, ctx);
  const urgence = getUrgence(patient, ctx);
  const last = getLastEvent(patient, ctx);

  // Citation courte du dernier message patient pour scanner.
  const lastPatientMsg = [...patient.messages]
    .reverse()
    .find((m) => m.author === "patient");
  const preview = lastPatientMsg
    ? lastPatientMsg.text.length > 55
      ? lastPatientMsg.text.slice(0, 55) + "…"
      : lastPatientMsg.text
    : null;

  const initials = patient.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const dotColor =
    urgence === "en_retard"
      ? "bg-amber-500"
      : urgence === "aujourdhui"
      ? "bg-teal-500"
      : "bg-navy-900/30";

  return (
    <Link
      href={`/superviseur/patient/${patient.id}`}
      className={`group relative block border-b border-navy-900/[0.04] px-3 py-2 transition-colors ${
        selected
          ? "bg-teal-50/40"
          : "hover:bg-bone/40"
      }`}
    >
      {/* Accent bar gauche — état sélectionné élégant, sans ring de carte. */}
      {selected && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-teal-500" />
      )}
      <div className="flex items-start gap-2">
        {/* Avatar compact + point de priorité */}
        <div className="relative shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-navy-50 text-[10.5px] font-semibold tracking-tight text-navy-900 ring-1 ring-navy-100">
            {initials}
          </span>
          <span
            className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-white ${dotColor}`}
          />
        </div>

        {/* Identité + meta — densifié */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-1.5">
            <p
              className={`truncate text-[11.5px] tracking-tight ${
                selected ? "font-semibold text-navy-900" : "font-medium text-navy-900"
              }`}
            >
              {patient.name}
            </p>
            <span className="shrink-0 font-mono text-[9.5px] font-medium text-teal-700">
              {day}
            </span>
          </div>
          <p className="truncate text-[10px] tracking-tight text-charcoal/55">
            {patient.intervention}
            {last.ageLabel && (
              <span className="text-charcoal/35"> · {last.ageLabel}</span>
            )}
          </p>
          {preview ? (
            <p className="mt-0.5 truncate text-[10px] italic tracking-tight text-charcoal/65">
              <span className="not-italic text-amber-700">«</span> {preview}{" "}
              <span className="not-italic text-amber-700">»</span>
            </p>
          ) : (
            <p className="mt-0.5 truncate text-[10px] tracking-tight text-charcoal/45">
              → {action.label}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
