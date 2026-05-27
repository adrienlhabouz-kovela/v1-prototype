// KOVELA — prototype. Données 100% fictives. Aucune donnée réelle.

export type Role = "admin" | "superviseur" | "chirurgien" | "patient";

export type PatientStatus =
  | "onboarding_incomplet"
  | "actif"
  | "silencieux"
  | "escalade_ouverte"
  | "cr_en_attente"
  | "cloture";

export type EscalationStatus = "ouverte" | "transmise" | "cloturee";

export type CRStatus = "brouillon" | "valide" | "disponible";

export type MessageAuthor = "patient" | "superviseur" | "systeme";

export interface Surgeon {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
}

export interface Assistant {
  id: string;
  name: string;
  surgeonId: string;
}

export interface Supervisor {
  id: string;
  name: string;
  initials: string;
}

export interface Attachment {
  id: string;
  kind: "photo" | "audio";
  label: string;
  // placeholder uniquement — aucune vraie pièce jointe
}

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  at: string; // ISO
  attachments?: Attachment[];
  treated?: boolean;
}

export interface InternalNote {
  id: string;
  author: string;
  text: string;
  at: string;
}

export interface Escalation {
  id: string;
  patientId: string;
  status: EscalationStatus;
  openedAt: string;
  transmittedAt?: string;
  // compilation factuelle (pas d'interprétation médicale)
  compilation?: string;
}

export interface ClinicalReport {
  id: string;
  patientId: string;
  status: CRStatus;
  period: string;
  content: string;
  updatedAt: string;
}

// Statut d'onboarding (planning opératoire).
export type OnboardingStatus = "a_envoyer" | "envoye" | "complete" | "relance";

// Statut KOVELA dans le planning opératoire (point d'entrée).
export type PlanningStatus =
  | "importe"
  | "onboarding_envoye"
  | "actif"
  | "reporte"
  | "annule";

export interface Patient {
  id: string;
  name: string;
  surgeonId: string;
  supervisorId: string | null;
  intervention: string;
  interventionDate: string; // ISO
  interventionTime: string; // ex: "09:30"
  clinic: string; // lieu / clinique
  phone: string; // fictif
  email: string; // fictif
  cabinetNote: string;
  protocol: string; // ex: "J+12 / J+15"
  status: PatientStatus;
  onboardingStatus: OnboardingStatus;
  planningStatus: PlanningStatus;
  planningUpdatedAt: string;
  onboardingComplete: boolean;
  activatedThisMonth: boolean;
  consentGiven: boolean;
  messages: Message[];
  notes: InternalNote[];
  lastMessageAt: string | null;
  // Brouillon de compilation factuelle préparé (interne), non encore transmis.
  compilationDraft?: string;
}

export type AiFunction =
  | "resume_conversation"
  | "preparation_cr"
  | "reformulation"
  | "compilation_escalade";

export type AiDecision = "propose" | "accepte" | "modifie" | "refuse";

export interface AiLog {
  id: string;
  fn: AiFunction;
  promptVersion: string;
  at: string;
  user: string;
  patientId?: string;
  decision: AiDecision;
}

export type LogKind =
  | "patient_attribue"
  | "message_envoye"
  | "cr_prepare"
  | "cr_valide"
  | "cr_disponible"
  | "ia_utilisee"
  | "ia_suggestion"
  | "compilation_preparee"
  | "escalade_transmise"
  | "onboarding_complete"
  | "onboarding_envoye"
  | "patient_relance"
  | "suivi_cloture"
  | "note_interne"
  | "planning_ajout"
  | "planning_modifie"
  | "planning_reporte"
  | "planning_annule"
  | "planning_import";

export interface LogEntry {
  id: string;
  kind: LogKind;
  at: string;
  user: string;
  patientId?: string;
  detail: string;
}

export interface Template {
  id: string;
  title: string;
  body: string;
}
