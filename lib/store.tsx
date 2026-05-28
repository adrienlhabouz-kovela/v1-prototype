"use client";

// KOVELA — store en mémoire (prototype). Aucune persistance serveur,
// aucune vraie base de données. État volatile pour la démo.

import React, { createContext, useContext, useMemo, useState } from "react";
import {
  assistants as seedAssistants,
  buildEscalations,
  buildInitialLogs,
  buildPatients,
  buildReports,
  PRICING,
  seedConversationsToReview,
  seedCRsToControl,
  seedProspects,
  supervisors as seedSupervisors,
  surgeons as seedSurgeons,
} from "./mock-data";
import { PROMPT_VERSION } from "./ai";
import type {
  AiDecision,
  AiFunction,
  AiLog,
  Assistant,
  CabinetConfig,
  ClinicalReport,
  Escalation,
  FormationStatus,
  LogEntry,
  LogKind,
  MandateStatus,
  Message,
  Patient,
  Prospect,
  ProspectStatus,
  QualityStatus,
  Role,
  Supervisor,
  Surgeon,
} from "./types";

export interface ProspectInput {
  firstName: string;
  lastName: string;
  specialty: string;
  vertical: string;
  cabinet: string;
  city: string;
  email: string;
  phone: string;
  linkedin: string;
  source: string;
  cabinetType: Prospect["cabinetType"];
  monthlyVolume: number;
  interest: Prospect["interest"];
  priority: Prospect["priority"];
}

export interface PlanningInput {
  name: string;
  intervention: string;
  interventionDate: string; // ISO ou yyyy-mm-dd
  interventionTime: string;
  clinic: string;
  phone: string;
  email: string;
  protocol: string;
  cabinetNote: string;
}

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
  surgeons: Surgeon[];
  assistants: Assistant[];
  supervisors: Supervisor[];
  pricing: typeof PRICING;

  // actions
  assignSupervisor: (patientId: string, supervisorId: string | null) => void;
  sendMessage: (patientId: string, text: string, author: Message["author"]) => void;
  markTreated: (patientId: string) => void;
  relancePatient: (patientId: string) => void;
  clotureSuivi: (patientId: string) => void;
  addNote: (patientId: string, text: string) => void;
  completeOnboarding: (patientId: string) => void;

  // planning opératoire
  addPlanningPatient: (input: PlanningInput) => void;
  importPlanning: (rows: PlanningInput[]) => void;
  updatePlanningPatient: (patientId: string, input: Partial<PlanningInput>) => void;
  postponeIntervention: (patientId: string, date: string, time: string) => void;
  cancelIntervention: (patientId: string) => void;
  resendOnboardingLink: (patientId: string) => void;

  upsertReport: (patientId: string, content: string, status?: ClinicalReport["status"]) => void;
  validateReport: (patientId: string) => void;
  publishReport: (patientId: string) => void;

  // compilation factuelle (brouillon interne) puis transmission explicite
  prepareCompilation: (patientId: string, compilation: string) => void;
  transmitCompilation: (patientId: string) => void;

  // onboarding chirurgien / cabinet
  saveCabinetConfig: (surgeonId: string, config: CabinetConfig) => void;
  setMandateStatus: (surgeonId: string, status: MandateStatus) => void;
  addAssistant: (surgeonId: string, name: string) => void;

  // Supervision & qualité
  setSupervisorFormation: (supervisorId: string, status: FormationStatus) => void;
  setSupervisorQuality: (supervisorId: string, status: QualityStatus) => void;
  logQualityReview: (label: string, status: "ok" | "a_revoir") => void;
  logPatientConsents: (patientId: string, prefs: { photo: boolean; audio: boolean; relances: boolean; notifications: boolean }) => void;
  reportCabinetIssue: (patientId: string) => void;

  // Revue qualité — états partagés et éditables (boucle légère).
  qualityConversations: Record<string, "a_relire" | "ok" | "a_revoir">;
  qualityCRs: Record<string, "a_controler" | "ok" | "a_revoir">;
  qualityComments: Record<string, string>;
  setQualityConversationStatus: (id: string, status: "ok" | "a_revoir", label: string) => void;
  setQualityCRStatus: (id: string, status: "ok" | "a_revoir", label: string) => void;
  setQualityComment: (id: string, comment: string, label: string) => void;

  // CRM chirurgiens (commercial — AUCUNE donnée patient)
  prospects: Prospect[];
  addProspect: (input: ProspectInput) => void;
  updateProspectStatus: (id: string, status: ProspectStatus) => void;
  addProspectNote: (id: string, text: string) => void;
  markProspectDemoDone: (id: string) => void;
  scheduleProspectRelance: (id: string, date: string, action: string) => void;
  launchProspectOnboarding: (id: string) => void;
  activateProspectAsSurgeon: (id: string) => void;

  logAi: (fn: AiFunction, decision: AiDecision, patientId?: string) => void;

  // helpers
  surgeonName: (id: string) => string;
  surgeon: (id: string) => Surgeon | undefined;
  assistantsFor: (surgeonId: string) => Assistant[];
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
  const [escalations, setEscalations] = useState<Escalation[]>(() => buildEscalations());
  const [reports, setReports] = useState<ClinicalReport[]>(() => buildReports(initialPatients));
  const [logs, setLogs] = useState<LogEntry[]>(() => buildInitialLogs(initialPatients));
  const [aiLogs, setAiLogs] = useState<AiLog[]>([]);
  const [surgeonsState, setSurgeons] = useState<Surgeon[]>(() => seedSurgeons.map((s) => ({ ...s })));
  const [supervisorsState, setSupervisorsState] = useState<Supervisor[]>(() => seedSupervisors.map((s) => ({ ...s })));
  const [assistantsState, setAssistants] = useState<Assistant[]>(() => seedAssistants.map((a) => ({ ...a })));
  const [prospects, setProspects] = useState<Prospect[]>(() => seedProspects.map((p) => ({ ...p, notes: [...p.notes] })));

  // Revue qualité (état partagé entre /admin et /admin/supervision).
  const [qualityConversations, setQualityConversations] = useState<Record<string, "a_relire" | "ok" | "a_revoir">>(
    () => Object.fromEntries(seedConversationsToReview.map((c) => [c.id, c.status]))
  );
  const [qualityCRs, setQualityCRs] = useState<Record<string, "a_controler" | "ok" | "a_revoir">>(
    () => Object.fromEntries(seedCRsToControl.map((c) => [c.id, c.status]))
  );
  const [qualityComments, setQualityComments] = useState<Record<string, string>>(
    () => Object.fromEntries(seedConversationsToReview.map((c) => [c.id, c.comment]))
  );

  function updateProspect(id: string, fn: (p: Prospect) => Prospect) {
    setProspects((prev) => prev.map((p) => (p.id === id ? fn(p) : p)));
  }

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

  const surgeonName = (id: string) => surgeonsState.find((s) => s.id === id)?.name ?? "—";
  const surgeon = (id: string) => surgeonsState.find((s) => s.id === id);
  const assistantsFor = (surgeonId: string) =>
    assistantsState.filter((a) => a.surgeonId === surgeonId);
  const supervisorName = (id: string | null) =>
    id ? supervisorsState.find((s) => s.id === id)?.name ?? "—" : "Non assigné";
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
    surgeons: surgeonsState,
    assistants: assistantsState,
    supervisors: supervisorsState,
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
        onboardingStatus: "complete",
        planningStatus: p.planningStatus === "annule" ? p.planningStatus : "actif",
        status: p.status === "onboarding_incomplet" ? "actif" : p.status,
      }));
      pushLog("onboarding_complete", "Onboarding complété et suivi lancé (patient activé).", patientId);
    },

    addPlanningPatient(input) {
      const id = uid("p");
      const patient: Patient = {
        id,
        name: input.name || "Nouveau patient",
        surgeonId: "s1",
        supervisorId: null,
        intervention: input.intervention || "Intervention à préciser",
        interventionDate: input.interventionDate
          ? new Date(input.interventionDate).toISOString()
          : new Date().toISOString(),
        interventionTime: input.interventionTime || "09:00",
        clinic: input.clinic || "Clinique du Parc",
        phone: input.phone || "",
        email: input.email || "",
        cabinetNote: input.cabinetNote || "",
        protocol: input.protocol || "J+8 / J+15",
        status: "onboarding_incomplet",
        onboardingStatus: "a_envoyer",
        planningStatus: "importe",
        planningUpdatedAt: new Date().toISOString(),
        onboardingComplete: false,
        activatedThisMonth: false,
        consentGiven: false,
        messages: [],
        notes: [],
        lastMessageAt: null,
      };
      setPatients((prev) => [patient, ...prev]);
      pushLog("planning_ajout", `Patient « ${patient.name} » ajouté au planning opératoire (importé).`, id);
    },

    importPlanning(rows) {
      const created: Patient[] = rows.map((input) => ({
        id: uid("p"),
        name: input.name || "Nouveau patient",
        surgeonId: "s1",
        supervisorId: null,
        intervention: input.intervention || "Intervention à préciser",
        interventionDate: input.interventionDate
          ? new Date(input.interventionDate).toISOString()
          : new Date().toISOString(),
        interventionTime: input.interventionTime || "09:00",
        clinic: input.clinic || "Clinique du Parc",
        phone: input.phone || "",
        email: input.email || "",
        cabinetNote: input.cabinetNote || "",
        protocol: input.protocol || "J+8 / J+15",
        status: "onboarding_incomplet" as const,
        onboardingStatus: "a_envoyer" as const,
        planningStatus: "importe" as const,
        planningUpdatedAt: new Date().toISOString(),
        onboardingComplete: false,
        activatedThisMonth: false,
        consentGiven: false,
        messages: [],
        notes: [],
        lastMessageAt: null,
      }));
      setPatients((prev) => [...created, ...prev]);
      pushLog("planning_import", `${created.length} patient(s) importé(s) dans le planning opératoire.`);
    },

    updatePlanningPatient(patientId, input) {
      updatePatient(patientId, (p) => ({
        ...p,
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.intervention !== undefined ? { intervention: input.intervention } : {}),
        ...(input.interventionDate
          ? { interventionDate: new Date(input.interventionDate).toISOString() }
          : {}),
        ...(input.interventionTime !== undefined ? { interventionTime: input.interventionTime } : {}),
        ...(input.clinic !== undefined ? { clinic: input.clinic } : {}),
        ...(input.phone !== undefined ? { phone: input.phone } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.protocol !== undefined ? { protocol: input.protocol } : {}),
        ...(input.cabinetNote !== undefined ? { cabinetNote: input.cabinetNote } : {}),
        planningUpdatedAt: new Date().toISOString(),
      }));
      pushLog("planning_modifie", "Ligne de planning opératoire modifiée.", patientId);
    },

    postponeIntervention(patientId, date, time) {
      updatePatient(patientId, (p) => ({
        ...p,
        interventionDate: new Date(date).toISOString(),
        interventionTime: time || p.interventionTime,
        planningStatus: "reporte",
        onboardingStatus: p.onboardingComplete ? p.onboardingStatus : "a_envoyer",
        planningUpdatedAt: new Date().toISOString(),
      }));
      pushLog("planning_reporte", "Intervention reportée — onboarding à reprogrammer.", patientId);
    },

    cancelIntervention(patientId) {
      updatePatient(patientId, (p) => ({
        ...p,
        planningStatus: "annule",
        planningUpdatedAt: new Date().toISOString(),
      }));
      pushLog("planning_annule", "Intervention annulée — suivi non activé.", patientId);
    },

    resendOnboardingLink(patientId) {
      updatePatient(patientId, (p) => ({
        ...p,
        onboardingStatus: p.onboardingComplete ? "complete" : "envoye",
        planningStatus:
          p.planningStatus === "importe" ? "onboarding_envoye" : p.planningStatus,
        planningUpdatedAt: new Date().toISOString(),
      }));
      pushLog("onboarding_envoye", "Lien d'activation onboarding renvoyé au patient.", patientId);
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
      pushLog("cr_valide", "CR validé en interne (non encore visible côté chirurgien).", patientId);
    },

    publishReport(patientId) {
      // Au passage côté chirurgien, on retire les mentions « brouillon / à
      // valider par un humain » (réservées à l'espace superviseur / IA) et
      // on appose la mention de mise à disposition par l'équipe KOVELA.
      const normalize = (raw: string): string => {
        const lines = raw
          .split("\n")
          .filter((l) => !/Brouillon|à valider par un humain|synthèse opérationnelle non médicale/i.test(l));
        while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
        lines.push("");
        lines.push("Compte-rendu factuel préparé et rendu disponible par l'équipe KOVELA.");
        return lines.join("\n");
      };
      setReports((prev) =>
        prev.map((r) =>
          r.patientId === patientId
            ? { ...r, status: "disponible", content: normalize(r.content), updatedAt: new Date().toISOString() }
            : r
        )
      );
      pushLog("cr_disponible", "CR rendu disponible pour le chirurgien.", patientId);
    },

    // Préparer = brouillon factuel interne. N'ouvre PAS d'escalade.
    prepareCompilation(patientId, compilation) {
      updatePatient(patientId, (p) => ({ ...p, compilationDraft: compilation }));
      pushLog("compilation_preparee", "Compilation factuelle préparée (brouillon, non transmise).", patientId);
    },

    // Transmettre = action humaine explicite → escalade transmise au chirurgien.
    transmitCompilation(patientId) {
      const p = patients.find((x) => x.id === patientId);
      const compilation = p?.compilationDraft ?? "";
      setEscalations((prev) => {
        const existing = prev.find((e) => e.patientId === patientId && e.status !== "cloturee");
        if (existing) {
          return prev.map((e) =>
            e.id === existing.id
              ? { ...e, compilation, status: "transmise", transmittedAt: new Date().toISOString() }
              : e
          );
        }
        return [
          ...prev,
          {
            id: uid("e"),
            patientId,
            status: "transmise",
            openedAt: new Date().toISOString(),
            transmittedAt: new Date().toISOString(),
            compilation,
          },
        ];
      });
      updatePatient(patientId, (p) => ({ ...p, status: "escalade_ouverte" }));
      pushLog("escalade_transmise", "Escalade transmise au chirurgien.", patientId);
    },

    saveCabinetConfig(surgeonId, config) {
      setSurgeons((prev) =>
        prev.map((s) =>
          s.id === surgeonId
            ? { ...s, specialty: config.specialization || s.specialty, clinic: config.locations[0] || s.clinic, config: { ...config, configured: true } }
            : s
        )
      );
      pushLog("cabinet_configure", `Configuration du cabinet enregistrée (${config.vertical || config.specialization}).`);
    },

    setMandateStatus(surgeonId, status) {
      setSurgeons((prev) =>
        prev.map((s) => (s.id === surgeonId ? { ...s, config: { ...s.config, mandateStatus: status } } : s))
      );
      const label: Record<MandateStatus, string> = {
        a_creer: "à créer",
        lien_envoye: "lien GoCardless envoyé",
        mandat_actif: "mandat actif",
        prelevement_pret: "prélèvement prêt",
      };
      pushLog("mandat_gocardless", `Mandat GoCardless (fictif) — statut : ${label[status]}.`);
    },

    addAssistant(surgeonId, name) {
      const assistant: Assistant = { id: uid("a"), name, surgeonId };
      setAssistants((prev) => [...prev, assistant]);
      pushLog("assistante_invitee", `Assistante « ${name} » invitée (fictif).`);
    },

    setSupervisorFormation(supervisorId, status) {
      setSupervisorsState((prev) =>
        prev.map((s) => (s.id === supervisorId ? { ...s, formationStatus: status } : s))
      );
      const labelMap = { a_former: "à former", en_cours: "formation en cours", pret: "prêt à suivre des patients" };
      const sup = supervisorsState.find((s) => s.id === supervisorId);
      pushLog("formation_completee", `Formation superviseur ${sup?.name ?? supervisorId} — ${labelMap[status]}.`);
    },

    setSupervisorQuality(supervisorId, status) {
      setSupervisorsState((prev) =>
        prev.map((s) => (s.id === supervisorId ? { ...s, qualityStatus: status } : s))
      );
      const sup = supervisorsState.find((s) => s.id === supervisorId);
      pushLog("qualite_revue", `Revue qualité — ${sup?.name ?? supervisorId} marqué ${status === "ok" ? "OK" : "à revoir"}.`);
    },

    logQualityReview(label, status) {
      pushLog("qualite_revue", `Revue qualité — ${label} → ${status === "ok" ? "OK" : "à revoir"}.`);
    },

    qualityConversations,
    qualityCRs,
    qualityComments,
    setQualityConversationStatus(id, status, label) {
      setQualityConversations((prev) => ({ ...prev, [id]: status }));
      pushLog(
        "qualite_revue",
        `Conversation à relire — ${label} → ${status === "ok" ? "OK" : "à revoir"}.`
      );
    },
    setQualityCRStatus(id, status, label) {
      setQualityCRs((prev) => ({ ...prev, [id]: status }));
      pushLog(
        "qualite_revue",
        `CR à contrôler — ${label} → ${status === "ok" ? "OK" : "à revoir"}.`
      );
    },
    setQualityComment(id, comment, label) {
      setQualityComments((prev) => ({ ...prev, [id]: comment }));
      pushLog("qualite_commentaire", `Revue qualité commentée — ${label}.`);
    },

    logPatientConsents(patientId, prefs) {
      const fmt = (b: boolean) => (b ? "✓" : "✗");
      pushLog(
        "consentement_patient",
        `Préférences de suivi confirmées par le patient : photo ${fmt(prefs.photo)}, audio ${fmt(prefs.audio)}, relances ${fmt(prefs.relances)}, notifications ${fmt(prefs.notifications)}.`,
        patientId
      );
    },

    reportCabinetIssue(patientId) {
      pushLog(
        "signalement_cabinet",
        "Patient a signalé une erreur d'information au cabinet. Vérification à faire par l'équipe KOVELA.",
        patientId
      );
    },

    prospects,
    addProspect(input) {
      const p: Prospect = {
        id: uid("pr"),
        firstName: input.firstName,
        lastName: input.lastName,
        specialty: input.specialty,
        vertical: input.vertical,
        cabinet: input.cabinet,
        city: input.city,
        email: input.email,
        phone: input.phone,
        linkedin: input.linkedin,
        source: input.source,
        cabinetType: input.cabinetType,
        monthlyVolume: Number(input.monthlyVolume) || 0,
        interest: input.interest,
        priority: input.priority,
        status: "a_contacter",
        lastContactAt: null,
        nextAction: "Premier contact",
        nextRelanceAt: null,
        demoDone: false,
        objections: "",
        notes: [],
        onboardingLaunched: false,
        cabinetConfigured: false,
        assistantAdded: false,
        mandateStatus: "a_creer",
        isActive: false,
      };
      setProspects((prev) => [p, ...prev]);
      pushLog("crm_prospect_cree", `Prospect ${p.firstName} ${p.lastName} (${p.cabinet}) ajouté au CRM.`);
    },

    updateProspectStatus(id, status) {
      const target = prospects.find((p) => p.id === id);
      updateProspect(id, (p) => ({ ...p, status }));
      pushLog(
        "crm_statut",
        `Statut CRM modifié pour ${target?.firstName ?? ""} ${target?.lastName ?? id} → ${status}.`
      );
    },

    addProspectNote(id, text) {
      const note = { id: uid("pn"), text, author: currentUser, at: new Date().toISOString() };
      updateProspect(id, (p) => ({ ...p, notes: [note, ...p.notes] }));
      pushLog("crm_note", "Note CRM ajoutée.");
    },

    markProspectDemoDone(id) {
      updateProspect(id, (p) => ({
        ...p,
        demoDone: true,
        status: p.status === "call_prevu" || p.status === "contacte" ? "demo_faite" : p.status,
        lastContactAt: new Date().toISOString(),
      }));
      const t = prospects.find((p) => p.id === id);
      pushLog("crm_demo", `Démo marquée comme faite pour ${t?.firstName ?? ""} ${t?.lastName ?? id}.`);
    },

    scheduleProspectRelance(id, date, action) {
      updateProspect(id, (p) => ({ ...p, nextRelanceAt: date, nextAction: action || p.nextAction }));
      pushLog("crm_relance", `Relance programmée le ${date}${action ? ` — ${action}` : ""}.`);
    },

    launchProspectOnboarding(id) {
      updateProspect(id, (p) => ({
        ...p,
        onboardingLaunched: true,
        status: p.isActive ? p.status : "onboarding_cabinet",
        mandateStatus: p.mandateStatus === "a_creer" ? "lien_envoye" : p.mandateStatus,
      }));
      const t = prospects.find((p) => p.id === id);
      pushLog(
        "crm_onboarding_lance",
        `Onboarding cabinet lancé pour ${t?.firstName ?? ""} ${t?.lastName ?? id}.`
      );
    },

    activateProspectAsSurgeon(id) {
      updateProspect(id, (p) => ({
        ...p,
        isActive: true,
        status: "actif",
        cabinetConfigured: true,
        onboardingLaunched: true,
        mandateStatus: p.mandateStatus === "mandat_actif" ? p.mandateStatus : "mandat_actif",
      }));
      const t = prospects.find((p) => p.id === id);
      pushLog(
        "crm_active",
        `${t?.firstName ?? ""} ${t?.lastName ?? id} transformé(e) en chirurgien actif KOVELA.`
      );
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
    surgeon,
    assistantsFor,
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
