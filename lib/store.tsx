"use client";

// KOVELA — store en mémoire (prototype). Aucune persistance serveur,
// aucune vraie base de données. État volatile pour la démo.

import React, { createContext, useContext, useMemo, useState } from "react";
import {
  assistants,
  buildEscalations,
  buildInitialLogs,
  buildPatients,
  buildReports,
  PRICING,
  supervisors,
  surgeons,
} from "./mock-data";
import { PROMPT_VERSION } from "./ai";
import type {
  AiDecision,
  AiFunction,
  AiLog,
  ClinicalReport,
  Escalation,
  LogEntry,
  LogKind,
  Message,
  Patient,
  Role,
} from "./types";

interface KovelaState {
  role: Role;
  setRole: (r: Role) => void;
  currentUser: string;

  patients: Patient[];
  escalations: Escalation[];
  reports: ClinicalReport[];
  logs: LogEntry[];
  aiLogs: AiLog[];

  // sélections / contexte
  surgeons: typeof surgeons;
  assistants: typeof assistants;
  supervisors: typeof supervisors;
  pricing: typeof PRICING;

  // actions
  assignSupervisor: (patientId: string, supervisorId: string | null) => void;
  sendMessage: (patientId: string, text: string, author: Message["author"]) => void;
  markTreated: (patientId: string) => void;
  relancePatient: (patientId: string) => void;
  clotureSuivi: (patientId: string) => void;
  addNote: (patientId: string, text: string) => void;
  completeOnboarding: (patientId: string) => void;

  upsertReport: (patientId: string, content: string, status?: ClinicalReport["status"]) => void;
  validateReport: (patientId: string) => void;
  publishReport: (patientId: string) => void;

  openEscalation: (patientId: string, compilation: string) => void;
  transmitEscalation: (patientId: string) => void;

  logAi: (fn: AiFunction, decision: AiDecision, patientId?: string) => void;

  // helpers
  surgeonName: (id: string) => string;
  supervisorName: (id: string | null) => string;
  reportFor: (patientId: string) => ClinicalReport | undefined;
  escalationFor: (patientId: string) => Escalation | undefined;
}

const Ctx = createContext<KovelaState | null>(null);

const NOW = "2026-05-27T12:00:00Z";

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const userByRole: Record<Role, string> = {
  admin: "Admin KOVELA",
  superviseur: "Inès Carvalho",
  chirurgien: "Dr. Camille Aragon",
  patient: "Camille Moreau",
};

export function KovelaProvider({ children }: { children: React.ReactNode }) {
  const initialPatients = useMemo(() => buildPatients(), []);
  const [role, setRole] = useState<Role>("admin");
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [escalations, setEscalations] = useState<Escalation[]>(() => buildEscalations(initialPatients));
  const [reports, setReports] = useState<ClinicalReport[]>(() => buildReports(initialPatients));
  const [logs, setLogs] = useState<LogEntry[]>(() => buildInitialLogs(initialPatients));
  const [aiLogs, setAiLogs] = useState<AiLog[]>([]);

  const currentUser = userByRole[role];

  function pushLog(kind: LogKind, detail: string, patientId?: string) {
    setLogs((prev) => [
      { id: uid("log"), kind, at: new Date().toISOString(), user: currentUser, patientId, detail },
      ...prev,
    ]);
  }

  function updatePatient(id: string, fn: (p: Patient) => Patient) {
    setPatients((prev) => prev.map((p) => (p.id === id ? fn(p) : p)));
  }

  const surgeonName = (id: string) => surgeons.find((s) => s.id === id)?.name ?? "—";
  const supervisorName = (id: string | null) =>
    id ? supervisors.find((s) => s.id === id)?.name ?? "—" : "Non assigné";
  const reportFor = (patientId: string) => reports.find((r) => r.patientId === patientId);
  const escalationFor = (patientId: string) =>
    escalations.find((e) => e.patientId === patientId && e.status !== "cloturee");

  const value: KovelaState = {
    role,
    setRole,
    currentUser,
    patients,
    escalations,
    reports,
    logs,
    aiLogs,
    surgeons,
    assistants,
    supervisors,
    pricing: PRICING,

    assignSupervisor(patientId, supervisorId) {
      updatePatient(patientId, (p) => ({ ...p, supervisorId }));
      const p = patients.find((x) => x.id === patientId);
      pushLog(
        "patient_attribue",
        `${p?.name ?? patientId} ${supervisorId ? "attribué à" : "désassigné de"} ${supervisorName(supervisorId)}.`,
        patientId
      );
    },

    sendMessage(patientId, text, author) {
      const msg: Message = {
        id: uid("m"),
        author,
        text,
        at: new Date().toISOString(),
        treated: author !== "patient",
      };
      updatePatient(patientId, (p) => ({
        ...p,
        messages: [...p.messages, msg],
        lastMessageAt: msg.at,
        status: author === "patient" && p.status === "silencieux" ? "actif" : p.status,
      }));
      if (author === "superviseur") pushLog("message_envoye", "Message envoyé au patient.", patientId);
    },

    markTreated(patientId) {
      updatePatient(patientId, (p) => ({
        ...p,
        messages: p.messages.map((m) => ({ ...m, treated: true })),
      }));
      pushLog("note_interne", "Conversation marquée comme traitée.", patientId);
    },

    relancePatient(patientId) {
      const msg: Message = {
        id: uid("m"),
        author: "superviseur",
        text: "Bonjour, nous n'avons pas eu de vos nouvelles. Comment se passe votre suivi ?",
        at: new Date().toISOString(),
        treated: true,
      };
      updatePatient(patientId, (p) => ({ ...p, messages: [...p.messages, msg], lastMessageAt: msg.at }));
      pushLog("patient_relance", "Relance envoyée au patient silencieux.", patientId);
    },

    clotureSuivi(patientId) {
      updatePatient(patientId, (p) => ({ ...p, status: "cloture" }));
      pushLog("suivi_cloture", "Suivi structuré clôturé.", patientId);
    },

    addNote(patientId, text) {
      updatePatient(patientId, (p) => ({
        ...p,
        notes: [
          { id: uid("n"), author: currentUser, text, at: new Date().toISOString() },
          ...p.notes,
        ],
      }));
      pushLog("note_interne", "Note interne ajoutée.", patientId);
    },

    completeOnboarding(patientId) {
      updatePatient(patientId, (p) => ({
        ...p,
        onboardingComplete: true,
        consentGiven: true,
        activatedThisMonth: true,
        status: p.status === "onboarding_incomplet" ? "actif" : p.status,
      }));
      pushLog("onboarding_complete", "Onboarding complété et suivi lancé (patient activé).", patientId);
    },

    upsertReport(patientId, content, status = "brouillon") {
      setReports((prev) => {
        const existing = prev.find((r) => r.patientId === patientId);
        if (existing) {
          return prev.map((r) =>
            r.patientId === patientId
              ? { ...r, content, status, updatedAt: new Date().toISOString() }
              : r
          );
        }
        const p = patients.find((x) => x.id === patientId);
        return [
          ...prev,
          {
            id: uid("cr"),
            patientId,
            status,
            period: p ? `${p.protocol} — suivi structuré` : "suivi structuré",
            content,
            updatedAt: new Date().toISOString(),
          },
        ];
      });
      if (status === "brouillon") pushLog("cr_prepare", "Brouillon de CR préparé.", patientId);
    },

    validateReport(patientId) {
      setReports((prev) =>
        prev.map((r) =>
          r.patientId === patientId ? { ...r, status: "valide", updatedAt: new Date().toISOString() } : r
        )
      );
      updatePatient(patientId, (p) => ({ ...p, status: p.status === "cr_en_attente" ? "actif" : p.status }));
      pushLog("cr_valide", "Brouillon de CR validé par un humain.", patientId);
    },

    publishReport(patientId) {
      setReports((prev) =>
        prev.map((r) =>
          r.patientId === patientId ? { ...r, status: "disponible", updatedAt: new Date().toISOString() } : r
        )
      );
      pushLog("cr_disponible", "CR rendu disponible au chirurgien.", patientId);
    },

    openEscalation(patientId, compilation) {
      setEscalations((prev) => {
        const existing = prev.find((e) => e.patientId === patientId && e.status !== "cloturee");
        if (existing) {
          return prev.map((e) =>
            e.id === existing.id ? { ...e, compilation, status: "ouverte" } : e
          );
        }
        return [
          ...prev,
          { id: uid("e"), patientId, status: "ouverte", openedAt: new Date().toISOString(), compilation },
        ];
      });
      updatePatient(patientId, (p) => ({ ...p, status: "escalade_ouverte" }));
    },

    transmitEscalation(patientId) {
      setEscalations((prev) =>
        prev.map((e) =>
          e.patientId === patientId && e.status === "ouverte"
            ? { ...e, status: "transmise", transmittedAt: new Date().toISOString() }
            : e
        )
      );
      pushLog("escalade_transmise", "Compilation factuelle transmise au chirurgien.", patientId);
    },

    logAi(fn, decision, patientId) {
      setAiLogs((prev) => [
        {
          id: uid("ai"),
          fn,
          promptVersion: PROMPT_VERSION,
          at: new Date().toISOString(),
          user: currentUser,
          patientId,
          decision,
        },
        ...prev,
      ]);
      const fnLabel: Record<AiFunction, string> = {
        resume_conversation: "Résumé conversation",
        preparation_cr: "Préparation CR",
        reformulation: "Reformulation",
        compilation_escalade: "Compilation factuelle d'escalade",
      };
      if (decision === "propose") {
        pushLog("ia_utilisee", `Fonction IA assistive « ${fnLabel[fn]} » utilisée (prompt ${PROMPT_VERSION}).`, patientId);
      } else {
        const dLabel = decision === "accepte" ? "acceptée" : decision === "modifie" ? "modifiée" : "refusée";
        pushLog("ia_suggestion", `Suggestion IA « ${fnLabel[fn]} » ${dLabel} par un humain.`, patientId);
      }
    },

    surgeonName,
    supervisorName,
    reportFor,
    escalationFor,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useKovela(): KovelaState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useKovela doit être utilisé dans KovelaProvider");
  return ctx;
}

export { NOW };
