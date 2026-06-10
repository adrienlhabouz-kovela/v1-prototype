"use client";

// ---------------------------------------------------------------------------
// SupervisorCommandPalette — palette de commandes Cmd+K / Ctrl+K.
//
// Objectif production : permettre au superviseur de naviguer instantanément
// (chercher un patient par nom / intervention / chirurgien, lancer une
// action courante, sauter sur le prochain dossier prioritaire) sans
// quitter le clavier.
//
// Branchée par défaut : un Provider est monté côté Shell ou directement
// dans /superviseur et /superviseur/patient/[id]. Le composant écoute
// l'event keydown global (Cmd/Ctrl+K) pour s'ouvrir / fermer.
//
// Navigation interne :
//   ↑/↓        déplace le focus
//   Enter      exécute la commande / ouvre le patient
//   Esc        ferme la palette
//   typing     filtre instantanément
// ---------------------------------------------------------------------------

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useKovela } from "@/lib/store";
import {
  getNextPatientToTreat,
  getOperationalStatus,
  getPostOpDay,
  getSLA,
  getUrgence,
  unTreatedCount,
} from "@/lib/supervisor";

type CommandKind = "patient" | "action";

interface Command {
  kind: CommandKind;
  id: string;
  label: string;
  hint?: string;
  badge?: string;
  meta?: string;
  run: () => void;
}

const MY_SUPERVISOR_ID = "sup1";

export function SupervisorCommandPalette() {
  const k = useKovela();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const ctx = useMemo(
    () => ({ reportFor: k.reportFor, escalationFor: k.escalationFor }),
    [k.reportFor, k.escalationFor]
  );

  // Listener global Cmd+K / Ctrl+K — ouverture / fermeture.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Auto-focus l'input à l'ouverture + reset.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      // Différé pour laisser le navigateur monter l'input.
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Construction de la liste de commandes selon la query.
  const commands = useMemo<Command[]>(() => {
    const q = query.trim().toLowerCase();

    const patientCommands: Command[] = k.patients
      .filter((p) => p.status !== "cloture")
      .map((p) => {
        const surgeonName = k.surgeonName(p.surgeonId);
        const opStatus = getOperationalStatus(p, ctx);
        const sla = getSLA(p, ctx);
        const unread = !k.isPatientRead(p.id) && unTreatedCount(p) > 0;
        const day = getPostOpDay(p);
        const urgence = getUrgence(p, ctx);
        return {
          kind: "patient" as const,
          id: p.id,
          label: p.name,
          hint: `${p.intervention} · ${day} · ${surgeonName}`,
          badge:
            sla.state === "critical"
              ? "SLA"
              : urgence === "en_retard"
              ? "Retard"
              : unread
              ? "Non lu"
              : opStatus === "a_traiter"
              ? "À traiter"
              : undefined,
          meta: p.id,
          run: () => {
            router.push(`/superviseur/patient/${p.id}`);
            setOpen(false);
          },
        };
      });

    const actionCommands: Command[] = [
      {
        kind: "action" as const,
        id: "go-dashboard",
        label: "Aller au cockpit",
        hint: "Vue dashboard superviseur",
        run: () => {
          router.push("/superviseur");
          setOpen(false);
        },
      },
      {
        kind: "action" as const,
        id: "go-next",
        label: "Patient prioritaire suivant",
        hint: "Saute sur le dossier le plus pressant",
        run: () => {
          // On choisit n'importe quel patient comme « courant » pour
          // simplement obtenir le prochain à traiter de la file.
          const first = k.patients.find((p) => p.status !== "cloture");
          const next = first
            ? getNextPatientToTreat(first.id, k.patients, ctx)
            : null;
          if (next) router.push(`/superviseur/patient/${next.id}`);
          setOpen(false);
        },
      },
      {
        kind: "action" as const,
        id: "mark-all-read",
        label: "Tout marquer comme lu",
        hint: "Vide la file des non-lus",
        run: () => {
          k.markAllPatientsRead();
          setOpen(false);
        },
      },
      {
        kind: "action" as const,
        id: "go-formation",
        label: "Ouvrir la formation",
        hint: "Procédures, lexique, cas pratiques",
        run: () => {
          router.push("/superviseur/formation");
          setOpen(false);
        },
      },
    ];

    const all = [...actionCommands, ...patientCommands];

    if (!q) return all.slice(0, 20);
    return all
      .filter((c) => {
        const txt = `${c.label} ${c.hint ?? ""}`.toLowerCase();
        return txt.includes(q);
      })
      .slice(0, 20);
  }, [query, k.patients, k, ctx, router]);

  // Navigation clavier dans la liste.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, commands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        commands[activeIdx]?.run();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, commands, activeIdx]);

  // Reset l'index quand la query change.
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-navy-900/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-[12vh] w-[min(640px,92vw)] overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-navy-900/[0.08]"
      >
        <div className="flex items-center gap-3 border-b border-navy-900/[0.06] bg-bone/40 px-4 py-3">
          <span className="text-[12px] text-charcoal/45">⌘K</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher patient · chirurgien · action…"
            className="flex-1 bg-transparent text-[14px] tracking-tight text-navy-900 placeholder:text-charcoal/45 outline-none"
            autoFocus
          />
          <kbd className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-charcoal/55 ring-1 ring-navy-900/[0.08]">
            Esc
          </kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto py-1">
          {commands.length === 0 ? (
            <p className="px-4 py-8 text-center text-[12px] tracking-tight text-charcoal/45">
              Aucun résultat pour « {query} ».
            </p>
          ) : (
            commands.map((c, idx) => (
              <button
                key={`${c.kind}-${c.id}`}
                type="button"
                onClick={() => c.run()}
                onMouseEnter={() => setActiveIdx(idx)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  idx === activeIdx ? "bg-teal-50/60" : "hover:bg-bone/40"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold ${
                    c.kind === "patient"
                      ? "bg-navy-50 text-navy-900 ring-1 ring-navy-100"
                      : "bg-teal-50 text-teal-700 ring-1 ring-teal-100"
                  }`}
                >
                  {c.kind === "patient" ? "P" : "→"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium tracking-tight text-navy-900">
                    {c.label}
                  </p>
                  {c.hint && (
                    <p className="truncate text-[10.5px] tracking-tight text-charcoal/55">
                      {c.hint}
                    </p>
                  )}
                </div>
                {c.badge && (
                  <span className="shrink-0 rounded-md bg-amber-50 px-2 py-0.5 text-[9.5px] font-semibold text-amber-800 ring-1 ring-amber-200/60">
                    {c.badge}
                  </span>
                )}
                {idx === activeIdx && (
                  <kbd className="rounded-md bg-white px-1.5 py-0.5 text-[9.5px] font-medium text-charcoal/55 ring-1 ring-navy-900/[0.08]">
                    ↵
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>
        <div className="border-t border-navy-900/[0.06] bg-bone/40 px-4 py-2 text-[10px] tracking-tight text-charcoal/55">
          <span className="font-mono">↑↓</span> Naviguer
          <span className="mx-3 text-charcoal/30">·</span>
          <span className="font-mono">↵</span> Sélectionner
          <span className="mx-3 text-charcoal/30">·</span>
          <span className="font-mono">⌘K</span> Ouvrir/Fermer
        </div>
      </div>
    </div>
  );
}
