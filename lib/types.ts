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

// CRM Chirurgiens — pipeline commercial. AUCUNE donnée patient.
export type ProspectStatus =
  | "a_contacter"
  | "contacte"
  | "call_prevu"
  | "demo_faite"
  | "en_reflexion"
  | "accord_verbal"
  | "onboarding_cabinet"
  | "actif"
  | "perdu";

export type InterestLevel = "froid" | "tiede" | "chaud";
export type Priority = "basse" | "moyenne" | "haute";
export type CabinetType = "solo" | "groupe" | "clinique";

export interface ProspectNote {
  id: string;
  text: string;
  author: string;
  at: string;
}

export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  vertical: string;
  cabinet: string;
  city: string;
  email: string; // fictif
  phone: string; // fictif
  linkedin: string; // fictif
  source: string;
  cabinetType: CabinetType;
  monthlyVolume: number; // patients/mois estimés
  interest: InterestLevel;
  priority: Priority;
  status: ProspectStatus;
  lastContactAt: string | null;
  nextAction: string;
  nextRelanceAt: string | null;
  demoDone: boolean;
  objections: string;
  notes: ProspectNote[];
  onboardingLaunched: boolean;
  cabinetConfigured: boolean;
  assistantAdded: boolean;
  mandateStatus: MandateStatus;
  isActive: boolean;
}

export type FollowType = "standard" | "renforce" | "premium";

export type MandateStatus = "a_creer" | "lien_envoye" | "mandat_actif" | "prelevement_pret";

export interface CabinetContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface PatientPrefs {
  photo: boolean;
  audio: boolean;
  relancesOnboarding: boolean;
  rappelSilencieux: boolean;
}

// Configuration de suivi du cabinet (onboarding chirurgien). Non médical.
export interface CabinetConfig {
  specialization: string; // spécialisation principale
  vertical: string; // verticale KOVELA associée
  locations: string[]; // lieux d'intervention / cliniques
  defaultProtocol: string; // durée de suivi par défaut (J+8 / J+15…)
  // Durées de suivi proposées par défaut selon le type d'intervention.
  // Strictement opérationnel — décision opérationnelle du cabinet, jamais imposée par KOVELA.
  interventionDurations: Record<string, string>;
  followType: FollowType; // typologie de suivi
  crFrequency: string; // fréquence des comptes-rendus
  transmissionChannel: string; // canal de transmission cabinet
  cabinetContact: CabinetContact; // contact de transmission cabinet
  workingHours: string; // horaires de traitement souhaités
  patientPrefs: PatientPrefs; // préférences de suivi opérationnel
  welcomeMessage: string; // message d'accueil cabinet (non médical)
  mandateStatus: MandateStatus; // mandat GoCardless fictif
  configured: boolean;
}

export interface Surgeon {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  config: CabinetConfig;
}

export interface Assistant {
  id: string;
  name: string;
  surgeonId: string;
}

export type FormationStatus = "a_former" | "en_cours" | "pret";
export type QualityStatus = "ok" | "a_revoir";

export interface Supervisor {
  id: string;
  name: string;
  initials: string;
  formationStatus: FormationStatus;
  qualityStatus: QualityStatus;
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
  | "planning_import"
  | "cabinet_configure"
  | "mandat_gocardless"
  | "assistante_invitee"
  | "crm_prospect_cree"
  | "crm_statut"
  | "crm_note"
  | "crm_demo"
  | "crm_relance"
  | "crm_onboarding_lance"
  | "crm_active"
  | "qualite_revue"
  | "formation_completee"
  | "consentement_patient"
  | "signalement_cabinet";

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
