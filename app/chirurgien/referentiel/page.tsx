"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { useKovela } from "@/lib/store";

const MY_SURGEON_ID = "s1";

// ---------------------------------------------------------------------------
// Catalogue compact d'interventions — sélection par famille.
// Le chirurgien coche uniquement ce qu'il pratique et marque 2-3 priorités V1.
// La médecine esthétique est masquée par défaut (later / non prioritaire V1).
// ---------------------------------------------------------------------------

type FamilyKey = "visage_cou" | "seins" | "silhouette" | "combinees" | "medecine_esthetique";

const INTERVENTION_FAMILIES: {
  key: FamilyKey;
  label: string;
  hint?: string;
  later?: boolean;
  items: string[];
}[] = [
  {
    key: "visage_cou",
    label: "Visage / cou",
    items: [
      "Rhinoplastie",
      "Blépharoplastie",
      "Lifting cervico-facial",
      "Mini-lifting",
      "Otoplastie",
      "Génioplastie",
      "Lipofilling visage",
      "Bichectomie",
      "Autre visage / cou",
    ],
  },
  {
    key: "seins",
    label: "Seins",
    items: [
      "Augmentation par implants",
      "Augmentation par lipofilling",
      "Changement / retrait d'implants",
      "Mastopexie",
      "Réduction mammaire",
      "Gynécomastie",
      "Autre sein",
    ],
  },
  {
    key: "silhouette",
    label: "Silhouette / corps",
    items: [
      "Liposuccion",
      "Abdominoplastie",
      "Mini-abdominoplastie",
      "Lifting des bras",
      "Lifting des cuisses",
      "BBL / lipofilling fessier",
      "Reprises / révisions",
      "Autre silhouette / corps",
    ],
  },
  {
    key: "combinees",
    label: "Interventions combinées",
    hint: "Peuvent nécessiter des règles de suivi spécifiques.",
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
    hint: "Non prioritaire V1 — la chirurgie esthétique post-opératoire reste le wedge KOVELA.",
    later: true,
    items: [
      "Toxine botulique",
      "Acide hyaluronique",
      "Lasers / peelings médicaux",
      "Fils tenseurs",
      "Autre médecine esthétique",
    ],
  },
];

// 10 cas transverses essentiels (vs 25+ dans l'ancienne version).
const CAS_ESSENTIELS_DEFS: string[] = [
  "Patient silencieux",
  "Patient anxieux",
  "Demande d'avis médical",
  "Demande médicament / ordonnance",
  "Douleur rapportée",
  "Saignement / gonflement / fièvre rapporté",
  "Photo absente ou floue",
  "Patient hors horaires",
  "Patient souhaite parler au chirurgien",
  "Situation urgente décrite par le patient",
];

// ---------------------------------------------------------------------------
// Modèle de données — orienté V1 minimal
// ---------------------------------------------------------------------------

type CompletionMode = "essentiel" | "avec_kovela" | "complet";

interface ContactInfo {
  nom: string;
  role: string;
  email: string;
  telephone: string;
}

interface CabinetState {
  chirurgien: string;
  cabinet: string;
  specialite: string;
  lieuPrincipal: string;
  contactPrincipal: ContactInfo;
  contactSecondaire: ContactInfo;
  contactBackUp: ContactInfo;
  canalPrioritaire: string;
  canalSecondaire: string;
  horaires: string;
  conduiteHorsHoraires: string;
}

interface Jalon {
  id: string;
  jour: string;
  objectif: string;
  suitesAttendues: string;
  aTransmettre: string;
}

interface InterventionState {
  key: string;
  family: FamilyKey;
  label: string;
  pratiquee: boolean;
  volumeMensuel: string;
  prioriteV1: boolean;
  // Parcours
  dureeSuivi: string;
  joursContact: string;
  jalons: Jalon[];
  questionsAuPatient: string;
  pointsRappelables: string;
  sujetsTransmissionCabinet: string;
  copieDepuis: string;
  // Règles de transmission — 3 blocs simples
  suiviHabituel: {
    situations: string;
    documentation: string;
    conduiteKovela: string;
  };
  aTransmettre: {
    situations: string;
    delai: string;
    elementsJoindre: string;
    canal: string;
  };
  prioritaire: {
    situations: string;
    canal: string;
    contact: string;
    delai: string;
  };
  // Photos par intervention
  photosAttendues: boolean;
  photoJours: string;
  photoTransmission: "toujours" | "selon_regle" | "non" | "";
  photoFloueConduite: string;
}

interface ConsignesState {
  kovelaPeutRappeler: string;
  kovelaNeDoitPasReformuler: string;
  questionsATransmettreCabinet: string;
  pansementContentionDrains: string;
}

interface CasEssentielState {
  key: string;
  label: string;
  conduiteAutorisee: string;
  transmettre: boolean;
  canal: string;
  delai: string;
}

interface ComptesRendusState {
  format: "court" | "standard" | "detaille" | "";
  frequence: "exceptions" | "chaque_patient" | "fin_de_suivi" | "";
  canal: string;
  destinataires: string;
  informationsInclure: string;
  informationsExclure: string;
}

interface ValidationState {
  refleteMesPreferences: boolean;
  comprendNonSubstitution: boolean;
  comprendRelectureKovela: boolean;
}

interface Referentiel {
  modeCompletion: CompletionMode | "";
  cabinet: CabinetState;
  interventions: InterventionState[];
  consignes: ConsignesState;
  casEssentiels: CasEssentielState[];
  comptesRendus: ComptesRendusState;
  validation: ValidationState;
}

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

const emptyContact = (): ContactInfo => ({ nom: "", role: "", email: "", telephone: "" });

const newJalon = (): Jalon => ({
  id: `jalon-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  jour: "",
  objectif: "",
  suitesAttendues: "",
  aTransmettre: "",
});

const buildInterventionsCatalog = (): InterventionState[] => {
  const all: InterventionState[] = [];
  INTERVENTION_FAMILIES.forEach((fam) => {
    fam.items.forEach((label) => {
      all.push({
        key: `${fam.key}::${label}`,
        family: fam.key,
        label,
        pratiquee: false,
        volumeMensuel: "",
        prioriteV1: false,
        dureeSuivi: "",
        joursContact: "",
        jalons: [],
        questionsAuPatient: "",
        pointsRappelables: "",
        sujetsTransmissionCabinet: "",
        copieDepuis: "",
        suiviHabituel: { situations: "", documentation: "", conduiteKovela: "" },
        aTransmettre: { situations: "", delai: "", elementsJoindre: "", canal: "" },
        prioritaire: { situations: "", canal: "", contact: "", delai: "" },
        photosAttendues: false,
        photoJours: "",
        photoTransmission: "",
        photoFloueConduite: "",
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
    contactPrincipal: emptyContact(),
    contactSecondaire: emptyContact(),
    contactBackUp: emptyContact(),
    canalPrioritaire: "",
    canalSecondaire: "",
    horaires: "",
    conduiteHorsHoraires: "",
  },
  interventions: buildInterventionsCatalog(),
  consignes: {
    kovelaPeutRappeler: "",
    kovelaNeDoitPasReformuler: "",
    questionsATransmettreCabinet: "",
    pansementContentionDrains: "",
  },
  casEssentiels: CAS_ESSENTIELS_DEFS.map((label) => ({
    key: label,
    label,
    conduiteAutorisee: "",
    transmettre: false,
    canal: "",
    delai: "",
  })),
  comptesRendus: {
    format: "",
    frequence: "",
    canal: "",
    destinataires: "",
    informationsInclure: "",
    informationsExclure: "",
  },
  validation: {
    refleteMesPreferences: false,
    comprendNonSubstitution: false,
    comprendRelectureKovela: false,
  },
});

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

const STEPS = [
  "Interventions prioritaires",
  "Parcours de suivi",
  "Règles de transmission",
  "Consignes, photos & soins",
  "Contacts & comptes-rendus",
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

function ContactBlock({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ContactInfo;
  onChange: (patch: Partial<ContactInfo>) => void;
}) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-navy-900/[0.06]">
      <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
        {label}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nom">
          <input
            className={inputCls}
            value={value.nom}
            onChange={(e) => onChange({ nom: e.target.value })}
          />
        </Field>
        <Field label="Rôle">
          <input
            className={inputCls}
            value={value.role}
            onChange={(e) => onChange({ role: e.target.value })}
            placeholder="ex : assistante référente, secrétariat…"
          />
        </Field>
        <Field label="Email (fictif)">
          <input
            className={inputCls}
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </Field>
        <Field label="Téléphone (fictif)">
          <input
            className={inputCls}
            value={value.telephone}
            onChange={(e) => onChange({ telephone: e.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export default function ReferentielFonctionnementPage() {
  const k = useKovela();
  const me = k.surgeon(MY_SURGEON_ID);

  const [step, setStep] = useState(0);
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [showComplet, setShowComplet] = useState(false);
  const [showCRExamples, setShowCRExamples] = useState(false);
  const [showMedEsthetique, setShowMedEsthetique] = useState(false);

  const [r, setR] = useState<Referentiel>(() =>
    initialReferentiel({
      chirurgien: me?.name ?? "",
      cabinet: me?.config?.locations?.[0] ?? "",
      specialite: me?.config?.specialization ?? "",
      lieuPrincipal: me?.config?.locations?.[0] ?? "",
    })
  );

  // Helpers ------------------------------------------------------------------

  const setCabinet = <K extends keyof CabinetState>(key: K, val: CabinetState[K]) =>
    setR((s) => ({ ...s, cabinet: { ...s.cabinet, [key]: val } }));

  const setContact = (
    which: "contactPrincipal" | "contactSecondaire" | "contactBackUp",
    patch: Partial<ContactInfo>
  ) =>
    setR((s) => ({
      ...s,
      cabinet: { ...s.cabinet, [which]: { ...s.cabinet[which], ...patch } },
    }));

  const setIntervention = (key: string, patch: Partial<InterventionState>) =>
    setR((s) => ({
      ...s,
      interventions: s.interventions.map((i) => (i.key === key ? { ...i, ...patch } : i)),
    }));

  const setReglesBlock = (
    key: string,
    block: "suiviHabituel" | "aTransmettre" | "prioritaire",
    patch: Partial<InterventionState[typeof block]>
  ) =>
    setR((s) => ({
      ...s,
      interventions: s.interventions.map((i) =>
        i.key === key ? { ...i, [block]: { ...i[block], ...patch } } : i
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

  const setConsignes = <K extends keyof ConsignesState>(key: K, val: ConsignesState[K]) =>
    setR((s) => ({ ...s, consignes: { ...s.consignes, [key]: val } }));

  const setCas = (key: string, patch: Partial<CasEssentielState>) =>
    setR((s) => ({
      ...s,
      casEssentiels: s.casEssentiels.map((c) => (c.key === key ? { ...c, ...patch } : c)),
    }));

  const setCR = <K extends keyof ComptesRendusState>(key: K, val: ComptesRendusState[K]) =>
    setR((s) => ({ ...s, comptesRendus: { ...s.comptesRendus, [key]: val } }));

  const setValidation = <K extends keyof ValidationState>(key: K, val: ValidationState[K]) =>
    setR((s) => ({ ...s, validation: { ...s.validation, [key]: val } }));

  // Dérivés ------------------------------------------------------------------

  const pratiquees = useMemo(
    () => r.interventions.filter((i) => i.pratiquee),
    [r.interventions]
  );
  const prioriteV1 = useMemo(() => pratiquees.filter((i) => i.prioriteV1), [pratiquees]);
  const totalPriorite = prioriteV1.length;

  // Complétude ---------------------------------------------------------------
  const completion = useMemo(() => {
    return STEPS.map((_, idx) => {
      switch (idx) {
        case 0:
          return totalPriorite > 0 ? 100 : 0;
        case 1:
          return totalPriorite === 0
            ? 0
            : Math.round(
                (prioriteV1.filter((i) => i.dureeSuivi || i.jalons.length > 0).length /
                  totalPriorite) *
                  100
              );
        case 2:
          return totalPriorite === 0
            ? 0
            : Math.round(
                (prioriteV1.filter(
                  (i) =>
                    i.suiviHabituel.situations ||
                    i.aTransmettre.situations ||
                    i.prioritaire.situations
                ).length /
                  totalPriorite) *
                  100
              );
        case 3: {
          const c = r.consignes;
          const filled = [
            c.kovelaPeutRappeler,
            c.kovelaNeDoitPasReformuler,
            c.questionsATransmettreCabinet,
            c.pansementContentionDrains,
          ].filter((v) => v.trim().length > 0).length;
          return Math.round((filled / 4) * 100);
        }
        case 4: {
          const cab = r.cabinet;
          const filledCab = [cab.contactPrincipal.nom, cab.canalPrioritaire, cab.horaires].filter(
            (v) => v.trim().length > 0
          ).length;
          const cr = r.comptesRendus;
          const filledCR = cr.format && cr.frequence && cr.canal ? 3 : cr.format ? 1 : 0;
          return Math.round(((filledCab + filledCR) / 6) * 100);
        }
        case 5: {
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
  }, [r, totalPriorite, prioriteV1]);

  const overallProgress = Math.round(completion.reduce((a, b) => a + b, 0) / completion.length);

  // Export -------------------------------------------------------------------

  const exportJson = () => {
    const interventions_prioritaires = prioriteV1.map((i) => ({
      nom: i.label,
      famille: i.family,
      volume_mensuel: i.volumeMensuel,
      duree_suivi: i.dureeSuivi,
      jours_contact: i.joursContact
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean),
      jalons: i.jalons.map((j) => ({
        jour: j.jour,
        objectif: j.objectif,
        suites_habituellement_attendues: j.suitesAttendues,
        a_transmettre: j.aTransmettre,
      })),
      questions_au_patient: i.questionsAuPatient,
      points_rappelables: i.pointsRappelables,
      sujets_transmission_cabinet: i.sujetsTransmissionCabinet,
      regles_transmission: {
        suivi_habituel: i.suiviHabituel,
        a_transmettre: i.aTransmettre,
        transmission_prioritaire: i.prioritaire,
      },
      photos: {
        attendues: i.photosAttendues,
        jours: i.photoJours,
        transmission_cabinet: i.photoTransmission || "non_renseigne",
        floue_ou_insuffisante: i.photoFloueConduite,
      },
    }));

    const cas_transverses_essentiels = r.casEssentiels.reduce<Record<string, unknown>>(
      (acc, c) => {
        acc[c.label] = {
          conduite_autorisee: c.conduiteAutorisee,
          transmettre: c.transmettre,
          canal: c.canal,
          delai: c.delai,
        };
        return acc;
      },
      {}
    );

    const payload = {
      meta: {
        version: "0.1",
        date_saisie: new Date().toISOString(),
        type: "referentiel_essentiel_chirurgien",
        donnees: "configuration_cabinet_sans_donnees_patient",
        prototype: true,
      },
      workflow_context: {
        stage: "post_onboarding",
        cabinet_status: "active_initial",
        payment_status: "mandate_ready",
        completion_mode: r.modeCompletion || "non_renseigne",
      },
      cabinet: r.cabinet,
      interventions_prioritaires,
      consignes_photos_soins: {
        kovela_peut_rappeler: r.consignes.kovelaPeutRappeler,
        kovela_ne_doit_pas_reformuler: r.consignes.kovelaNeDoitPasReformuler,
        questions_a_transmettre_cabinet: r.consignes.questionsATransmettreCabinet,
        pansement_contention_drains: r.consignes.pansementContentionDrains,
        medicaments_ordonnance: "transmettre_au_cabinet",
        note_photos:
          "KOVELA ne réalise pas d'interprétation médicale des photos. Les photos sont collectées et transmises selon les règles définies.",
      },
      cas_transverses_essentiels,
      regle_situation_urgente:
        "Si le patient décrit une situation urgente ou inquiétante, KOVELA lui rappelle de contacter les services d'urgence 15 / 112 et transmet l'information au cabinet selon le canal défini.",
      contacts_reporting: {
        contacts: {
          principal: r.cabinet.contactPrincipal,
          secondaire: r.cabinet.contactSecondaire,
          back_up: r.cabinet.contactBackUp,
        },
        canal_prioritaire: r.cabinet.canalPrioritaire,
        canal_secondaire: r.cabinet.canalSecondaire,
        horaires: r.cabinet.horaires,
        conduite_hors_horaires: r.cabinet.conduiteHorsHoraires,
        comptes_rendus: r.comptesRendus,
      },
      validation: {
        ...r.validation,
        status: "referentiel_essentiel_pret_pour_relecture_kovela",
        version: "0.1",
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kovela-referentiel-essentiel-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportToast("Export JSON téléchargé.");
    setTimeout(() => setExportToast(null), 3000);
  };

  const copySummary = async () => {
    const lines: string[] = [];
    lines.push("Référentiel essentiel — KOVELA");
    lines.push(`Cabinet : ${r.cabinet.cabinet || "—"}`);
    lines.push(`Chirurgien : ${r.cabinet.chirurgien || "—"}`);
    lines.push(`Spécialité : ${r.cabinet.specialite || "—"}`);
    lines.push(
      `Mode de complétion : ${
        r.modeCompletion === "essentiel"
          ? "Essentiel"
          : r.modeCompletion === "avec_kovela"
          ? "Avec KOVELA"
          : r.modeCompletion === "complet"
          ? "Complet"
          : "non renseigné"
      }`
    );
    lines.push("");
    lines.push(`Interventions prioritaires : ${totalPriorite}`);
    if (prioriteV1.length > 0) {
      prioriteV1.forEach((i) =>
        lines.push(`  • ${i.label} — ${i.dureeSuivi || "durée à préciser"}`)
      );
    }
    lines.push("");
    lines.push(`Format CR : ${r.comptesRendus.format || "—"}`);
    lines.push(`Canal CR : ${r.comptesRendus.canal || "—"}`);
    lines.push("");
    lines.push("Statut : référentiel essentiel — prêt pour relecture KOVELA");
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setExportToast("Résumé copié dans le presse-papier.");
    } catch {
      setExportToast("Copie impossible — utilisez l'export JSON.");
    }
    setTimeout(() => setExportToast(null), 3000);
  };

  // Rendu --------------------------------------------------------------------

  if (!me) return null;

  return (
    <Shell>
      <PageHeader
        eyebrow="Référentiel essentiel"
        title="Préparer votre référentiel de suivi"
        subtitle="Nous commençons par vos 2 ou 3 interventions les plus fréquentes. L'équipe KOVELA vous accompagne pour transformer vos habitudes en règles simples, opérables et modifiables."
      >
        <Link href="/chirurgien">
          <Button variant="ghost">Retour à l'espace chirurgien</Button>
        </Link>
      </PageHeader>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Bandeau de cadrage */}
        <div className="rounded-2xl border border-teal-200/40 bg-teal-50/40 px-5 py-4 text-[12.5px] leading-relaxed text-navy-900">
          <p className="font-medium">Étape post-onboarding — cabinet activé</p>
          <p className="mt-1 text-charcoal/75">
            L'objectif est de démarrer proprement, pas de tout formaliser d'un coup. Le référentiel
            pourra être enrichi progressivement avec l'équipe KOVELA.
          </p>
        </div>

        {/* Bandeau prototype + doctrine */}
        <div className="rounded-2xl bg-bone/60 px-5 py-4 text-[11.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
          <p className="font-medium text-navy-900">
            Prototype — configuration cabinet uniquement. Aucune donnée patient. Pas une plateforme
            de production HDS.
          </p>
          <p className="mt-2">
            KOVELA ne diagnostique pas, ne décide pas médicalement, ne remplace pas le chirurgien.
            KOVELA applique les règles de transmission définies par le chirurgien.
          </p>
        </div>

        {/* Mode de complétion — 2 options principales + Complet en option avancée */}
        <Card className="p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
            Comment souhaitez-vous compléter ?
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(
              [
                {
                  v: "essentiel",
                  title: "Essentiel",
                  desc: "2 ou 3 interventions prioritaires. Démarrage rapide.",
                  recommended: true,
                },
                {
                  v: "avec_kovela",
                  title: "Avec KOVELA",
                  desc: "Recommandé — finalisé avec l'équipe KOVELA.",
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
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[11.5px] leading-relaxed text-charcoal/55">
              Le mode <span className="font-medium text-navy-900">Essentiel</span> permet de
              démarrer avec vos 2 ou 3 interventions les plus fréquentes. Le reste pourra être
              complété progressivement avec l'équipe KOVELA.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowComplet((v) => !v);
                if (!showComplet) setR((s) => ({ ...s, modeCompletion: "complet" }));
              }}
              className="shrink-0 text-[11px] font-medium tracking-tight text-charcoal/55 underline-offset-2 hover:text-navy-900 hover:underline"
            >
              {showComplet ? "Masquer le mode avancé" : "Mode avancé — Complet"}
            </button>
          </div>
          {showComplet && r.modeCompletion === "complet" && (
            <div className="mt-3 rounded-lg bg-bone/60 px-3.5 py-2 text-[11.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
              Mode <span className="font-medium text-navy-900">Complet</span> sélectionné — version
              détaillée avec toutes les interventions et règles. Conseillé uniquement si l'équipe
              KOVELA a déjà fait un premier passage avec vous.
            </div>
          )}
        </Card>

        {/* Barre de progression */}
        <Card className="p-5">
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
        </Card>

        {/* Étapes */}
        <Card className="p-6">
          {/* ÉTAPE 1 — Interventions prioritaires */}
          {step === 0 && (
            <div className="space-y-7">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Vos interventions prioritaires
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Sélectionnez vos interventions principales et marquez{" "}
                  <span className="font-medium text-navy-900">2 ou 3 priorités V1</span>. Les
                  autres pourront être ajoutées plus tard avec l'équipe KOVELA.
                </p>
                <p className="mt-3 rounded-lg bg-bone/60 px-3.5 py-2 text-[11.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
                  On ne collecte pas tout. On collecte ce qui permet de démarrer proprement.
                </p>
              </div>

              {INTERVENTION_FAMILIES.filter((f) => !f.later || showMedEsthetique).map((fam) => (
                <details
                  key={fam.key}
                  open
                  className="group rounded-xl bg-white ring-1 ring-navy-900/[0.06]"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-2 list-none px-4 py-3">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                        {fam.label}
                      </h3>
                      {fam.hint && (
                        <span className="text-[10.5px] leading-relaxed text-charcoal/55">
                          {fam.hint}
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] text-charcoal/45 transition-transform group-open:rotate-90">
                      ›
                    </span>
                  </summary>
                  <div className="space-y-1.5 border-t border-navy-900/[0.05] p-3">
                    {r.interventions
                      .filter((i) => i.family === fam.key)
                      .map((i) => (
                        <div
                          key={i.key}
                          className={`rounded-lg px-3 py-2 transition-colors ${
                            i.pratiquee ? "bg-bone/40" : "bg-transparent"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="flex flex-1 cursor-pointer items-center gap-2.5 text-[12.5px] tracking-tight text-navy-900">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-navy-200 text-teal-600"
                                checked={i.pratiquee}
                                onChange={(e) =>
                                  setIntervention(i.key, {
                                    pratiquee: e.target.checked,
                                    ...(e.target.checked ? {} : { prioriteV1: false }),
                                  })
                                }
                              />
                              <span className={i.pratiquee ? "font-medium" : "text-charcoal/65"}>
                                {i.label}
                              </span>
                            </label>
                            {i.pratiquee && (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min={0}
                                  placeholder="vol. / mois"
                                  className="w-24 rounded-md border border-navy-900/[0.08] bg-white px-2 py-1 text-[11.5px] outline-none focus:border-teal-500/60"
                                  value={i.volumeMensuel}
                                  onChange={(e) =>
                                    setIntervention(i.key, { volumeMensuel: e.target.value })
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setIntervention(i.key, { prioriteV1: !i.prioriteV1 })
                                  }
                                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium tracking-tight transition-colors ${
                                    i.prioriteV1
                                      ? "bg-teal-600 text-white shadow-soft"
                                      : "bg-white text-charcoal/65 ring-1 ring-navy-900/[0.08] hover:text-navy-900"
                                  }`}
                                >
                                  {i.prioriteV1 ? "✓ Priorité V1" : "Marquer prioritaire"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </details>
              ))}

              {!showMedEsthetique && (
                <button
                  type="button"
                  onClick={() => setShowMedEsthetique(true)}
                  className="text-[11.5px] font-medium tracking-tight text-charcoal/55 underline-offset-2 hover:text-navy-900 hover:underline"
                >
                  Afficher la médecine esthétique (non prioritaire V1)
                </button>
              )}

              <div className="rounded-xl bg-white p-4 ring-1 ring-navy-900/[0.06]">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                  Synthèse
                </p>
                <p className="mt-2 text-[13px] tracking-tight text-navy-900">
                  {pratiquees.length} intervention{pratiquees.length > 1 ? "s" : ""} pratiquée
                  {pratiquees.length > 1 ? "s" : ""} ·{" "}
                  <span
                    className={
                      totalPriorite >= 2 && totalPriorite <= 3
                        ? "text-teal-700"
                        : "text-amber-700"
                    }
                  >
                    {totalPriorite} priorité V1{" "}
                    {totalPriorite < 2 && totalPriorite > 0
                      ? "— ajoutez-en encore 1 ou 2"
                      : totalPriorite > 3
                      ? "— concentrez-vous sur 2 ou 3"
                      : ""}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 — Parcours de suivi */}
          {step === 1 && (
            <div className="space-y-7">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Parcours de suivi
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Pour chaque intervention prioritaire : durée, jours de contact et 2-3 jalons
                  principaux. L'idée est de cadrer, pas d'exhaustivité.
                </p>
              </div>

              {prioriteV1.length === 0 && (
                <div className="rounded-xl bg-bone/60 px-4 py-3 text-[12.5px] text-charcoal/65 ring-1 ring-navy-900/[0.04]">
                  Aucune intervention marquée &laquo; Priorité V1 &raquo; à l'étape précédente.
                  Revenez à l'étape 1 pour en marquer 2 ou 3.
                </div>
              )}

              {prioriteV1.map((i) => (
                <div key={i.key} className="rounded-2xl bg-white p-5 ring-1 ring-navy-900/[0.06]">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-navy-900/[0.05] pb-3">
                    <h3 className="font-display text-[15.5px] font-semibold tracking-tight text-navy-900">
                      {i.label}
                    </h3>
                    <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                      Priorité V1
                    </Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Durée du suivi" hint="ex : J+1 à J+30">
                      <input
                        className={inputCls}
                        value={i.dureeSuivi}
                        onChange={(e) =>
                          setIntervention(i.key, { dureeSuivi: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Jours de contact souhaités" hint="séparés par virgules — ex : J+1, J+7, J+15">
                      <input
                        className={inputCls}
                        value={i.joursContact}
                        onChange={(e) =>
                          setIntervention(i.key, { joursContact: e.target.value })
                        }
                      />
                    </Field>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                        Jalons principaux
                      </p>
                      <Button variant="subtle" onClick={() => addJalon(i.key)}>
                        + Ajouter un jalon
                      </Button>
                    </div>
                    {i.jalons.length === 0 && (
                      <p className="rounded-lg bg-bone/60 px-3.5 py-2 text-[11.5px] text-charcoal/60 ring-1 ring-navy-900/[0.04]">
                        Ajoutez 2 ou 3 jalons clés. Plus tard, vous pourrez les affiner avec
                        l'équipe KOVELA.
                      </p>
                    )}
                    <div className="space-y-2">
                      {i.jalons.map((j, jdx) => (
                        <div
                          key={j.id}
                          className="rounded-lg bg-bone/40 p-3 ring-1 ring-navy-900/[0.04]"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <Badge className="bg-navy-900/[0.06] text-charcoal/75 ring-navy-900/[0.08]">
                              Jalon {jdx + 1}
                            </Badge>
                            <button
                              type="button"
                              onClick={() => removeJalon(i.key, j.id)}
                              className="text-[11px] font-medium text-rose-700/80 hover:text-rose-700"
                            >
                              Retirer
                            </button>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
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
                            <Field
                              label="Suites habituellement attendues selon votre pratique"
                              className="sm:col-span-2"
                            >
                              <textarea
                                className={textareaCls}
                                rows={2}
                                value={j.suitesAttendues}
                                onChange={(e) =>
                                  updateJalon(i.key, j.id, { suitesAttendues: e.target.value })
                                }
                              />
                            </Field>
                            <Field label="À transmettre au cabinet" className="sm:col-span-2">
                              <textarea
                                className={textareaCls}
                                rows={2}
                                value={j.aTransmettre}
                                onChange={(e) =>
                                  updateJalon(i.key, j.id, { aTransmettre: e.target.value })
                                }
                              />
                            </Field>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Questions utiles à poser au patient">
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={i.questionsAuPatient}
                        onChange={(e) =>
                          setIntervention(i.key, { questionsAuPatient: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Points que KOVELA peut rappeler">
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={i.pointsRappelables}
                        onChange={(e) =>
                          setIntervention(i.key, { pointsRappelables: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Sujets à transmettre au cabinet" className="sm:col-span-2">
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={i.sujetsTransmissionCabinet}
                        onChange={(e) =>
                          setIntervention(i.key, { sujetsTransmissionCabinet: e.target.value })
                        }
                      />
                    </Field>
                    <Field
                      label="Copier depuis une autre intervention prioritaire"
                      className="sm:col-span-2"
                      hint="Permet de dupliquer durée, jalons et règles d'une autre intervention."
                    >
                      <select
                        className={inputCls}
                        value={i.copieDepuis}
                        onChange={(e) => {
                          const src = prioriteV1.find((x) => x.key === e.target.value);
                          if (src && src.key !== i.key) {
                            setIntervention(i.key, {
                              copieDepuis: e.target.value,
                              dureeSuivi: src.dureeSuivi,
                              joursContact: src.joursContact,
                              jalons: src.jalons.map((j) => ({ ...j, id: newJalon().id })),
                              questionsAuPatient: src.questionsAuPatient,
                              pointsRappelables: src.pointsRappelables,
                              sujetsTransmissionCabinet: src.sujetsTransmissionCabinet,
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

          {/* ÉTAPE 3 — Règles de transmission */}
          {step === 2 && (
            <div className="space-y-7">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Règles de transmission au cabinet
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Pour chaque intervention prioritaire, définissez trois catégories simples.
                  KOVELA ne qualifie pas médicalement — KOVELA applique vos règles.
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
                <div key={i.key} className="rounded-2xl bg-white p-5 ring-1 ring-navy-900/[0.06]">
                  <h3 className="mb-4 border-b border-navy-900/[0.05] pb-3 font-display text-[15.5px] font-semibold tracking-tight text-navy-900">
                    {i.label}
                  </h3>

                  {/* Suivi habituel */}
                  <div className="rounded-lg bg-bone/40 p-4 ring-1 ring-navy-900/[0.04]">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                        Suivi habituel
                      </Badge>
                      <p className="text-[11.5px] text-charcoal/55">
                        Ce que KOVELA peut documenter sans solliciter le cabinet.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Situations habituelles" className="sm:col-span-2">
                        <textarea
                          className={textareaCls}
                          rows={2}
                          value={i.suiviHabituel.situations}
                          onChange={(e) =>
                            setReglesBlock(i.key, "suiviHabituel", { situations: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Informations à documenter">
                        <textarea
                          className={textareaCls}
                          rows={2}
                          value={i.suiviHabituel.documentation}
                          onChange={(e) =>
                            setReglesBlock(i.key, "suiviHabituel", {
                              documentation: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Ce que KOVELA peut faire">
                        <textarea
                          className={textareaCls}
                          rows={2}
                          value={i.suiviHabituel.conduiteKovela}
                          onChange={(e) =>
                            setReglesBlock(i.key, "suiviHabituel", {
                              conduiteKovela: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  {/* À transmettre */}
                  <div className="mt-3 rounded-lg bg-bone/40 p-4 ring-1 ring-navy-900/[0.04]">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
                        À transmettre au cabinet
                      </Badge>
                      <p className="text-[11.5px] text-charcoal/55">
                        Ce que vous souhaitez recevoir pour relecture ou avis.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Situations à transmettre" className="sm:col-span-2">
                        <textarea
                          className={textareaCls}
                          rows={2}
                          value={i.aTransmettre.situations}
                          onChange={(e) =>
                            setReglesBlock(i.key, "aTransmettre", { situations: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Délai souhaité">
                        <input
                          className={inputCls}
                          value={i.aTransmettre.delai}
                          onChange={(e) =>
                            setReglesBlock(i.key, "aTransmettre", { delai: e.target.value })
                          }
                          placeholder="ex : 24 h"
                        />
                      </Field>
                      <Field label="Canal">
                        <input
                          className={inputCls}
                          value={i.aTransmettre.canal}
                          onChange={(e) =>
                            setReglesBlock(i.key, "aTransmettre", { canal: e.target.value })
                          }
                          placeholder="ex : email cabinet"
                        />
                      </Field>
                      <Field label="Éléments à joindre" className="sm:col-span-2">
                        <textarea
                          className={textareaCls}
                          rows={2}
                          value={i.aTransmettre.elementsJoindre}
                          onChange={(e) =>
                            setReglesBlock(i.key, "aTransmettre", {
                              elementsJoindre: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Transmission prioritaire */}
                  <div className="mt-3 rounded-lg bg-bone/40 p-4 ring-1 ring-navy-900/[0.04]">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge className="bg-rose-50/60 text-rose-700 ring-rose-200/60">
                        Transmission prioritaire
                      </Badge>
                      <p className="text-[11.5px] text-charcoal/55">
                        Ce qui doit être transmis rapidement au cabinet.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Situations concernées" className="sm:col-span-2">
                        <textarea
                          className={textareaCls}
                          rows={2}
                          value={i.prioritaire.situations}
                          onChange={(e) =>
                            setReglesBlock(i.key, "prioritaire", { situations: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Canal prioritaire">
                        <input
                          className={inputCls}
                          value={i.prioritaire.canal}
                          onChange={(e) =>
                            setReglesBlock(i.key, "prioritaire", { canal: e.target.value })
                          }
                          placeholder="ex : appel + email"
                        />
                      </Field>
                      <Field label="Contact destinataire">
                        <input
                          className={inputCls}
                          value={i.prioritaire.contact}
                          onChange={(e) =>
                            setReglesBlock(i.key, "prioritaire", { contact: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Délai attendu">
                        <input
                          className={inputCls}
                          value={i.prioritaire.delai}
                          onChange={(e) =>
                            setReglesBlock(i.key, "prioritaire", { delai: e.target.value })
                          }
                          placeholder="ex : sous 2 h"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ÉTAPE 4 — Consignes, photos & soins */}
          {step === 3 && (
            <div className="space-y-7">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Consignes, photos &amp; soins
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Cadre minimal pour démarrer. KOVELA ne reformule pas médicalement vos consignes
                  existantes — KOVELA les rappelle selon vos règles.
                </p>
              </div>

              <SubSection title="Consignes">
                <div className="grid gap-4">
                  <Field label="Ce que KOVELA peut rappeler au patient sans reformuler médicalement">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.consignes.kovelaPeutRappeler}
                      onChange={(e) => setConsignes("kovelaPeutRappeler", e.target.value)}
                    />
                  </Field>
                  <Field label="Ce que KOVELA ne doit jamais interpréter ou reformuler">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.consignes.kovelaNeDoitPasReformuler}
                      onChange={(e) => setConsignes("kovelaNeDoitPasReformuler", e.target.value)}
                    />
                  </Field>
                  <Field label="Les sujets qui doivent toujours revenir au cabinet">
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={r.consignes.questionsATransmettreCabinet}
                      onChange={(e) =>
                        setConsignes("questionsATransmettreCabinet", e.target.value)
                      }
                    />
                  </Field>
                </div>
              </SubSection>

              <SubSection
                title="Photos"
                hint="KOVELA ne réalise pas d'interprétation médicale des photos. Les photos sont collectées et transmises selon vos règles."
              >
                {prioriteV1.length === 0 ? (
                  <p className="rounded-lg bg-bone/60 px-3.5 py-2 text-[11.5px] text-charcoal/60 ring-1 ring-navy-900/[0.04]">
                    Configurez d'abord vos interventions prioritaires.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {prioriteV1.map((i) => (
                      <div
                        key={i.key}
                        className="rounded-xl bg-white p-4 ring-1 ring-navy-900/[0.06]"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="font-display text-[13px] font-semibold tracking-tight text-navy-900">
                            {i.label}
                          </p>
                          <Toggle
                            checked={i.photosAttendues}
                            onChange={(v) =>
                              setIntervention(i.key, { photosAttendues: v })
                            }
                            label="Photos attendues"
                          />
                        </div>
                        {i.photosAttendues && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Field label="Jours souhaités" hint="ex : J+7, J+15">
                              <input
                                className={inputCls}
                                value={i.photoJours}
                                onChange={(e) =>
                                  setIntervention(i.key, { photoJours: e.target.value })
                                }
                              />
                            </Field>
                            <Field label="Transmettre les photos au cabinet">
                              <select
                                className={inputCls}
                                value={i.photoTransmission}
                                onChange={(e) =>
                                  setIntervention(i.key, {
                                    photoTransmission: e.target
                                      .value as InterventionState["photoTransmission"],
                                  })
                                }
                              >
                                <option value="">—</option>
                                <option value="toujours">Toujours</option>
                                <option value="selon_regle">Selon règle</option>
                                <option value="non">Non</option>
                              </select>
                            </Field>
                            <Field
                              label="Photo floue ou insuffisante — que faire"
                              className="sm:col-span-2"
                            >
                              <textarea
                                className={textareaCls}
                                rows={2}
                                value={i.photoFloueConduite}
                                onChange={(e) =>
                                  setIntervention(i.key, { photoFloueConduite: e.target.value })
                                }
                              />
                            </Field>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </SubSection>

              <SubSection title="Pansement / contention / drains">
                <Field
                  label="Éléments simples à connaître pour le suivi"
                  hint="ex : pansement à laisser X jours, contention 24/24 pendant X semaines, ablation des fils à J+X…"
                >
                  <textarea
                    className={textareaCls}
                    rows={3}
                    value={r.consignes.pansementContentionDrains}
                    onChange={(e) => setConsignes("pansementContentionDrains", e.target.value)}
                  />
                </Field>
              </SubSection>

              <div className="rounded-xl bg-bone/60 px-5 py-4 text-[12.5px] leading-relaxed text-charcoal/70 ring-1 ring-navy-900/[0.04]">
                <p className="font-medium text-navy-900">Médicaments / ordonnance</p>
                <p className="mt-1.5">
                  KOVELA transmet au cabinet toute question relative aux médicaments, ordonnances
                  ou soins prescrits. Aucune interprétation, aucune reformulation.
                </p>
              </div>
            </div>
          )}

          {/* ÉTAPE 5 — Contacts & comptes-rendus + cas essentiels */}
          {step === 4 && (
            <div className="space-y-7">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Contacts &amp; comptes-rendus
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Qui contacter, quand, et quel format de compte-rendu vous attendez.
                </p>
              </div>

              <SubSection title="Contacts">
                <div className="space-y-3">
                  <ContactBlock
                    label="Contact principal"
                    value={r.cabinet.contactPrincipal}
                    onChange={(patch) => setContact("contactPrincipal", patch)}
                  />
                  <ContactBlock
                    label="Contact secondaire"
                    value={r.cabinet.contactSecondaire}
                    onChange={(patch) => setContact("contactSecondaire", patch)}
                  />
                  <ContactBlock
                    label="Contact back-up"
                    value={r.cabinet.contactBackUp}
                    onChange={(patch) => setContact("contactBackUp", patch)}
                  />
                </div>
              </SubSection>

              <SubSection title="Canaux & horaires">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Canal prioritaire">
                    <input
                      className={inputCls}
                      value={r.cabinet.canalPrioritaire}
                      onChange={(e) => setCabinet("canalPrioritaire", e.target.value)}
                      placeholder="ex : email cabinet"
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
                  <Field label="Conduite hors horaires / week-end">
                    <input
                      className={inputCls}
                      value={r.cabinet.conduiteHorsHoraires}
                      onChange={(e) => setCabinet("conduiteHorsHoraires", e.target.value)}
                      placeholder="ex : rappel 15 / 112, transmission différée"
                    />
                  </Field>
                </div>
              </SubSection>

              <SubSection title="Comptes-rendus">
                <div className="grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      { v: "court", title: "Court", desc: "1–3 lignes factuelles par patient." },
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
                      <p className="font-display text-[13.5px] font-semibold tracking-tight text-navy-900">
                        {opt.title}
                      </p>
                      <p className="mt-1.5 text-[11.5px] leading-relaxed text-charcoal/60">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Fréquence">
                    <select
                      className={inputCls}
                      value={r.comptesRendus.frequence}
                      onChange={(e) =>
                        setCR(
                          "frequence",
                          e.target.value as ComptesRendusState["frequence"]
                        )
                      }
                    >
                      <option value="">—</option>
                      <option value="exceptions">Uniquement les exceptions</option>
                      <option value="chaque_patient">Pour chaque patient</option>
                      <option value="fin_de_suivi">À la fin du suivi</option>
                    </select>
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
                  <Field label="Informations à inclure">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.comptesRendus.informationsInclure}
                      onChange={(e) => setCR("informationsInclure", e.target.value)}
                    />
                  </Field>
                  <Field label="Informations à exclure">
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={r.comptesRendus.informationsExclure}
                      onChange={(e) => setCR("informationsExclure", e.target.value)}
                    />
                  </Field>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCRExamples((v) => !v)}
                  className="mt-3 text-[11.5px] font-medium tracking-tight text-charcoal/55 underline-offset-2 hover:text-navy-900 hover:underline"
                >
                  {showCRExamples ? "Masquer les exemples" : "Voir exemples de structures CR"}
                </button>
                {showCRExamples && (
                  <div className="mt-3 grid gap-3 lg:grid-cols-3">
                    {(
                      [
                        {
                          title: "CR très court",
                          items: ["Intervention", "Jour post-op", "Statut", "Action KOVELA"],
                        },
                        {
                          title: "CR standard",
                          items: [
                            "Intervention",
                            "Jour post-op",
                            "Dernier contact",
                            "Éléments déclarés par patient",
                            "Action KOVELA",
                            "Prochaine étape",
                          ],
                        },
                        {
                          title: "CR prioritaire",
                          items: [
                            "Intervention",
                            "Jour post-op",
                            "Élément déclencheur",
                            "Photos transmises",
                            "Canal & destinataire",
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
                )}
              </SubSection>

              <SubSection
                title="Cas fréquents à transmettre"
                hint="Pour chaque cas, indiquez ce que KOVELA peut faire et si une transmission cabinet est attendue."
              >
                <div className="space-y-2">
                  {r.casEssentiels.map((c) => (
                    <details
                      key={c.key}
                      className="group rounded-xl bg-white p-4 ring-1 ring-navy-900/[0.06] transition-colors hover:ring-navy-900/[0.1]"
                    >
                      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 list-none">
                        <span className="font-display text-[13px] font-semibold tracking-tight text-navy-900">
                          {c.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {c.conduiteAutorisee && (
                            <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                              Conduite définie
                            </Badge>
                          )}
                          {c.transmettre && (
                            <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
                              Transmettre
                            </Badge>
                          )}
                          <span className="text-[12px] text-charcoal/45 transition-transform group-open:rotate-90">
                            ›
                          </span>
                        </div>
                      </summary>
                      <div className="mt-4 grid gap-3 border-t border-navy-900/[0.05] pt-4 sm:grid-cols-2">
                        <Field label="Ce que KOVELA peut faire" className="sm:col-span-2">
                          <textarea
                            className={textareaCls}
                            rows={2}
                            value={c.conduiteAutorisee}
                            onChange={(e) =>
                              setCas(c.key, { conduiteAutorisee: e.target.value })
                            }
                          />
                        </Field>
                        <Field label="Transmettre au cabinet">
                          <Toggle
                            checked={c.transmettre}
                            onChange={(v) => setCas(c.key, { transmettre: v })}
                            label="Oui — transmettre"
                          />
                        </Field>
                        <Field label="Délai">
                          <input
                            className={inputCls}
                            value={c.delai}
                            onChange={(e) => setCas(c.key, { delai: e.target.value })}
                            placeholder="ex : sous 24 h"
                          />
                        </Field>
                        <Field label="Canal" className="sm:col-span-2">
                          <input
                            className={inputCls}
                            value={c.canal}
                            onChange={(e) => setCas(c.key, { canal: e.target.value })}
                          />
                        </Field>
                      </div>
                    </details>
                  ))}
                </div>
              </SubSection>
            </div>
          )}

          {/* ÉTAPE 6 — Récap & export */}
          {step === 5 && (
            <div className="space-y-7">
              <div>
                <h2 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                  Récapitulatif &amp; export
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-charcoal/60">
                  Synthèse de votre référentiel essentiel. Validez puis exportez pour l'équipe
                  KOVELA.
                </p>
                <p className="mt-3 rounded-xl border border-teal-200/40 bg-teal-50/40 px-4 py-3 text-[12.5px] leading-relaxed text-navy-900">
                  <span className="font-medium">
                    Ce référentiel essentiel sera relu avec KOVELA avant usage opérationnel.
                  </span>
                </p>
              </div>

              <SubSection title="Synthèse">
                <dl className="grid gap-x-6 gap-y-2 text-[12.5px] sm:grid-cols-2">
                  {[
                    ["Chirurgien", r.cabinet.chirurgien || "—"],
                    ["Cabinet", r.cabinet.cabinet || "—"],
                    ["Spécialité", r.cabinet.specialite || "—"],
                    ["Interventions prioritaires", `${totalPriorite}`],
                    ["Contact principal", r.cabinet.contactPrincipal.nom || "—"],
                    ["Canal prioritaire", r.cabinet.canalPrioritaire || "—"],
                    ["Format CR", r.comptesRendus.format || "—"],
                    [
                      "Fréquence CR",
                      r.comptesRendus.frequence === "exceptions"
                        ? "Uniquement exceptions"
                        : r.comptesRendus.frequence === "chaque_patient"
                        ? "Chaque patient"
                        : r.comptesRendus.frequence === "fin_de_suivi"
                        ? "Fin de suivi"
                        : "—",
                    ],
                    [
                      "Mode de complétion",
                      r.modeCompletion === "essentiel"
                        ? "Essentiel"
                        : r.modeCompletion === "avec_kovela"
                        ? "Avec KOVELA"
                        : r.modeCompletion === "complet"
                        ? "Complet (mode avancé)"
                        : "—",
                    ],
                    ["Statut", "Référentiel essentiel — prêt pour relecture KOVELA"],
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
                <SubSection title="Interventions configurées">
                  <div className="space-y-2">
                    {prioriteV1.map((i) => (
                      <div
                        key={i.key}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-4 py-3 ring-1 ring-navy-900/[0.06]"
                      >
                        <div>
                          <p className="font-display text-[13px] font-semibold tracking-tight text-navy-900">
                            {i.label}
                          </p>
                          <p className="mt-0.5 text-[11px] tracking-tight text-charcoal/55">
                            {i.dureeSuivi || "durée à préciser"} · {i.jalons.length} jalon
                            {i.jalons.length > 1 ? "s" : ""}
                          </p>
                        </div>
                        <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                          Priorité V1
                        </Badge>
                      </div>
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
