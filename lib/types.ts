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

export interface Patient {
  id: string;
  name: string;
  surgeonId: string;
  supervisorId: string | null;
  intervention: string;
  interventionDate: string; // ISO
  protocol: string; // ex: "J+12 / J+15"
  status: PatientStatus;
  onboardingComplete: boolean;
  activatedThisMonth: boolean;
  consentGiven: boolean;
  messages: Message[];
  notes: InternalNote[];
  lastMessageAt: string | null;
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
  | "escalade_transmise"
  | "onboarding_complete"
  | "patient_relance"
  | "suivi_cloture"
  | "note_interne";

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
