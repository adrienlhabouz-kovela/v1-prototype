"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, CardHeader, PageHeader } from "@/components/ui";
import { useKovela } from "@/lib/store";

const MY_SURGEON_ID = "s1";

// ---------------------------------------------------------------------------
// Catalogue d'interventions — esthétique plastique. Le chirurgien coche
// uniquement ce qu'il pratique, puis configure en détail celles qu'il active
// pour KOVELA (priorité V1).
// ---------------------------------------------------------------------------

type FamilyKey =
  | "visage_cou"
  | "seins"
  | "silhouette"
  | "combinees"
  | "medecine_esthetique";

const INTERVENTION_FAMILIES: {
  key: FamilyKey;
  label: string;
  hint?: string;
  optional?: boolean;
  items: string[];
}[] = [
  {
    key: "visage_cou",
    label: "Visage / cou",
    items: [
      "Rhinoplastie",
      "Blépharoplastie supérieure",
      "Blépharoplastie inférieure",
      "Blépharoplastie 4 paupières",
      "Lifting cervico-facial",
      "Mini-lifting / lifting inférieur",
      "Lifting temporal / sourcils",
      "Lifting frontal",
      "Otoplastie",
      "Génioplastie / mentoplastie",
      "Implants menton / pommettes",
      "Lipofilling visage",
      "Bichectomie",
      "Chirurgie de la calvitie / greffe capillaire",
      "Dermabrasion / peeling chirurgical",
      "Autre visage / cou",
    ],
  },
  {
    key: "seins",
    label: "Seins",
    items: [
      "Augmentation mammaire par implants",
      "Augmentation mammaire par lipofilling",
      "Changement / retrait d'implants",
      "Cure de ptôse / mastopexie",
      "Réduction mammaire",
      "Symétrisation mammaire",
      "Reconstruction mammaire",
      "Gynécomastie",
      "Autre sein",
    ],
  },
  {
    key: "silhouette",
    label: "Silhouette / corps",
    items: [
      "Liposuccion",
      "Liposuccion haute définition",
      "Abdominoplastie",
      "Mini-abdominoplastie",
      "Bodylift",
      "Lifting des bras",
      "Lifting des cuisses",
      "Lifting du dos / correction plis du dos",
      "BBL / lipofilling fessier",
      "Implants fessiers",
      "Implants mollets",
      "Chirurgie intime",
      "Reprises / révisions",
      "Autre silhouette / corps",
    ],
  },
  {
    key: "combinees",
    label: "Interventions combinées",
    hint: "Les interventions combinées peuvent nécessiter des règles de suivi spécifiques (jalons, photos, transmission).",
    items: [
      "Augmentation mammaire + mastopexie",
      "Abdominoplastie + liposuccion",
      "Mommy makeover",
      "Lifting + blépharoplastie",
      "Liposuccion + BBL",
      "Autre combinaison",
    ],
  },
  {
    key: "medecine_esthetique",
    label: "Médecine esthétique",
    hint: "Optionnel / later — le wedge V1 KOVELA reste la chirurgie esthétique post-op.",
    optional: true,
    items: [
      "Toxine botulique",
      "Acide hyaluronique",
      "Skinboosters / mésothérapie",
      "Lasers / peelings médicaux",
      "Fils tenseurs",
      "Autre médecine esthétique",
    ],
  },
];

type CasGroup = "communication" | "elements_rapportes" | "medicaments_soins" | "organisation";

interface CasDef {
  label: string;
  group: CasGroup;
}

const CAS_TRANSVERSES_DEFS: CasDef[] = [
  // Communication & comportement
  { label: "Patient silencieux", group: "communication" },
  { label: "Message répété", group: "communication" },
  { label: "Patient anxieux", group: "communication" },
  { label: "Demande d'avis médical", group: "communication" },
  { label: "Demande de modification de traitement", group: "communication" },
  { label: "Proche / accompagnant qui écrit", group: "communication" },
  { label: "Patient contacte plusieurs canaux", group: "communication" },
  // Éléments rapportés par le patient
  { label: "Photo absente", group: "elements_rapportes" },
  { label: "Photo floue", group: "elements_rapportes" },
  { label: "Douleur rapportée", group: "elements_rapportes" },
  { label: "Saignement rapporté", group: "elements_rapportes" },
  { label: "Gonflement rapporté", group: "elements_rapportes" },
  { label: "Fièvre rapportée", group: "elements_rapportes" },
  { label: "Écoulement / pansement", group: "elements_rapportes" },
  // Médicaments, soins & ordonnances
  { label: "Question sur ordonnance", group: "medicaments_soins" },
  { label: "Question sur antidouleur", group: "medicaments_soins" },
  { label: "Question sur antibiotique", group: "medicaments_soins" },
  { label: "Oubli de prise", group: "medicaments_soins" },
  { label: "Effet secondaire déclaré", group: "medicaments_soins" },
  { label: "Demande de renouvellement", group: "medicaments_soins" },
  { label: "Question pansement", group: "medicaments_soins" },
  { label: "Question douche / soins", group: "medicaments_soins" },
  { label: "Soins infirmiers non réalisés", group: "medicaments_soins" },
  { label: "Infirmière qui pose une question", group: "medicaments_soins" },
  // Organisation
  { label: "Patient hors période de suivi", group: "organisation" },
  { label: "Patient hors horaires", group: "organisation" },
];

const CAS_GROUP_LABELS: Record<CasGroup, { title: string; hint: string }> = {
  communication: {
    title: "Communication & comportement",
    hint: "Demandes du patient, posture, multi-canaux.",
  },
  elements_rapportes: {
    title: "Éléments rapportés par le patient",
    hint: "Photos, douleur, saignement, fièvre… Ce que KOVELA collecte et transmet selon vos règles.",
  },
  medicaments_soins: {
    title: "Médicaments, soins & ordonnances",
    hint: "KOVELA ne modifie pas, n'interprète pas et ne commente pas une prescription. Les demandes sont transmises au cabinet selon vos règles.",
  },
  organisation: {
    title: "Organisation",
    hint: "Hors période, hors horaires.",
  },
};

const INDISPONIBILITES_DEFS: string[] = [
  "Chirurgien au bloc",
  "Cabinet fermé",
  "Assistante absente",
  "Week-end",
  "Jour férié",
  "Vacances cabinet",
  "Remplaçant / confrère",
  "Clinique à contacter",
  "Numéro d'urgence cabinet existant",
];

// ---------------------------------------------------------------------------
// Modèle de données
// ---------------------------------------------------------------------------

type CompletionMode = "essentiel" | "complet" | "avec_kovela";

interface ContactAutorise {
  id: string;
  nom: string;
  role: string;
  email: string;
  telephone: string;
  priorite: "primaire" | "secondaire" | "back_up";
}

interface CabinetState {
  chirurgien: string;
  cabinet: string;
  specialite: string;
  lieuPrincipal: string;
  lieuxOperatoires: string;
  assistanteReferente: string;
  contacts: ContactAutorise[];
  canalPrioritaire: string;
  canalSecondaire: string;
  horaires: string;
  conduiteHorsHoraires: string;
  delaiNiveau1: string;
  delaiNiveau2: string;
  delaiNiveau3: string;
  qRepondPostOp: string;
  qCanauxUtilises: string;
  qDestinataireTransmissions: string;
  qCanalPrioritaire: string;
}

interface DoctrineState {
  tonPatients: string;
  proactivite: string;
  frequenceContact: string;
  kovelaPeutRepondre: string;
  kovelaNeJamaisRepondre: string;
  retourCabinetSysteme: string;
  conduiteAvisMedical: string;
  conduiteModifTraitement: string;
  conduitePatientAnxieux: string;
  conduiteInsistePourChirurgien: string;
  preferencesTransmission: string;
  preferencesCR: string;
}

interface DocumentsRemisState {
  fichePostOpRemise: boolean;
  format: string; // papier / PDF / email / Doctolib / autre
  consignesStandards: string;
  consignesSpecifiques: string;
  kovelaPeutRappeler: string;
  kovelaNeJamaisReformuler: string;
  documentSourceArecuperer: string;
}

interface Jalon {
  id: string;
  jour: string;
  objectif: string;
  pointsAttention: string;
  evolutionHabituelle: string;
  elementsTransmettre: string;
  remarque: string;
}

interface NiveauTransmission {
  situations: string;
  conduite: string;
  delai: string;
  elementsJoindre: string;
  canal: string;
  contactDestinataire: string;
  information: string;
}

interface InterventionState {
  key: string;
  family: FamilyKey;
  label: string;
  pratiquee: boolean;
  volumeMensuel: string;
  frequence: "frequente" | "occasionnelle" | "";
  suiviKovela: boolean;
  prioriteV1: boolean;
  // Parcours
  dureeSuivi: string;
  momentsContact: string;
  jalons: Jalon[];
  questionsAuPatient: string;
  informationsRappeler: string;
  photosAttendues: boolean;
  typePhotos: string;
  photoJours: string;
  photoAngles: string;
  photoConsignePatient: string;
  photoFloueConduite: string;
  photoSensibleConduite: string;
  photoTransmissionSystematique: boolean;
  // RDV de contrôle par intervention
  rdvControleJour: string;
  rdvControleQuiPlanifie: string;
  rdvControleKovelaRappelle: boolean;
  rdvControleSansRdv: string;
  rdvControleAnnulation: string;
  rdvControleTransmission: string;
  soinsRappeler: string;
  consignesGenerales: string;
  sujetsInterdits: string;
  remarques: string;
  copieDepuis: string;
  // Règles de transmission
  niveau1: NiveauTransmission;
  niveau2: NiveauTransmission;
  niveau3: NiveauTransmission;
}

interface CasTransverseState {
  key: string;
  label: string;
  group: CasGroup;
  conduiteAutorisee: string;
  conduiteInterdite: string;
  transmissionCabinet: boolean;
  delai: string;
  canal: string;
  remarques: string;
}

interface IndisponibiliteState {
  key: string;
  label: string;
  conduiteAutorisee: string;
  canalSecondaire: string;
  delai: string;
  messagePatient: string;
  contactBackUp: string;
}

interface ComptesRendusState {
  format: "court" | "standard" | "detaille" | "";
  crIntermediaires: boolean;
  frequence: string;
  canal: string;
  destinataires: string;
  niveauDetail: string;
  informationsInclure: string;
  informationsExclure: string;
  exportPDF: boolean;
  synthesePatient: boolean;
  syntheseMensuelle: boolean;
  libellesPreferes: string;
  ton: string;
  // Questions complémentaires
  crSiNominal: "tous" | "exceptions" | "";
  recapHebdomadaire: boolean;
  recapPatientACloture: boolean;
  crIntermediaireSiAnxieux: boolean;
}

interface ReferentielStatusState {
  status: "draft" | "kovela_review" | "surgeon_validated" | "active" | "archived";
  prochaineRevue: string;
  validatedBySurgeonAt: string;
  reviewedByKovelaAt: string;
}

interface ValidationState {
  refleteMesPreferences: boolean;
  comprendNonSubstitution: boolean;
  comprendRelectureKovela: boolean;
}

interface Referentiel {
  modeCompletion: CompletionMode | "";
  cabinet: CabinetState;
  doctrine: DoctrineState;
  documentsRemis: DocumentsRemisState;
  interventions: InterventionState[];
  casTransverses: CasTransverseState[];
  indisponibilites: IndisponibiliteState[];
  comptesRendus: ComptesRendusState;
  validation: ValidationState;
  statut: ReferentielStatusState;
}

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

const newContact = (priorite: ContactAutorise["priorite"]): ContactAutorise => ({
  id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  nom: "",
  role: "",
  email: "",
  telephone: "",
  priorite,
});

const newJalon = (): Jalon => ({
  id: `jalon-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  jour: "",
  objectif: "",
  pointsAttention: "",
  evolutionHabituelle: "",
  elementsTransmettre: "",
  remarque: "",
});

const emptyNiveau = (): NiveauTransmission => ({
  situations: "",
  conduite: "",
  delai: "",
  elementsJoindre: "",
  canal: "",
  contactDestinataire: "",
  information: "",
});

const buildInterventionsCatalog = (): InterventionState[] => {
  const all: InterventionState[] = [];
  INTERVENTION_FAMILIES.forEach((fam) => {
    fam.items.forEach((label) => {
      const key = `${fam.key}::${label}`;
      all.push({
        key,
        family: fam.key,
        label,
        pratiquee: false,
        volumeMensuel: "",
        frequence: "",
        suiviKovela: false,
        prioriteV1: false,
        dureeSuivi: "",
        momentsContact: "",
        jalons: [],
        questionsAuPatient: "",
        informationsRappeler: "",
        photosAttendues: false,
        typePhotos: "",
        photoJours: "",
        photoAngles: "",
        photoConsignePatient: "",
        photoFloueConduite: "",
        photoSensibleConduite: "",
        photoTransmissionSystematique: false,
        rdvControleJour: "",
        rdvControleQuiPlanifie: "",
        rdvControleKovelaRappelle: false,
        rdvControleSansRdv: "",
        rdvControleAnnulation: "",
        rdvControleTransmission: "",
        soinsRappeler: "",
        consignesGenerales: "",
        sujetsInterdits: "",
        remarques: "",
        copieDepuis: "",
        niveau1: emptyNiveau(),
        niveau2: emptyNiveau(),
        niveau3: emptyNiveau(),
      });
    });
  });
  return all;
};

const initialReferentiel = (defaults: Partial<CabinetState>): Referentiel => ({
  modeCompletion: "",
  cabinet: {
    chirurgien: defaults.chirurgien ?? "",
    cabinet: defaults.cabinet ?? "",
    specialite: defaults.specialite ?? "",
    lieuPrincipal: defaults.lieuPrincipal ?? "",
    lieuxOperatoires: "",
    assistanteReferente: "",
    contacts: [newContact("primaire")],
    canalPrioritaire: "",
    canalSecondaire: "",
    horaires: "",
    conduiteHorsHoraires: "",
    delaiNiveau1: "",
    delaiNiveau2: "",
    delaiNiveau3: "",
    qRepondPostOp: "",
    qCanauxUtilises: "",
    qDestinataireTransmissions: "",
    qCanalPrioritaire: "",
  },
  doctrine: {
    tonPatients: "",
    proactivite: "",
    frequenceContact: "",
    kovelaPeutRepondre: "",
    kovelaNeJamaisRepondre: "",
    retourCabinetSysteme: "",
    conduiteAvisMedical: "",
    conduiteModifTraitement: "",
    conduitePatientAnxieux: "",
    conduiteInsistePourChirurgien: "",
    preferencesTransmission: "",
    preferencesCR: "",
  },
  documentsRemis: {
    fichePostOpRemise: false,
    format: "",
    consignesStandards: "",
    consignesSpecifiques: "",
    kovelaPeutRappeler: "",
    kovelaNeJamaisReformuler: "",
    documentSourceArecuperer: "",
  },
  interventions: buildInterventionsCatalog(),
  casTransverses: CAS_TRANSVERSES_DEFS.map((def) => ({
    key: def.label,
    label: def.label,
    group: def.group,
    conduiteAutorisee: "",
    conduiteInterdite: "",
    transmissionCabinet: false,
    delai: "",
    canal: "",
    remarques: "",
  })),
  indisponibilites: INDISPONIBILITES_DEFS.map((label) => ({
    key: label,
    label,
    conduiteAutorisee: "",
    canalSecondaire: "",
    delai: "",
    messagePatient: "",
    contactBackUp: "",
  })),
  comptesRendus: {
    format: "",
    crIntermediaires: false,
    frequence: "",
    canal: "",
    destinataires: "",
    niveauDetail: "",
    informationsInclure: "",
    informationsExclure: "",
    exportPDF: false,
    synthesePatient: false,
    syntheseMensuelle: false,
    libellesPreferes: "",
    ton: "",
    crSiNominal: "",
    recapHebdomadaire: false,
    recapPatientACloture: false,
    crIntermediaireSiAnxieux: false,
  },
  validation: {
    refleteMesPreferences: false,
    comprendNonSubstitution: false,
    comprendRelectureKovela: false,
  },
  statut: {
    status: "draft",
    prochaineRevue: "",
    validatedBySurgeonAt: "",
    reviewedByKovelaAt: "",
  },
});

// ---------------------------------------------------------------------------
// UI utilitaires
// ---------------------------------------------------------------------------

const STEPS = [
  "Cabinet & organisation",
  "Doctrine générale",
  "Interventions pratiquées",
  "Parcours de suivi",
  "Règles de transmission",
  "Cas transverses",
  "Comptes-rendus",
  "Récapitulatif & export",
] as const;

const inputCls =
  "w-full rounded-lg border border-navy-900/[0.08] bg-white px-3 py-2 text-[13px] text-navy-900 outline-none transition-colors focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/10";
const textareaCls = `${inputCls} resize-none leading-relaxed`;

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-medium tracking-tight text-charcoal/65">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[10.5px] leading-relaxed text-charcoal/45">{hint}</span>
      )}
    </label>
  );
}

function SubSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="border-b border-navy-900/[0.05] pb-2">
        <h3 className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
          {title}
        </h3>
        {hint && <p className="mt-1 text-[11.5px] leading-relaxed text-charcoal/55">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-white px-3 py-2 text-[12.5px] tracking-tight text-charcoal/80 ring-1 ring-navy-900/[0.06] transition-colors hover:ring-navy-900/[0.12]">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-navy-200 text-teal-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export default function ReferentielFonctionnementPage() {
  const k = useKovela();
  const me = k.surgeon(MY_SURGEON_ID);
  const assistants = k.assistantsFor(MY_SURGEON_ID);

  const [step, setStep] = useState(0);
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [r, setR] = useState<Referentiel>(() =>
    initialReferentiel({
      chirurgien: me?.name ?? "",
      cabinet: me?.config?.locations?.[0] ?? "",
      specialite: me?.config?.specialization ?? "",
      lieuPrincipal: me?.config?.locations?.[0] ?? "",
    })
  );

  // Helpers de mise à jour ----------------------------------------------------

  const setCabinet = <K extends keyof CabinetState>(key: K, val: CabinetState[K]) =>
    setR((s) => ({ ...s, cabinet: { ...s.cabinet, [key]: val } }));

  const setDoctrine = <K extends keyof DoctrineState>(key: K, val: DoctrineState[K]) =>
    setR((s) => ({ ...s, doctrine: { ...s.doctrine, [key]: val } }));

  const setDocs = <K extends keyof DocumentsRemisState>(key: K, val: DocumentsRemisState[K]) =>
    setR((s) => ({ ...s, documentsRemis: { ...s.documentsRemis, [key]: val } }));

  const setIndispo = (key: string, patch: Partial<IndisponibiliteState>) =>
    setR((s) => ({
      ...s,
      indisponibilites: s.indisponibilites.map((i) =>
        i.key === key ? { ...i, ...patch } : i
      ),
    }));

  const setStatut = <K extends keyof ReferentielStatusState>(
    key: K,
    val: ReferentielStatusState[K]
  ) => setR((s) => ({ ...s, statut: { ...s.statut, [key]: val } }));

  const setIntervention = (key: string, patch: Partial<InterventionState>) =>
    setR((s) => ({
      ...s,
      interventions: s.interventions.map((i) => (i.key === key ? { ...i, ...patch } : i)),
    }));

  const setNiveau = (
    key: string,
    niveau: "niveau1" | "niveau2" | "niveau3",
    patch: Partial<NiveauTransmission>
  ) =>
    setR((s) => ({
      ...s,
      interventions: s.interventions.map((i) =>
        i.key === key ? { ...i, [niveau]: { ...i[niveau], ...patch } } : i
      ),
    }));

  const addJalon = (key: string) =>
    setR((s) => ({
      ...s,
      interventions: s.interventions.map((i) =>
        i.key === key ? { ...i, jalons: [...i.jalons, newJalon()] } : i
      ),
    }));

  const updateJalon = (key: string, jalonId: string, patch: Partial<Jalon>) =>
    setR((s) => ({
      ...s,
      interventions: s.interventions.map((i) =>
        i.key === key
          ? { ...i, jalons: i.jalons.map((j) => (j.id === jalonId ? { ...j, ...patch } : j)) }
          : i
      ),
    }));

  const removeJalon = (key: string, jalonId: string) =>
    setR((s) => ({
      ...s,
      interventions: s.interventions.map((i) =>
        i.key === key ? { ...i, jalons: i.jalons.filter((j) => j.id !== jalonId) } : i
      ),
    }));

  const setCas = (key: string, patch: Partial<CasTransverseState>) =>
    setR((s) => ({
      ...s,
      casTransverses: s.casTransverses.map((c) => (c.key === key ? { ...c, ...patch } : c)),
    }));

  const setCR = <K extends keyof ComptesRendusState>(key: K, val: ComptesRendusState[K]) =>
    setR((s) => ({ ...s, comptesRendus: { ...s.comptesRendus, [key]: val } }));

  const setValidation = <K extends keyof ValidationState>(key: K, val: ValidationState[K]) =>
    setR((s) => ({ ...s, validation: { ...s.validation, [key]: val } }));

  // Contacts ------------------------------------------------------------------

  const addContact = () =>
    setR((s) => ({
      ...s,
      cabinet: { ...s.cabinet, contacts: [...s.cabinet.contacts, newContact("secondaire")] },
    }));

  const updateContact = (id: string, patch: Partial<ContactAutorise>) =>
    setR((s) => ({
      ...s,
      cabinet: {
        ...s.cabinet,
        contacts: s.cabinet.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      },
    }));

  const removeContact = (id: string) =>
    setR((s) => ({
      ...s,
      cabinet: { ...s.cabinet, contacts: s.cabinet.contacts.filter((c) => c.id !== id) },
    }));

  // Dérivés -------------------------------------------------------------------

  const pratiquees = useMemo(
    () => r.interventions.filter((i) => i.pratiquee),
    [r.interventions]
  );
  const prioriteV1 = useMemo(
    () => pratiquees.filter((i) => i.prioriteV1 && i.suiviKovela),
    [pratiquees]
  );
  const totalPratiquees = pratiquees.length;
  const totalPriorite = prioriteV1.length;

  // Complétude approximative (pour la barre de progression) -------------------
  const completion = useMemo(() => {
    const totals = STEPS.map((_, idx) => {
      switch (idx) {
        case 0: {
          const c = r.cabinet;
          const fields = [
            c.chirurgien,
            c.cabinet,
            c.specialite,
            c.lieuPrincipal,
            c.canalPrioritaire,
            c.horaires,
            c.conduiteHorsHoraires,
          ];
          const filled = fields.filter((v) => v.trim().length > 0).length;
          return Math.round((filled / fields.length) * 100);
        }
        case 1: {
          const d = r.doctrine;
          const fields = Object.values(d);
          const filled = fields.filter((v) => v.trim().length > 0).length;
          return Math.round((filled / fields.length) * 100);
        }
        case 2:
          return totalPratiquees > 0 ? 100 : 0;
        case 3:
          return totalPriorite === 0
            ? 0
            : Math.round(
                (prioriteV1.filter((i) => i.dureeSuivi || i.jalons.length > 0).length /
                  totalPriorite) *
                  100
              );
        case 4:
          return totalPriorite === 0
            ? 0
            : Math.round(
                (prioriteV1.filter(
                  (i) => i.niveau1.situations || i.niveau2.situations || i.niveau3.situations
                ).length /
                  totalPriorite) *
                  100
              );
        case 5: {
          const renseignes = r.casTransverses.filter(
            (c) => c.conduiteAutorisee || c.transmissionCabinet
          ).length;
          return Math.round((renseignes / r.casTransverses.length) * 100);
        }
        case 6: {
          const c = r.comptesRendus;
          return c.format && c.frequence && c.canal ? 100 : c.format ? 50 : 0;
        }
        case 7: {
          const v = r.validation;
          const filled =
            (v.refleteMesPreferences ? 1 : 0) +
            (v.comprendNonSubstitution ? 1 : 0) +
            (v.comprendRelectureKovela ? 1 : 0);
          return Math.round((filled / 3) * 100);
        }
        default:
          return 0;
      }
    });
    return totals;
  }, [r, totalPratiquees, totalPriorite, prioriteV1]);

  const overallProgress =
    Math.round(completion.reduce((a, b) => a + b, 0) / completion.length);

  // Export --------------------------------------------------------------------

  const exportJson = () => {
    const filteredInterventions = r.interventions.filter((i) => i.pratiquee);
    const nowIso = new Date().toISOString();
    const payload = {
      meta: {
        version: "0.1",
        date_saisie: nowIso,
        type: "referentiel_fonctionnement_chirurgien",
        donnees: "configuration_cabinet_sans_donnees_patient",
        prototype: true,
      },
      referentiel_status: {
        status: r.statut.status,
        version: "0.1",
        created_at: nowIso,
        updated_at: nowIso,
        validated_by_surgeon_at: r.statut.validatedBySurgeonAt || "",
        reviewed_by_kovela_at: r.statut.reviewedByKovelaAt || "",
        next_review_due: r.statut.prochaineRevue || "",
      },
      workflow_context: {
        stage: "post_onboarding",
        cabinet_status: "active_initial",
        payment_status: "mandate_ready",
        assisted_completion: r.modeCompletion === "avec_kovela",
        completion_mode: r.modeCompletion || "non_renseigne",
      },
      cabinet: r.cabinet,
      doctrine_generale: r.doctrine,
      documents_consignes: {
        fiche_post_op_remise: r.documentsRemis.fichePostOpRemise,
        format: r.documentsRemis.format,
        consignes_standards: r.documentsRemis.consignesStandards,
        consignes_specifiques: r.documentsRemis.consignesSpecifiques,
        kovela_peut_rappeler: r.documentsRemis.kovelaPeutRappeler,
        kovela_ne_jamais_reformuler: r.documentsRemis.kovelaNeJamaisReformuler,
        document_source_a_recuperer: r.documentsRemis.documentSourceArecuperer,
      },
      interventions: filteredInterventions.map((i) => ({
        family: i.family,
        label: i.label,
        pratiquee: i.pratiquee,
        volume_mensuel: i.volumeMensuel,
        frequence: i.frequence,
        suivi_kovela: i.suiviKovela,
        priorite_v1: i.prioriteV1,
        parcours: {
          duree_suivi: i.dureeSuivi,
          moments_contact: i.momentsContact,
          jalons: i.jalons.map((j) => ({
            jour: j.jour,
            objectif: j.objectif,
            points_attention: j.pointsAttention,
            evolution_habituelle: j.evolutionHabituelle,
            elements_transmettre: j.elementsTransmettre,
            remarque: j.remarque,
          })),
          questions_au_patient: i.questionsAuPatient,
          informations_rappeler: i.informationsRappeler,
          photos: {
            attendues: i.photosAttendues,
            type: i.typePhotos,
            jours: i.photoJours,
            angles: i.photoAngles,
            consigne_patient: i.photoConsignePatient,
            floue_insuffisante_conduite: i.photoFloueConduite,
            sensible_intime_conduite: i.photoSensibleConduite,
            transmission_systematique_cabinet: i.photoTransmissionSystematique,
            note_doctrine:
              "KOVELA ne réalise pas d'interprétation médicale des photos. Les photos sont collectées et transmises selon les règles définies.",
          },
          rdv_controle: {
            jour: i.rdvControleJour,
            qui_planifie: i.rdvControleQuiPlanifie,
            kovela_rappelle_au_patient: i.rdvControleKovelaRappelle,
            si_pas_de_rdv: i.rdvControleSansRdv,
            si_annulation_report: i.rdvControleAnnulation,
            transmission_cabinet: i.rdvControleTransmission,
          },
          soins_rappeler: i.soinsRappeler,
          consignes_generales: i.consignesGenerales,
          sujets_interdits: i.sujetsInterdits,
          remarques: i.remarques,
          copie_depuis: i.copieDepuis,
        },
        regles_transmission: {
          niveau_1_suivi_habituel: i.niveau1,
          niveau_2_a_revoir_a_transmettre: i.niveau2,
          niveau_3_transmission_prioritaire: i.niveau3,
        },
      })),
      cas_transverses: r.casTransverses.map((c) => ({
        cas: c.label,
        groupe: c.group,
        conduite_autorisee: c.conduiteAutorisee,
        conduite_interdite: c.conduiteInterdite,
        transmission_cabinet: c.transmissionCabinet,
        delai: c.delai,
        canal: c.canal,
        remarques: c.remarques,
      })),
      indisponibilites_cabinet: r.indisponibilites.map((ind) => ({
        cas: ind.label,
        conduite_autorisee: ind.conduiteAutorisee,
        canal_secondaire: ind.canalSecondaire,
        delai: ind.delai,
        message_patient: ind.messagePatient,
        contact_back_up: ind.contactBackUp,
      })),
      regle_situation_urgente:
        "Si le patient décrit une situation urgente ou inquiétante, KOVELA lui rappelle de contacter les services d'urgence 15 / 112 et transmet l'information au cabinet selon le canal défini.",
      comptes_rendus: r.comptesRendus,
      validation: r.validation,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kovela-referentiel-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportToast("Export JSON téléchargé.");
    setTimeout(() => setExportToast(null), 3000);
  };

  const copySummary = async () => {
    const lines: string[] = [];
    lines.push("Référentiel de fonctionnement — KOVELA");
    lines.push(`Cabinet : ${r.cabinet.cabinet || "—"}`);
    lines.push(`Chirurgien : ${r.cabinet.chirurgien || "—"}`);
    lines.push(`Spécialité : ${r.cabinet.specialite || "—"}`);
    lines.push(`Mode de complétion : ${r.modeCompletion || "non renseigné"}`);
    lines.push("");
    lines.push(`Interventions pratiquées : ${totalPratiquees}`);
    lines.push(`Interventions prioritaires V1 : ${totalPriorite}`);
    if (prioriteV1.length > 0) {
      lines.push("");
      lines.push("Priorité V1 :");
      prioriteV1.forEach((i) => lines.push(`  • ${i.label}`));
    }
    lines.push("");
    lines.push(`Format CR souhaité : ${r.comptesRendus.format || "—"}`);
    lines.push(`Canal CR : ${r.comptesRendus.canal || "—"}`);
    lines.push("");
    lines.push("Validation :");
    lines.push(
      `  • Reflète les préférences : ${r.validation.refleteMesPreferences ? "oui" : "non"}`
    );
    lines.push(
      `  • Non-substitution comprise : ${r.validation.comprendNonSubstitution ? "oui" : "non"}`
    );
    lines.push(
      `  • Relecture KOVELA comprise : ${r.validation.comprendRelectureKovela ? "oui" : "non"}`
    );
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setExportToast("Résumé copié dans le presse-papier.");
    } catch {
      setExportToast("Copie impossible — utilisez l'export JSON.");
    }
    setTimeout(() => setExportToast(null), 3000);
  };

  // Rendu ---------------------------------------------------------------------

  if (!me) return null;

  return (
    <Shell>
      <PageHeader
        eyebrow="Référentiel de fonctionnement"
        title="Construisons votre référentiel de suivi"
        subtitle="Votre cabinet est activé. Cette étape permet à l'équipe KOVELA de préparer le suivi post-opératoire selon vos habitudes, vos jalons et vos règles de transmission."
      >
        <Link href="/chirurgien">
          <Button variant="ghost">Retour à l'espace chirurgien</Button>
        </Link>
      </PageHeader>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Cadrage de la version */}
        <div className="rounded-2xl border border-teal-200/40 bg-teal-50/40 px-5 py-4 text-[12.5px] leading-relaxed text-navy-900">
          <p className="font-medium">
            Cette version sert à valider la structure du référentiel avec des chirurgiens.
          </p>
          <p className="mt-1 text-charcoal/75">
            Le remplissage complet sera généralement accompagné par l'équipe KOVELA.
          </p>
        </div>

        {/* Bandeau de contexte */}
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-900/[0.045]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
              Étape post-onboarding — cabinet activé
            </Badge>
            <Badge className="bg-navy-900/[0.04] text-charcoal/70 ring-navy-900/[0.06]">
              Référentiel de suivi : 20–30 minutes
            </Badge>
            <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
              Généralement finalisé avec l'équipe KOVELA
            </Badge>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">
            Vous pouvez commencer par 2 ou 3 interventions prioritaires. Le reste pourra être
            complété progressivement. Ce référentiel est généralement complété avec l'équipe
            KOVELA, puis relu avant activation complète des premiers suivis.
          </p>
          <div className="mt-5">
            <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Choisir mon niveau de complétion
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  {
                    v: "essentiel",
                    title: "Essentiel",
                    desc: "2 ou 3 interventions prioritaires. Démarrage rapide.",
                    recommended: false,
                  },
                  {
                    v: "complet",
                    title: "Complet",
                    desc: "Référentiel détaillé — toutes les interventions activées.",
                    recommended: false,
                  },
                  {
                    v: "avec_kovela",
                    title: "Avec KOVELA",
                    desc: "Recommandé — complété avec l'équipe KOVELA.",
                    recommended: true,
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setR((s) => ({ ...s, modeCompletion: opt.v }))}
                  className={`relative rounded-xl border p-4 text-left transition-colors ${
                    r.modeCompletion === opt.v
                      ? "border-teal-500/60 bg-teal-50/40"
                      : "border-navy-900/[0.08] bg-white hover:border-navy-900/[0.15]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                      {opt.title}
                    </p>
                    {opt.recommended && (
                      <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                        Recommandé
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-charcoal/60">{opt.desc}</p>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-charcoal/55">
              Le mode <span className="font-medium text-navy-900">Essentiel</span> permet de
              démarrer avec les interventions les plus fréquentes. Le référentiel pourra être
              enrichi ensuite avec l'équipe KOVELA.
            </p>
          </div>
        </div>

        {/* Bandeau prototype + doctrine */}
        <div className="rounded-2xl bg-bone/60 px-5 py-4 text-[11.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
          <p className="font-medium text-navy-900">
            Prototype — configuration cabinet uniquement. Aucune donnée patient. Pas une plateforme
            de production HDS.
          </p>
          <p className="mt-2">
            KOVELA ne diagnostique pas, ne décide pas médicalement, ne remplace pas le chirurgien.
            KOVELA applique les règles de transmission définies par le chirurgien. Le chirurgien
            garde la main.
          </p>
        </div>

        {/* Barre de progression */}
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-900/[0.045]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Progression
            </p>
            <p className="text-[12px] font-medium tracking-tight text-navy-900">
              {overallProgress}% — étape {step + 1} / {STEPS.length}
            </p>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-navy-900/[0.06]">
            <div
              className="h-full rounded-full bg-teal-500 transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[11px] tracking-tight">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className={`flex h-7 items-center gap-2 rounded-md px-2.5 font-medium transition-colors ${
                  i === step
                    ? "bg-navy-900 text-white shadow-soft"
                    : completion[i] >= 100
                    ? "bg-teal-50/60 text-teal-700 ring-1 ring-teal-100/70"
                    : completion[i] > 0
                    ? "bg-amber-50/50 text-amber-800 ring-1 ring-amber-200/50"
                    : "bg-white text-charcoal/55 ring-1 ring-navy-900/[0.06]"
                }`}
              >
                <span
                  className={`flex h-[15px] w-[15px] items-center justify-center rounded text-[9px] font-bold ${
                    i === step
                      ? "bg-white/20 text-white"
                      : completion[i] >= 100
                      ? "bg-teal-600 text-white"
                      : "bg-navy-900/[0.06] text-charcoal/55"
                  }`}
                >
                  {completion[i] >= 100 ? "✓" : i + 1}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Étapes */}
        <Card className="p-6">
          {/* ÉTAPE 1 — Cabinet & organisation */}
          {step === 0 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Cabinet & organisation
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Identité du cabinet, lieux d'intervention, contacts autorisés et règles de
                  contact général.
                </p>
              </div>

              <SubSection title="Identité du cabinet">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Chirurgien">
                    <input
                      className={inputCls}
                      value={r.cabinet.chirurgien}
                      onChange={(e) => setCabinet("chirurgien", e.target.value)}
                    />
                  </Field>
                  <Field label="Cabinet">
                    <input
                      className={inputCls}
                      value={r.cabinet.cabinet}
                      onChange={(e) => setCabinet("cabinet", e.target.value)}
                    />
                  </Field>
                  <Field label="Spécialité">
                    <input
                      className={inputCls}
                      value={r.cabinet.specialite}
                      onChange={(e) => setCabinet("specialite", e.target.value)}
                    />
                  </Field>
                  <Field label="Lieu principal">
                    <input
                      className={inputCls}
                      value={r.cabinet.lieuPrincipal}
                      onChange={(e) => setCabinet("lieuPrincipal", e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Autres lieux opératoires"
                    hint="Cliniques, blocs, établissements secondaires. Un par ligne."
                    className="sm:col-span-2"
                  >
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.cabinet.lieuxOperatoires}
                      onChange={(e) => setCabinet("lieuxOperatoires", e.target.value)}
                    />
                  </Field>
                  <Field label="Assistante référente" className="sm:col-span-2">
                    <input
                      className={inputCls}
                      value={r.cabinet.assistanteReferente}
                      onChange={(e) => setCabinet("assistanteReferente", e.target.value)}
                      placeholder={assistants[0]?.name ?? "Nom de l'assistante référente"}
                    />
                  </Field>
                </div>
              </SubSection>

              <SubSection
                title="Contacts cabinet autorisés"
                hint="Personnes autorisées à recevoir les transmissions et à intervenir sur le planning."
              >
                <div className="space-y-3">
                  {r.cabinet.contacts.map((c, idx) => (
                    <div
                      key={c.id}
                      className="rounded-xl bg-white p-4 ring-1 ring-navy-900/[0.06]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <Badge
                          className={
                            c.priorite === "primaire"
                              ? "bg-teal-50/60 text-teal-700 ring-teal-100/70"
                              : c.priorite === "secondaire"
                              ? "bg-navy-900/[0.04] text-charcoal/70 ring-navy-900/[0.06]"
                              : "bg-amber-50/50 text-amber-800 ring-amber-200/50"
                          }
                        >
                          Contact {idx + 1} ·{" "}
                          {c.priorite === "primaire"
                            ? "primaire"
                            : c.priorite === "secondaire"
                            ? "secondaire"
                            : "back-up"}
                        </Badge>
                        {r.cabinet.contacts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeContact(c.id)}
                            className="text-[11.5px] font-medium text-rose-700/80 hover:text-rose-700"
                          >
                            Retirer
                          </button>
                        )}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Nom">
                          <input
                            className={inputCls}
                            value={c.nom}
                            onChange={(e) => updateContact(c.id, { nom: e.target.value })}
                          />
                        </Field>
                        <Field label="Rôle">
                          <input
                            className={inputCls}
                            value={c.role}
                            onChange={(e) => updateContact(c.id, { role: e.target.value })}
                            placeholder="ex : assistante référente, secrétariat…"
                          />
                        </Field>
                        <Field label="Email (fictif)">
                          <input
                            className={inputCls}
                            value={c.email}
                            onChange={(e) => updateContact(c.id, { email: e.target.value })}
                          />
                        </Field>
                        <Field label="Téléphone (fictif)">
                          <input
                            className={inputCls}
                            value={c.telephone}
                            onChange={(e) => updateContact(c.id, { telephone: e.target.value })}
                          />
                        </Field>
                        <Field label="Niveau de priorité" className="sm:col-span-2">
                          <select
                            className={inputCls}
                            value={c.priorite}
                            onChange={(e) =>
                              updateContact(c.id, {
                                priorite: e.target.value as ContactAutorise["priorite"],
                              })
                            }
                          >
                            <option value="primaire">Primaire — destinataire par défaut</option>
                            <option value="secondaire">Secondaire</option>
                            <option value="back_up">Back-up — en cas d'absence</option>
                          </select>
                        </Field>
                      </div>
                    </div>
                  ))}
                  <Button variant="subtle" onClick={addContact}>
                    + Ajouter un contact autorisé
                  </Button>
                </div>
              </SubSection>

              <SubSection
                title="Canaux et horaires"
                hint="Comment l'équipe KOVELA transmet les informations au cabinet."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Canal de transmission prioritaire">
                    <input
                      className={inputCls}
                      value={r.cabinet.canalPrioritaire}
                      onChange={(e) => setCabinet("canalPrioritaire", e.target.value)}
                      placeholder="ex : email cabinet, interface KOVELA…"
                    />
                  </Field>
                  <Field label="Canal secondaire">
                    <input
                      className={inputCls}
                      value={r.cabinet.canalSecondaire}
                      onChange={(e) => setCabinet("canalSecondaire", e.target.value)}
                    />
                  </Field>
                  <Field label="Horaires cabinet">
                    <input
                      className={inputCls}
                      value={r.cabinet.horaires}
                      onChange={(e) => setCabinet("horaires", e.target.value)}
                      placeholder="ex : lundi–vendredi 9h–18h"
                    />
                  </Field>
                  <Field label="Conduite hors horaires">
                    <input
                      className={inputCls}
                      value={r.cabinet.conduiteHorsHoraires}
                      onChange={(e) => setCabinet("conduiteHorsHoraires", e.target.value)}
                      placeholder="ex : rappel 15 / 112, transmission différée"
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Délai attendu — Suivi habituel">
                    <input
                      className={inputCls}
                      value={r.cabinet.delaiNiveau1}
                      onChange={(e) => setCabinet("delaiNiveau1", e.target.value)}
                      placeholder="ex : 48 h"
                    />
                  </Field>
                  <Field label="Délai attendu — À transmettre au cabinet">
                    <input
                      className={inputCls}
                      value={r.cabinet.delaiNiveau2}
                      onChange={(e) => setCabinet("delaiNiveau2", e.target.value)}
                      placeholder="ex : 24 h"
                    />
                  </Field>
                  <Field label="Délai attendu — Transmission prioritaire">
                    <input
                      className={inputCls}
                      value={r.cabinet.delaiNiveau3}
                      onChange={(e) => setCabinet("delaiNiveau3", e.target.value)}
                      placeholder="ex : sous 2 h"
                    />
                  </Field>
                </div>
              </SubSection>

              <SubSection title="Quelques questions utiles">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Qui répond aujourd'hui aux patients en post-op ?">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.cabinet.qRepondPostOp}
                      onChange={(e) => setCabinet("qRepondPostOp", e.target.value)}
                    />
                  </Field>
                  <Field label="Quels canaux utilisez-vous aujourd'hui ?">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.cabinet.qCanauxUtilises}
                      onChange={(e) => setCabinet("qCanauxUtilises", e.target.value)}
                    />
                  </Field>
                  <Field label="Qui doit recevoir les transmissions KOVELA ?">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.cabinet.qDestinataireTransmissions}
                      onChange={(e) => setCabinet("qDestinataireTransmissions", e.target.value)}
                    />
                  </Field>
                  <Field label="Quel canal pour une transmission prioritaire ?">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.cabinet.qCanalPrioritaire}
                      onChange={(e) => setCabinet("qCanalPrioritaire", e.target.value)}
                    />
                  </Field>
                </div>
              </SubSection>
            </div>
          )}

          {/* ÉTAPE 2 — Doctrine */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Doctrine générale de suivi
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Philosophie générale du cabinet — ton, proactivité attendue, ce que KOVELA peut
                  faire et ne doit jamais faire. Ces éléments cadrent toute la suite.
                </p>
              </div>

              <SubSection title="Posture générale">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Ton souhaité avec les patients" hint="ex : chaleureux mais ferme, rassurant, factuel…">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.doctrine.tonPatients}
                      onChange={(e) => setDoctrine("tonPatients", e.target.value)}
                    />
                  </Field>
                  <Field label="Niveau de proactivité attendu de KOVELA" hint="ex : relancer si silence > 5 j, message d'accueil J+1…">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.doctrine.proactivite}
                      onChange={(e) => setDoctrine("proactivite", e.target.value)}
                    />
                  </Field>
                  <Field label="Fréquence habituelle de contact post-op" className="sm:col-span-2">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.doctrine.frequenceContact}
                      onChange={(e) => setDoctrine("frequenceContact", e.target.value)}
                    />
                  </Field>
                </div>
              </SubSection>

              <SubSection title="Périmètre KOVELA">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Ce que KOVELA peut répondre sans validation">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.doctrine.kovelaPeutRepondre}
                      onChange={(e) => setDoctrine("kovelaPeutRepondre", e.target.value)}
                    />
                  </Field>
                  <Field label="Ce que KOVELA ne doit jamais répondre">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.doctrine.kovelaNeJamaisRepondre}
                      onChange={(e) => setDoctrine("kovelaNeJamaisRepondre", e.target.value)}
                    />
                  </Field>
                  <Field label="Ce qui doit toujours revenir au cabinet" className="sm:col-span-2">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.doctrine.retourCabinetSysteme}
                      onChange={(e) => setDoctrine("retourCabinetSysteme", e.target.value)}
                    />
                  </Field>
                </div>
              </SubSection>

              <SubSection title="Cas de figure récurrents">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Si le patient demande un avis médical">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.doctrine.conduiteAvisMedical}
                      onChange={(e) => setDoctrine("conduiteAvisMedical", e.target.value)}
                    />
                  </Field>
                  <Field label="Si le patient demande une modification de traitement">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.doctrine.conduiteModifTraitement}
                      onChange={(e) => setDoctrine("conduiteModifTraitement", e.target.value)}
                    />
                  </Field>
                  <Field label="Si le patient est très anxieux">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.doctrine.conduitePatientAnxieux}
                      onChange={(e) => setDoctrine("conduitePatientAnxieux", e.target.value)}
                    />
                  </Field>
                  <Field label="Si le patient insiste pour parler au chirurgien">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.doctrine.conduiteInsistePourChirurgien}
                      onChange={(e) =>
                        setDoctrine("conduiteInsistePourChirurgien", e.target.value)
                      }
                    />
                  </Field>
                </div>
              </SubSection>

              <SubSection title="Préférences générales">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Préférences générales de transmission">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.doctrine.preferencesTransmission}
                      onChange={(e) => setDoctrine("preferencesTransmission", e.target.value)}
                    />
                  </Field>
                  <Field label="Préférences générales de comptes-rendus">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.doctrine.preferencesCR}
                      onChange={(e) => setDoctrine("preferencesCR", e.target.value)}
                    />
                  </Field>
                </div>
              </SubSection>

              <SubSection
                title="Documents et consignes déjà remis au patient"
                hint="Ces éléments permettent à KOVELA de s'aligner sur vos consignes existantes, sans les modifier."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Fiche post-op remise au patient">
                    <div className="flex flex-wrap gap-2">
                      <Toggle
                        checked={r.documentsRemis.fichePostOpRemise}
                        onChange={(v) => setDocs("fichePostOpRemise", v)}
                        label="Oui — fiche remise"
                      />
                    </div>
                  </Field>
                  <Field label="Format" hint="Papier, PDF, email, Doctolib, autre…">
                    <input
                      className={inputCls}
                      value={r.documentsRemis.format}
                      onChange={(e) => setDocs("format", e.target.value)}
                      placeholder="ex : PDF transmis par email + papier en main propre"
                    />
                  </Field>
                  <Field label="Consignes standards existantes" className="sm:col-span-2">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.documentsRemis.consignesStandards}
                      onChange={(e) => setDocs("consignesStandards", e.target.value)}
                      placeholder="ex : repos 48 h, pas d'effort, pansement à laisser X jours…"
                    />
                  </Field>
                  <Field label="Consignes spécifiques par intervention" className="sm:col-span-2">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.documentsRemis.consignesSpecifiques}
                      onChange={(e) => setDocs("consignesSpecifiques", e.target.value)}
                    />
                  </Field>
                  <Field label="Ce que KOVELA peut rappeler">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.documentsRemis.kovelaPeutRappeler}
                      onChange={(e) => setDocs("kovelaPeutRappeler", e.target.value)}
                    />
                  </Field>
                  <Field label="Ce que KOVELA ne doit jamais reformuler">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.documentsRemis.kovelaNeJamaisReformuler}
                      onChange={(e) => setDocs("kovelaNeJamaisReformuler", e.target.value)}
                    />
                  </Field>
                  <Field label="Document source à récupérer par KOVELA" className="sm:col-span-2">
                    <input
                      className={inputCls}
                      value={r.documentsRemis.documentSourceArecuperer}
                      onChange={(e) => setDocs("documentSourceArecuperer", e.target.value)}
                      placeholder="ex : PDF fiche post-op v2025, à transmettre à l'équipe KOVELA"
                    />
                  </Field>
                </div>
              </SubSection>
            </div>
          )}

          {/* ÉTAPE 3 — Interventions */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Interventions pratiquées
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Cochez les interventions que vous pratiquez. Indiquez ensuite, pour chacune,
                  votre volume mensuel approximatif, et marquez celles que vous souhaitez activer
                  pour KOVELA en priorité V1.
                </p>
                <p className="mt-3 rounded-lg bg-bone/60 px-3.5 py-2 text-[11.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
                  Je configure d'abord mes interventions les plus fréquentes — les autres pourront
                  être ajoutées ensuite.
                </p>
              </div>

              {INTERVENTION_FAMILIES.map((fam) => (
                <SubSection
                  key={fam.key}
                  title={fam.label}
                  hint={fam.hint}
                >
                  {fam.optional && (
                    <div className="-mt-2 mb-1 flex flex-wrap items-center gap-2 rounded-xl bg-bone/70 px-3.5 py-2.5 ring-1 ring-navy-900/[0.05]">
                      <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
                        Optionnel / later — non prioritaire V1
                      </Badge>
                      <span className="text-[11.5px] leading-relaxed text-charcoal/65">
                        Le wedge V1 KOVELA reste la chirurgie esthétique post-opératoire.
                      </span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {r.interventions
                      .filter((i) => i.family === fam.key)
                      .map((i) => (
                        <div
                          key={i.key}
                          className={`rounded-xl px-4 py-3 ring-1 transition-colors ${
                            i.pratiquee
                              ? "bg-white ring-navy-900/[0.08]"
                              : "bg-bone/40 ring-navy-900/[0.04]"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <label className="flex flex-1 cursor-pointer items-center gap-3 text-[13px] tracking-tight text-navy-900">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-navy-200 text-teal-600"
                                checked={i.pratiquee}
                                onChange={(e) =>
                                  setIntervention(i.key, {
                                    pratiquee: e.target.checked,
                                    // si on décoche : on reset les options dérivées
                                    ...(e.target.checked
                                      ? {}
                                      : { suiviKovela: false, prioriteV1: false }),
                                  })
                                }
                              />
                              <span className={i.pratiquee ? "font-medium" : "text-charcoal/60"}>
                                {i.label}
                              </span>
                            </label>
                            {i.pratiquee && (
                              <div className="flex flex-wrap items-center gap-2">
                                <input
                                  type="number"
                                  min={0}
                                  placeholder="vol. / mois"
                                  className="w-24 rounded-lg border border-navy-900/[0.08] bg-white px-2.5 py-1 text-[12px] outline-none focus:border-teal-500/60"
                                  value={i.volumeMensuel}
                                  onChange={(e) =>
                                    setIntervention(i.key, { volumeMensuel: e.target.value })
                                  }
                                />
                                <select
                                  className="rounded-lg border border-navy-900/[0.08] bg-white px-2.5 py-1 text-[12px] outline-none focus:border-teal-500/60"
                                  value={i.frequence}
                                  onChange={(e) =>
                                    setIntervention(i.key, {
                                      frequence: e.target.value as InterventionState["frequence"],
                                    })
                                  }
                                >
                                  <option value="">fréquence…</option>
                                  <option value="frequente">fréquente</option>
                                  <option value="occasionnelle">occasionnelle</option>
                                </select>
                                <Toggle
                                  checked={i.suiviKovela}
                                  onChange={(v) => setIntervention(i.key, { suiviKovela: v })}
                                  label="Suivi KOVELA"
                                />
                                <Toggle
                                  checked={i.prioriteV1}
                                  onChange={(v) => setIntervention(i.key, { prioriteV1: v })}
                                  label="Priorité V1"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </SubSection>
              ))}

              <div className="rounded-xl bg-white p-4 ring-1 ring-navy-900/[0.06]">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                  Synthèse
                </p>
                <p className="mt-2 text-[13px] tracking-tight text-navy-900">
                  {totalPratiquees} intervention{totalPratiquees > 1 ? "s" : ""} pratiquée
                  {totalPratiquees > 1 ? "s" : ""} ·{" "}
                  <span className="text-teal-700">
                    {totalPriorite} priorité V1 (suivi KOVELA activé)
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 — Parcours par intervention */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Parcours de suivi par intervention
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Pour chaque intervention activée en priorité V1, définissez la durée, les
                  jalons, les questions et les éléments à transmettre. Vous pouvez aussi indiquer
                  &laquo; même fonctionnement que… &raquo; pour dupliquer.
                </p>
              </div>

              {prioriteV1.length === 0 && (
                <div className="rounded-xl bg-bone/60 px-4 py-3 text-[12.5px] text-charcoal/65 ring-1 ring-navy-900/[0.04]">
                  Aucune intervention marquée &laquo; Priorité V1 &raquo; à l'étape précédente.
                  Revenez à l'étape 3 pour en activer.
                </div>
              )}

              {prioriteV1.map((i) => (
                <div
                  key={i.key}
                  className="rounded-2xl bg-white p-5 ring-1 ring-navy-900/[0.06]"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-navy-900/[0.05] pb-3">
                    <div>
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                        {INTERVENTION_FAMILIES.find((f) => f.key === i.family)?.label}
                      </p>
                      <h3 className="mt-1 font-display text-[15.5px] font-semibold tracking-tight text-navy-900">
                        {i.label}
                      </h3>
                    </div>
                    <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                      Priorité V1
                    </Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Durée de suivi souhaitée" hint="ex : J+1 à J+30, J+1 à J+60…">
                      <input
                        className={inputCls}
                        value={i.dureeSuivi}
                        onChange={(e) =>
                          setIntervention(i.key, { dureeSuivi: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Moments de contact souhaités">
                      <input
                        className={inputCls}
                        value={i.momentsContact}
                        onChange={(e) =>
                          setIntervention(i.key, { momentsContact: e.target.value })
                        }
                        placeholder="ex : J+1, J+7, J+15, J+30…"
                      />
                    </Field>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                        Jalons J+
                      </p>
                      <Button variant="subtle" onClick={() => addJalon(i.key)}>
                        + Ajouter un jalon
                      </Button>
                    </div>
                    {i.jalons.length === 0 && (
                      <p className="rounded-lg bg-bone/60 px-3.5 py-2 text-[11.5px] text-charcoal/60 ring-1 ring-navy-900/[0.04]">
                        Aucun jalon défini. Ajoutez vos jalons clés (J+1, J+5, J+15…).
                      </p>
                    )}
                    <div className="space-y-3">
                      {i.jalons.map((j, jdx) => (
                        <div
                          key={j.id}
                          className="rounded-lg bg-bone/40 p-4 ring-1 ring-navy-900/[0.04]"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <Badge className="bg-navy-900/[0.06] text-charcoal/75 ring-navy-900/[0.08]">
                              Jalon {jdx + 1}
                            </Badge>
                            <button
                              type="button"
                              onClick={() => removeJalon(i.key, j.id)}
                              className="text-[11.5px] font-medium text-rose-700/80 hover:text-rose-700"
                            >
                              Retirer
                            </button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Field label="Jour">
                              <input
                                className={inputCls}
                                placeholder="ex : J+5"
                                value={j.jour}
                                onChange={(e) =>
                                  updateJalon(i.key, j.id, { jour: e.target.value })
                                }
                              />
                            </Field>
                            <Field label="Objectif du contact">
                              <input
                                className={inputCls}
                                value={j.objectif}
                                onChange={(e) =>
                                  updateJalon(i.key, j.id, { objectif: e.target.value })
                                }
                              />
                            </Field>
                            <Field label="Points d'attention" className="sm:col-span-2">
                              <textarea
                                className={textareaCls}
                                rows={2}
                                value={j.pointsAttention}
                                onChange={(e) =>
                                  updateJalon(i.key, j.id, { pointsAttention: e.target.value })
                                }
                              />
                            </Field>
                            <Field
                              label="Suites habituellement attendues selon votre pratique"
                              className="sm:col-span-2"
                            >
                              <textarea
                                className={textareaCls}
                                rows={2}
                                value={j.evolutionHabituelle}
                                onChange={(e) =>
                                  updateJalon(i.key, j.id, {
                                    evolutionHabituelle: e.target.value,
                                  })
                                }
                              />
                            </Field>
                            <Field
                              label="Éléments à transmettre au cabinet"
                              className="sm:col-span-2"
                            >
                              <textarea
                                className={textareaCls}
                                rows={2}
                                value={j.elementsTransmettre}
                                onChange={(e) =>
                                  updateJalon(i.key, j.id, {
                                    elementsTransmettre: e.target.value,
                                  })
                                }
                              />
                            </Field>
                            <Field label="Remarque" className="sm:col-span-2">
                              <input
                                className={inputCls}
                                value={j.remarque}
                                onChange={(e) =>
                                  updateJalon(i.key, j.id, { remarque: e.target.value })
                                }
                              />
                            </Field>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Questions à poser au patient">
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={i.questionsAuPatient}
                        onChange={(e) =>
                          setIntervention(i.key, { questionsAuPatient: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Informations à rappeler">
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={i.informationsRappeler}
                        onChange={(e) =>
                          setIntervention(i.key, { informationsRappeler: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Soins / pansements à rappeler (si souhaité)">
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={i.soinsRappeler}
                        onChange={(e) =>
                          setIntervention(i.key, { soinsRappeler: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Consignes générales déjà données au patient">
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={i.consignesGenerales}
                        onChange={(e) =>
                          setIntervention(i.key, { consignesGenerales: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Sujets à ne jamais traiter par KOVELA">
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={i.sujetsInterdits}
                        onChange={(e) =>
                          setIntervention(i.key, { sujetsInterdits: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Remarques spécifiques">
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={i.remarques}
                        onChange={(e) =>
                          setIntervention(i.key, { remarques: e.target.value })
                        }
                      />
                    </Field>
                  </div>

                  {/* Photos — bloc enrichi */}
                  <div className="mt-5 rounded-xl bg-bone/50 p-4 ring-1 ring-navy-900/[0.05]">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                        Photos
                      </p>
                      <Toggle
                        checked={i.photosAttendues}
                        onChange={(v) => setIntervention(i.key, { photosAttendues: v })}
                        label="Photos attendues pour cette intervention"
                      />
                    </div>
                    {i.photosAttendues ? (
                      <>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field label="Type de photos attendues">
                            <input
                              className={inputCls}
                              placeholder="ex : zone opérée, cicatrice, profil…"
                              value={i.typePhotos}
                              onChange={(e) =>
                                setIntervention(i.key, { typePhotos: e.target.value })
                              }
                            />
                          </Field>
                          <Field label="Photos demandées à quels jours" hint="ex : J+5, J+15, J+30">
                            <input
                              className={inputCls}
                              value={i.photoJours}
                              onChange={(e) =>
                                setIntervention(i.key, { photoJours: e.target.value })
                              }
                            />
                          </Field>
                          <Field label="Angles souhaités">
                            <input
                              className={inputCls}
                              placeholder="ex : face + 3/4 droite + 3/4 gauche"
                              value={i.photoAngles}
                              onChange={(e) =>
                                setIntervention(i.key, { photoAngles: e.target.value })
                              }
                            />
                          </Field>
                          <Field label="Photos à transmettre systématiquement au cabinet">
                            <Toggle
                              checked={i.photoTransmissionSystematique}
                              onChange={(v) =>
                                setIntervention(i.key, { photoTransmissionSystematique: v })
                              }
                              label="Oui — transmission systématique"
                            />
                          </Field>
                          <Field
                            label="Consigne photo à envoyer au patient"
                            className="sm:col-span-2"
                          >
                            <textarea
                              className={textareaCls}
                              rows={2}
                              value={i.photoConsignePatient}
                              onChange={(e) =>
                                setIntervention(i.key, { photoConsignePatient: e.target.value })
                              }
                              placeholder="ex : photo de la zone à la lumière naturelle, sans pansement, à distance d'1 m…"
                            />
                          </Field>
                          <Field label="Photo floue / insuffisante — conduite">
                            <textarea
                              className={textareaCls}
                              rows={2}
                              value={i.photoFloueConduite}
                              onChange={(e) =>
                                setIntervention(i.key, { photoFloueConduite: e.target.value })
                              }
                            />
                          </Field>
                          <Field label="Photo sensible / intime — conduite">
                            <textarea
                              className={textareaCls}
                              rows={2}
                              value={i.photoSensibleConduite}
                              onChange={(e) =>
                                setIntervention(i.key, { photoSensibleConduite: e.target.value })
                              }
                            />
                          </Field>
                        </div>
                        <p className="mt-3 rounded-lg bg-white/70 px-3.5 py-2 text-[11px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.05]">
                          KOVELA ne réalise pas d'interprétation médicale des photos. Les photos
                          sont collectées et transmises selon vos règles.
                        </p>
                      </>
                    ) : (
                      <p className="text-[11.5px] leading-relaxed text-charcoal/55">
                        Photos non attendues pour cette intervention.
                      </p>
                    )}
                  </div>

                  {/* RDV de contrôle — bloc dédié */}
                  <div className="mt-4 rounded-xl bg-bone/50 p-4 ring-1 ring-navy-900/[0.05]">
                    <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                      Rendez-vous de contrôle post-opératoire
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="RDV de contrôle habituel" hint="ex : J+15, J+30">
                        <input
                          className={inputCls}
                          value={i.rdvControleJour}
                          onChange={(e) =>
                            setIntervention(i.key, { rdvControleJour: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Qui le planifie">
                        <input
                          className={inputCls}
                          value={i.rdvControleQuiPlanifie}
                          onChange={(e) =>
                            setIntervention(i.key, { rdvControleQuiPlanifie: e.target.value })
                          }
                          placeholder="ex : secrétariat cabinet, patient lui-même via Doctolib…"
                        />
                      </Field>
                      <Field label="KOVELA peut-il rappeler le RDV au patient ?">
                        <Toggle
                          checked={i.rdvControleKovelaRappelle}
                          onChange={(v) =>
                            setIntervention(i.key, { rdvControleKovelaRappelle: v })
                          }
                          label="Oui — rappel autorisé"
                        />
                      </Field>
                      <Field label="Quand transmettre au cabinet">
                        <input
                          className={inputCls}
                          value={i.rdvControleTransmission}
                          onChange={(e) =>
                            setIntervention(i.key, { rdvControleTransmission: e.target.value })
                          }
                          placeholder="ex : si pas de RDV à J+10"
                        />
                      </Field>
                      <Field label="Si le patient n'a pas de RDV">
                        <textarea
                          className={textareaCls}
                          rows={2}
                          value={i.rdvControleSansRdv}
                          onChange={(e) =>
                            setIntervention(i.key, { rdvControleSansRdv: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Si le patient annule / reporte">
                        <textarea
                          className={textareaCls}
                          rows={2}
                          value={i.rdvControleAnnulation}
                          onChange={(e) =>
                            setIntervention(i.key, { rdvControleAnnulation: e.target.value })
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Même fonctionnement qu'une autre intervention…" className="sm:col-span-2" hint="Permet de dupliquer la configuration d'une intervention déjà renseignée.">
                      <select
                        className={inputCls}
                        value={i.copieDepuis}
                        onChange={(e) => {
                          const src = prioriteV1.find((x) => x.key === e.target.value);
                          if (src && src.key !== i.key) {
                            setIntervention(i.key, {
                              copieDepuis: e.target.value,
                              dureeSuivi: src.dureeSuivi,
                              momentsContact: src.momentsContact,
                              jalons: src.jalons.map((j) => ({ ...j, id: newJalon().id })),
                              questionsAuPatient: src.questionsAuPatient,
                              informationsRappeler: src.informationsRappeler,
                              photosAttendues: src.photosAttendues,
                              typePhotos: src.typePhotos,
                              photoJours: src.photoJours,
                              photoAngles: src.photoAngles,
                              photoConsignePatient: src.photoConsignePatient,
                              photoFloueConduite: src.photoFloueConduite,
                              photoSensibleConduite: src.photoSensibleConduite,
                              photoTransmissionSystematique: src.photoTransmissionSystematique,
                              rdvControleJour: src.rdvControleJour,
                              rdvControleQuiPlanifie: src.rdvControleQuiPlanifie,
                              rdvControleKovelaRappelle: src.rdvControleKovelaRappelle,
                              rdvControleSansRdv: src.rdvControleSansRdv,
                              rdvControleAnnulation: src.rdvControleAnnulation,
                              rdvControleTransmission: src.rdvControleTransmission,
                              soinsRappeler: src.soinsRappeler,
                              consignesGenerales: src.consignesGenerales,
                              sujetsInterdits: src.sujetsInterdits,
                              remarques: src.remarques,
                            });
                          } else {
                            setIntervention(i.key, { copieDepuis: e.target.value });
                          }
                        }}
                      >
                        <option value="">Aucune copie</option>
                        {prioriteV1
                          .filter((o) => o.key !== i.key)
                          .map((o) => (
                            <option key={o.key} value={o.key}>
                              {o.label}
                            </option>
                          ))}
                      </select>
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ÉTAPE 5 — Règles de transmission */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Règles de transmission au cabinet
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Pour chaque intervention activée en priorité V1, définissez les trois catégories
                  de transmission : <span className="font-medium text-navy-900">suivi habituel</span>,
                  <span className="font-medium text-navy-900"> à transmettre au cabinet</span>,
                  <span className="font-medium text-navy-900"> transmission prioritaire</span>.
                  KOVELA ne qualifie pas médicalement — KOVELA applique les règles que vous
                  définissez ici.
                </p>
                <div className="mt-3 rounded-xl bg-navy-depth p-4 text-[12px] leading-relaxed text-navy-100/85 ring-1 ring-white/[0.06]">
                  <p className="font-medium text-white">Règle non éditable — situation urgente</p>
                  <p className="mt-1.5">
                    Si le patient décrit une situation urgente ou inquiétante, KOVELA lui rappelle
                    de contacter les services d'urgence 15 / 112 et transmet l'information au
                    cabinet selon le canal défini.
                  </p>
                </div>
              </div>

              {prioriteV1.length === 0 && (
                <div className="rounded-xl bg-bone/60 px-4 py-3 text-[12.5px] text-charcoal/65 ring-1 ring-navy-900/[0.04]">
                  Aucune intervention marquée &laquo; Priorité V1 &raquo;.
                </div>
              )}

              {prioriteV1.map((i) => (
                <div
                  key={i.key}
                  className="rounded-2xl bg-white p-5 ring-1 ring-navy-900/[0.06]"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-navy-900/[0.05] pb-3">
                    <div>
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                        {INTERVENTION_FAMILIES.find((f) => f.key === i.family)?.label}
                      </p>
                      <h3 className="mt-1 font-display text-[15.5px] font-semibold tracking-tight text-navy-900">
                        {i.label}
                      </h3>
                    </div>
                  </div>

                  {(
                    [
                      {
                        key: "niveau1",
                        title: "Suivi habituel",
                        badge: "bg-teal-50/60 text-teal-700 ring-teal-100/70",
                        prioritaire: false,
                      },
                      {
                        key: "niveau2",
                        title: "À transmettre au cabinet",
                        badge: "bg-amber-50/50 text-amber-800 ring-amber-200/50",
                        prioritaire: false,
                      },
                      {
                        key: "niveau3",
                        title: "Transmission prioritaire",
                        badge: "bg-rose-50/60 text-rose-700 ring-rose-200/60",
                        prioritaire: true,
                      },
                    ] as const
                  ).map((lvl) => {
                    const n = i[lvl.key];
                    return (
                      <div
                        key={lvl.key}
                        className="mt-4 rounded-lg bg-bone/40 p-4 ring-1 ring-navy-900/[0.04]"
                      >
                        <div className="mb-3">
                          <Badge className={lvl.badge}>{lvl.title}</Badge>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field label="Situations attendues / à transmettre" className="sm:col-span-2">
                            <textarea
                              className={textareaCls}
                              rows={2}
                              value={n.situations}
                              onChange={(e) =>
                                setNiveau(i.key, lvl.key, { situations: e.target.value })
                              }
                            />
                          </Field>
                          <Field label="Ce que KOVELA peut faire">
                            <textarea
                              className={textareaCls}
                              rows={2}
                              value={n.conduite}
                              onChange={(e) =>
                                setNiveau(i.key, lvl.key, { conduite: e.target.value })
                              }
                            />
                          </Field>
                          {lvl.key === "niveau1" ? (
                            <Field label="Information à documenter">
                              <textarea
                                className={textareaCls}
                                rows={2}
                                value={n.information}
                                onChange={(e) =>
                                  setNiveau(i.key, lvl.key, { information: e.target.value })
                                }
                              />
                            </Field>
                          ) : (
                            <Field label="Délai de transmission souhaité">
                              <input
                                className={inputCls}
                                value={n.delai}
                                onChange={(e) =>
                                  setNiveau(i.key, lvl.key, { delai: e.target.value })
                                }
                                placeholder={lvl.key === "niveau3" ? "ex : sous 2 h" : "ex : 24 h"}
                              />
                            </Field>
                          )}
                          {lvl.key !== "niveau1" && (
                            <>
                              <Field label="Éléments à joindre">
                                <textarea
                                  className={textareaCls}
                                  rows={2}
                                  value={n.elementsJoindre}
                                  onChange={(e) =>
                                    setNiveau(i.key, lvl.key, {
                                      elementsJoindre: e.target.value,
                                    })
                                  }
                                />
                              </Field>
                              <Field label="Canal de transmission">
                                <input
                                  className={inputCls}
                                  value={n.canal}
                                  onChange={(e) =>
                                    setNiveau(i.key, lvl.key, { canal: e.target.value })
                                  }
                                  placeholder={
                                    lvl.key === "niveau3"
                                      ? "ex : appel téléphonique + email"
                                      : "ex : email cabinet"
                                  }
                                />
                              </Field>
                              {lvl.key === "niveau3" && (
                                <Field label="Contact destinataire" className="sm:col-span-2">
                                  <input
                                    className={inputCls}
                                    value={n.contactDestinataire}
                                    onChange={(e) =>
                                      setNiveau(i.key, lvl.key, {
                                        contactDestinataire: e.target.value,
                                      })
                                    }
                                    placeholder="ex : assistante référente + chirurgien si nécessaire"
                                  />
                                </Field>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* ÉTAPE 6 — Cas transverses + Indisponibilité cabinet */}
          {step === 5 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Cas transverses
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Situations qui peuvent survenir quelle que soit l'intervention. Pour chaque cas,
                  définissez ce que KOVELA peut faire, ce qu'elle ne doit pas faire, et si une
                  transmission cabinet est attendue.
                </p>
              </div>

              {(["communication", "elements_rapportes", "medicaments_soins", "organisation"] as CasGroup[]).map(
                (group) => {
                  const cas = r.casTransverses.filter((c) => c.group === group);
                  if (cas.length === 0) return null;
                  const meta = CAS_GROUP_LABELS[group];
                  return (
                    <SubSection key={group} title={meta.title} hint={meta.hint}>
                      <div className="space-y-2">
                        {cas.map((c) => (
                          <details
                            key={c.key}
                            className="group rounded-xl bg-white p-4 ring-1 ring-navy-900/[0.06] transition-colors hover:ring-navy-900/[0.1]"
                          >
                            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 list-none">
                              <span className="font-display text-[13.5px] font-semibold tracking-tight text-navy-900">
                                {c.label}
                              </span>
                              <div className="flex items-center gap-2">
                                {c.conduiteAutorisee && (
                                  <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                                    Conduite définie
                                  </Badge>
                                )}
                                {c.transmissionCabinet && (
                                  <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
                                    Transmission cabinet
                                  </Badge>
                                )}
                                <span className="text-[12px] text-charcoal/45 transition-transform group-open:rotate-90">
                                  ›
                                </span>
                              </div>
                            </summary>
                            <div className="mt-4 grid gap-3 border-t border-navy-900/[0.05] pt-4 sm:grid-cols-2">
                              <Field label="Ce que KOVELA peut faire">
                                <textarea
                                  className={textareaCls}
                                  rows={2}
                                  value={c.conduiteAutorisee}
                                  onChange={(e) =>
                                    setCas(c.key, { conduiteAutorisee: e.target.value })
                                  }
                                />
                              </Field>
                              <Field label="Ce que KOVELA ne doit pas faire">
                                <textarea
                                  className={textareaCls}
                                  rows={2}
                                  value={c.conduiteInterdite}
                                  onChange={(e) =>
                                    setCas(c.key, { conduiteInterdite: e.target.value })
                                  }
                                />
                              </Field>
                              <Field label="Transmission au cabinet">
                                <Toggle
                                  checked={c.transmissionCabinet}
                                  onChange={(v) =>
                                    setCas(c.key, { transmissionCabinet: v })
                                  }
                                  label="Oui — transmettre au cabinet"
                                />
                              </Field>
                              <Field label="Délai souhaité">
                                <input
                                  className={inputCls}
                                  value={c.delai}
                                  onChange={(e) => setCas(c.key, { delai: e.target.value })}
                                  placeholder="ex : sous 24 h"
                                />
                              </Field>
                              <Field label="Canal">
                                <input
                                  className={inputCls}
                                  value={c.canal}
                                  onChange={(e) => setCas(c.key, { canal: e.target.value })}
                                  placeholder="ex : email cabinet"
                                />
                              </Field>
                              <Field label="Remarques">
                                <input
                                  className={inputCls}
                                  value={c.remarques}
                                  onChange={(e) =>
                                    setCas(c.key, { remarques: e.target.value })
                                  }
                                />
                              </Field>
                            </div>
                          </details>
                        ))}
                      </div>
                    </SubSection>
                  );
                }
              )}

              <SubSection
                title="Indisponibilité cabinet"
                hint="Définissez la conduite KOVELA et le contact back-up selon les périodes d'indisponibilité."
              >
                <div className="space-y-2">
                  {r.indisponibilites.map((ind) => (
                    <details
                      key={ind.key}
                      className="group rounded-xl bg-white p-4 ring-1 ring-navy-900/[0.06] transition-colors hover:ring-navy-900/[0.1]"
                    >
                      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 list-none">
                        <span className="font-display text-[13.5px] font-semibold tracking-tight text-navy-900">
                          {ind.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {ind.conduiteAutorisee && (
                            <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                              Règle définie
                            </Badge>
                          )}
                          {ind.contactBackUp && (
                            <Badge className="bg-navy-900/[0.04] text-charcoal/70 ring-navy-900/[0.06]">
                              Back-up défini
                            </Badge>
                          )}
                          <span className="text-[12px] text-charcoal/45 transition-transform group-open:rotate-90">
                            ›
                          </span>
                        </div>
                      </summary>
                      <div className="mt-4 grid gap-3 border-t border-navy-900/[0.05] pt-4 sm:grid-cols-2">
                        <Field label="Ce que KOVELA peut faire">
                          <textarea
                            className={textareaCls}
                            rows={2}
                            value={ind.conduiteAutorisee}
                            onChange={(e) =>
                              setIndispo(ind.key, { conduiteAutorisee: e.target.value })
                            }
                          />
                        </Field>
                        <Field label="Canal secondaire">
                          <input
                            className={inputCls}
                            value={ind.canalSecondaire}
                            onChange={(e) =>
                              setIndispo(ind.key, { canalSecondaire: e.target.value })
                            }
                          />
                        </Field>
                        <Field label="Délai">
                          <input
                            className={inputCls}
                            value={ind.delai}
                            onChange={(e) => setIndispo(ind.key, { delai: e.target.value })}
                          />
                        </Field>
                        <Field label="Contact back-up">
                          <input
                            className={inputCls}
                            value={ind.contactBackUp}
                            onChange={(e) =>
                              setIndispo(ind.key, { contactBackUp: e.target.value })
                            }
                            placeholder="ex : confrère de garde, numéro clinique…"
                          />
                        </Field>
                        <Field label="Message patient autorisé" className="sm:col-span-2">
                          <textarea
                            className={textareaCls}
                            rows={2}
                            value={ind.messagePatient}
                            onChange={(e) =>
                              setIndispo(ind.key, { messagePatient: e.target.value })
                            }
                            placeholder="ex : « Votre cabinet est actuellement indisponible. Pour toute urgence, contactez le 15 / 112. »"
                          />
                        </Field>
                      </div>
                    </details>
                  ))}
                </div>
              </SubSection>
            </div>
          )}

          {/* ÉTAPE 7 — CR */}
          {step === 6 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Comptes-rendus &amp; reporting
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Format et fréquence des comptes-rendus factuels que vous recevrez.
                </p>
              </div>

              <SubSection title="Format souhaité">
                <div className="grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      { v: "court", title: "Très court", desc: "1–3 lignes factuelles par patient." },
                      { v: "standard", title: "Standard", desc: "Synthèse structurée par jalon." },
                      {
                        v: "detaille",
                        title: "Détaillé",
                        desc: "Chronologie + éléments transmis + remarques.",
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setCR("format", opt.v)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        r.comptesRendus.format === opt.v
                          ? "border-teal-500/60 bg-teal-50/40"
                          : "border-navy-900/[0.08] bg-white hover:border-navy-900/[0.15]"
                      }`}
                    >
                      <p className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                        {opt.title}
                      </p>
                      <p className="mt-1.5 text-[11.5px] leading-relaxed text-charcoal/60">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </SubSection>

              <SubSection title="Diffusion">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Fréquence des CR">
                    <input
                      className={inputCls}
                      value={r.comptesRendus.frequence}
                      onChange={(e) => setCR("frequence", e.target.value)}
                      placeholder="ex : CR fin de suivi + intermédiaire si escalade"
                    />
                  </Field>
                  <Field label="Canal d'envoi">
                    <input
                      className={inputCls}
                      value={r.comptesRendus.canal}
                      onChange={(e) => setCR("canal", e.target.value)}
                    />
                  </Field>
                  <Field label="Destinataires" className="sm:col-span-2">
                    <input
                      className={inputCls}
                      value={r.comptesRendus.destinataires}
                      onChange={(e) => setCR("destinataires", e.target.value)}
                    />
                  </Field>
                  <Field label="CR intermédiaires">
                    <Toggle
                      checked={r.comptesRendus.crIntermediaires}
                      onChange={(v) => setCR("crIntermediaires", v)}
                      label="Oui — CR intermédiaires en plus du CR de fin"
                    />
                  </Field>
                  <Field label="Niveau de détail">
                    <input
                      className={inputCls}
                      value={r.comptesRendus.niveauDetail}
                      onChange={(e) => setCR("niveauDetail", e.target.value)}
                    />
                  </Field>
                </div>
              </SubSection>

              <SubSection title="Contenu">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Informations à inclure">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.comptesRendus.informationsInclure}
                      onChange={(e) => setCR("informationsInclure", e.target.value)}
                    />
                  </Field>
                  <Field label="Informations à exclure">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.comptesRendus.informationsExclure}
                      onChange={(e) => setCR("informationsExclure", e.target.value)}
                    />
                  </Field>
                  <Field label="Libellés préférés">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.comptesRendus.libellesPreferes}
                      onChange={(e) => setCR("libellesPreferes", e.target.value)}
                    />
                  </Field>
                  <Field label="Ton souhaité">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.comptesRendus.ton}
                      onChange={(e) => setCR("ton", e.target.value)}
                    />
                  </Field>
                </div>
              </SubSection>

              <SubSection title="Synthèses">
                <div className="grid gap-2 sm:grid-cols-3">
                  <Toggle
                    checked={r.comptesRendus.exportPDF}
                    onChange={(v) => setCR("exportPDF", v)}
                    label="Besoin d'export PDF"
                  />
                  <Toggle
                    checked={r.comptesRendus.synthesePatient}
                    onChange={(v) => setCR("synthesePatient", v)}
                    label="Synthèse par patient"
                  />
                  <Toggle
                    checked={r.comptesRendus.syntheseMensuelle}
                    onChange={(v) => setCR("syntheseMensuelle", v)}
                    label="Synthèse mensuelle cabinet"
                  />
                </div>
              </SubSection>

              <SubSection
                title="Structures indicatives"
                hint="Aperçu des éléments couverts par chaque format. Indicatif — sera affiné avec l'équipe KOVELA."
              >
                <div className="grid gap-3 lg:grid-cols-3">
                  {(
                    [
                      {
                        title: "CR très court",
                        items: [
                          "Intervention",
                          "Jour post-op",
                          "Dernier contact",
                          "Statut",
                          "Action KOVELA",
                        ],
                      },
                      {
                        title: "CR standard",
                        items: [
                          "Intervention",
                          "Jour post-op",
                          "Dernier contact",
                          "Éléments déclarés par patient",
                          "Photos reçues (oui/non)",
                          "Élément transmis au cabinet",
                          "Action KOVELA",
                          "Statut",
                          "Prochaine étape",
                        ],
                      },
                      {
                        title: "CR prioritaire",
                        items: [
                          "Intervention",
                          "Jour post-op",
                          "Élément qui déclenche la transmission",
                          "Éléments déclarés par patient",
                          "Photos reçues + transmises",
                          "Canal & destinataire",
                          "Action KOVELA",
                          "Délai d'attente cabinet",
                        ],
                      },
                    ] as const
                  ).map((s) => (
                    <div
                      key={s.title}
                      className="rounded-xl bg-bone/50 p-4 ring-1 ring-navy-900/[0.05]"
                    >
                      <p className="font-display text-[13px] font-semibold tracking-tight text-navy-900">
                        {s.title}
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {s.items.map((it) => (
                          <li
                            key={it}
                            className="flex gap-2 text-[11.5px] leading-relaxed text-charcoal/70"
                          >
                            <span className="mt-1.5 h-[3px] w-[3px] shrink-0 rounded-full bg-teal-600/60" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </SubSection>

              <SubSection title="Questions complémentaires">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Quels patients couvrir par un CR ?"
                    hint="Tous les patients, ou uniquement ceux pour lesquels une exception est survenue."
                  >
                    <select
                      className={inputCls}
                      value={r.comptesRendus.crSiNominal}
                      onChange={(e) =>
                        setCR("crSiNominal", e.target.value as ComptesRendusState["crSiNominal"])
                      }
                    >
                      <option value="">—</option>
                      <option value="tous">CR pour tous les patients (même si tout est nominal)</option>
                      <option value="exceptions">CR uniquement pour les exceptions</option>
                    </select>
                  </Field>
                  <Field label="Synthèses additionnelles">
                    <div className="space-y-2">
                      <Toggle
                        checked={r.comptesRendus.recapHebdomadaire}
                        onChange={(v) => setCR("recapHebdomadaire", v)}
                        label="Récap hebdomadaire cabinet"
                      />
                      <Toggle
                        checked={r.comptesRendus.recapPatientACloture}
                        onChange={(v) => setCR("recapPatientACloture", v)}
                        label="Récap par patient à clôture du suivi"
                      />
                      <Toggle
                        checked={r.comptesRendus.crIntermediaireSiAnxieux}
                        onChange={(v) => setCR("crIntermediaireSiAnxieux", v)}
                        label="CR intermédiaire si patient anxieux"
                      />
                    </div>
                  </Field>
                </div>
              </SubSection>
            </div>
          )}

          {/* ÉTAPE 8 — Récap & export */}
          {step === 7 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Récapitulatif &amp; export
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Aperçu du référentiel saisi. Validez et exportez pour transmettre à l'équipe
                  KOVELA.
                </p>
                <p className="mt-3 rounded-xl border border-teal-200/40 bg-teal-50/40 px-4 py-3 text-[12.5px] leading-relaxed text-navy-900">
                  <span className="font-medium">
                    Référentiel de fonctionnement à relire avec KOVELA avant usage opérationnel.
                  </span>
                </p>
              </div>

              <SubSection title="Synthèse">
                <dl className="grid gap-x-6 gap-y-2 text-[12.5px] sm:grid-cols-2">
                  {[
                    ["Chirurgien", r.cabinet.chirurgien || "—"],
                    ["Cabinet", r.cabinet.cabinet || "—"],
                    ["Spécialité", r.cabinet.specialite || "—"],
                    ["Lieu principal", r.cabinet.lieuPrincipal || "—"],
                    ["Contacts autorisés", `${r.cabinet.contacts.length}`],
                    ["Interventions pratiquées", `${totalPratiquees}`],
                    ["Interventions prioritaires V1", `${totalPriorite}`],
                    [
                      "Mode de complétion",
                      r.modeCompletion === "essentiel"
                        ? "Essentiel (2–3 interventions prioritaires)"
                        : r.modeCompletion === "complet"
                        ? "Complet (référentiel détaillé)"
                        : r.modeCompletion === "avec_kovela"
                        ? "Avec l'équipe KOVELA (recommandé)"
                        : "—",
                    ],
                    ["Format CR souhaité", r.comptesRendus.format || "—"],
                    ["Version du référentiel", "v0.1 (prototype)"],
                  ].map(([label, value]) => (
                    <div
                      key={label as string}
                      className="flex justify-between gap-3 border-b border-navy-900/[0.04] pb-1.5 last:border-0"
                    >
                      <dt className="text-charcoal/55">{label}</dt>
                      <dd className="text-right font-medium tracking-tight text-navy-900">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </SubSection>

              {prioriteV1.length > 0 && (
                <SubSection title="Interventions prioritaires V1">
                  <div className="flex flex-wrap gap-2">
                    {prioriteV1.map((i) => (
                      <Badge
                        key={i.key}
                        className="bg-teal-50/60 text-teal-700 ring-teal-100/70"
                      >
                        {i.label}
                      </Badge>
                    ))}
                  </div>
                </SubSection>
              )}

              <SubSection title="Validation">
                <div className="space-y-2">
                  {(
                    [
                      [
                        "refleteMesPreferences",
                        "Je confirme que ce référentiel reflète mes préférences de fonctionnement post-opératoire.",
                      ],
                      [
                        "comprendNonSubstitution",
                        "Je comprends que KOVELA applique ces règles de transmission sans se substituer à ma décision médicale.",
                      ],
                      [
                        "comprendRelectureKovela",
                        "Je comprends que ce référentiel pourra être relu et finalisé avec l'équipe KOVELA avant activation complète.",
                      ],
                    ] as [keyof ValidationState, string][]
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-white px-4 py-3 text-[13px] leading-relaxed text-charcoal/80 ring-1 ring-navy-900/[0.06] transition-colors hover:ring-navy-900/[0.12]"
                    >
                      <input
                        type="checkbox"
                        className="mt-[3px] h-4 w-4 rounded border-navy-200 text-teal-600"
                        checked={r.validation[key]}
                        onChange={(e) => setValidation(key, e.target.checked)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </SubSection>

              <SubSection
                title="Statut & versioning"
                hint="État du référentiel et prochaine revue prévue avec l'équipe KOVELA."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Statut du référentiel">
                    <select
                      className={inputCls}
                      value={r.statut.status}
                      onChange={(e) =>
                        setStatut(
                          "status",
                          e.target.value as ReferentielStatusState["status"]
                        )
                      }
                    >
                      <option value="draft">Brouillon — en cours de saisie</option>
                      <option value="kovela_review">À relire avec KOVELA</option>
                      <option value="surgeon_validated">Validé par le chirurgien</option>
                      <option value="active">Actif — usage opérationnel</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </Field>
                  <Field label="Version">
                    <input className={inputCls} value="v0.1 (prototype)" disabled />
                  </Field>
                  <Field label="Validé par le chirurgien (date)">
                    <input
                      type="date"
                      className={inputCls}
                      value={r.statut.validatedBySurgeonAt}
                      onChange={(e) => setStatut("validatedBySurgeonAt", e.target.value)}
                    />
                  </Field>
                  <Field label="Relu par l'équipe KOVELA (date)">
                    <input
                      type="date"
                      className={inputCls}
                      value={r.statut.reviewedByKovelaAt}
                      onChange={(e) => setStatut("reviewedByKovelaAt", e.target.value)}
                    />
                  </Field>
                  <Field label="Prochaine revue prévue" className="sm:col-span-2">
                    <input
                      type="date"
                      className={inputCls}
                      value={r.statut.prochaineRevue}
                      onChange={(e) => setStatut("prochaineRevue", e.target.value)}
                    />
                  </Field>
                </div>
                <p className="mt-3 text-[11.5px] leading-relaxed text-charcoal/55">
                  Référentiel à relire avec KOVELA avant usage opérationnel.
                </p>
              </SubSection>

              <SubSection title="Export">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="primary" onClick={exportJson}>
                    Exporter JSON
                  </Button>
                  <Button variant="secondary" onClick={copySummary}>
                    Copier résumé
                  </Button>
                  <Button variant="ghost" onClick={() => setStep(0)}>
                    Revenir modifier
                  </Button>
                  <span className="rounded-md bg-bone/60 px-3 py-1.5 text-[11px] tracking-tight text-charcoal/55 ring-1 ring-navy-900/[0.04]">
                    Export PDF — V2
                  </span>
                </div>
                {exportToast && (
                  <p className="mt-3 rounded-lg bg-teal-50/60 px-3.5 py-2 text-[12px] tracking-tight text-teal-700 ring-1 ring-teal-100/70">
                    {exportToast}
                  </p>
                )}
              </SubSection>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-navy-900/[0.05] pt-6">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              ← Précédent
            </Button>
            <p className="hidden text-[11px] tracking-tight text-charcoal/45 sm:block">
              Étape {step + 1} sur {STEPS.length} — {STEPS[step]}
            </p>
            <Button
              variant="primary"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={step === STEPS.length - 1}
            >
              Suivant →
            </Button>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
