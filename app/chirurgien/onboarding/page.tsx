"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, Modal, PageHeader } from "@/components/ui";
import { useKovela } from "@/lib/store";
import { mandateLabels, mandateStyles } from "@/lib/format";
import type { CabinetConfig, MandateStatus } from "@/lib/types";

const MY_SURGEON_ID = "s1";

const SPECIALIZATIONS = [
  "Chirurgie esthétique / plastique",
  "Chirurgie maxillo-faciale",
  "Chirurgie orthopédique",
  "Chirurgie ORL",
  "Chirurgie ophtalmologique",
  "Chirurgie urologique",
  "Chirurgie gynécologique",
  "Autre spécialité ambulatoire",
];

const VERTICALS = [
  "Esthétique & plastique",
  "Ambulatoire orthopédique",
  "ORL / maxillo-facial",
  "Ophtalmologie",
  "Urologie",
  "Gynécologie",
];

const inputCls =
  "w-full rounded-xl border border-navy-100 px-3 py-2 text-sm outline-none focus:border-teal-400";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-charcoal/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-charcoal/45">{hint}</span>}
    </label>
  );
}

const STEPS = [
  "Votre cabinet",
  "Lieux",
  "Contacts autorisés",
  "Documents de service",
  "Prélèvement",
  "Validation",
];

type DocKey = "cgs" | "confidentialite" | "dpa" | "annexe" | "regles";

const DOCS: { key: DocKey; title: string; version: string; placeholder: string }[] = [
  {
    key: "cgs",
    title: "Conditions Générales de Services KOVELA",
    version: "v0.1",
    placeholder:
      "Conditions générales du service opéré de coordination post-opératoire KOVELA : objet, périmètre, modalités, obligations réciproques, durée, résiliation. Document de démonstration — version prototype v0.1, à valider juridiquement avant la V1.",
  },
  {
    key: "confidentialite",
    title: "Politique de confidentialité",
    version: "v0.1",
    placeholder:
      "Politique relative au traitement des données personnelles : finalités, base légale, durées de conservation, droits des personnes, sécurité des accès. Document de démonstration — version prototype v0.1, à valider juridiquement avant la V1.",
  },
  {
    key: "dpa",
    title: "Accord de traitement des données (DPA)",
    version: "v0.1",
    placeholder:
      "Accord de traitement des données entre le cabinet (responsable de traitement) et KOVELA (sous-traitant) : périmètre, mesures techniques et organisationnelles, sous-traitants ultérieurs, audit. Document de démonstration — version prototype v0.1.",
  },
  {
    key: "annexe",
    title: "Annexe opérationnelle de service",
    version: "v0.1",
    placeholder:
      "Annexe détaillant les modalités opérationnelles du service KOVELA : supervision humaine, IA assistive interne, gating des CR factuels, transmissions cabinet, plages de traitement indicatives. Document de démonstration — version prototype v0.1.",
  },
  {
    key: "regles",
    title: "Règles de fonctionnement du service",
    version: "v0.1",
    placeholder:
      "Règles de fonctionnement entre KOVELA et le cabinet : non-substitution au chirurgien, décisions opérationnelles côté cabinet, traçabilité, gestion des incidents, modalités d'évolution. Document de démonstration — version prototype v0.1.",
  },
];

const ACCEPTANCE_ITEMS: string[] = [
  "J'ai pris connaissance des Conditions Générales de Services KOVELA.",
  "J'ai pris connaissance de la politique de confidentialité.",
  "J'ai pris connaissance de l'accord de traitement des données.",
  "J'ai pris connaissance de l'annexe opérationnelle de service.",
  "J'ai compris que KOVELA est un service opéré de coordination post-opératoire.",
  "J'ai compris que KOVELA ne se substitue pas au chirurgien.",
  "J'ai compris que les modalités opérationnelles du service sont définies avec le cabinet.",
];

// useSearchParams() exige un Suspense boundary côté Next 14 App Router.
export default function ChirurgienOnboardingPage() {
  return (
    <Suspense fallback={null}>
      <ChirurgienOnboarding />
    </Suspense>
  );
}

function ChirurgienOnboarding() {
  const k = useKovela();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromActivation = searchParams?.get("from") === "activation";
  const activationProspectId = searchParams?.get("prospect") ?? null;
  const activationProspect = activationProspectId
    ? k.prospects.find((p) => p.id === activationProspectId)
    : undefined;
  const me = k.surgeon(MY_SURGEON_ID);

  const [step, setStep] = useState(0);
  const [assistantName, setAssistantName] = useState("");
  const [form, setForm] = useState<CabinetConfig>(() => ({ ...(me?.config as CabinetConfig) }));

  // Étape Documents de service : lecture + acceptation simulée.
  const [docsRead, setDocsRead] = useState<Record<DocKey, boolean>>({
    cgs: false,
    confidentialite: false,
    dpa: false,
    annexe: false,
    regles: false,
  });
  const [acceptances, setAcceptances] = useState<boolean[]>(
    ACCEPTANCE_ITEMS.map(() => false)
  );
  const [openDoc, setOpenDoc] = useState<DocKey | null>(null);
  const [docsValidatedAt, setDocsValidatedAt] = useState<string | null>(
    me?.config.documentsAcceptedAt ?? null
  );

  if (!me) return null;

  const allDocsRead = (Object.values(docsRead) as boolean[]).every(Boolean);
  const allAccepted = acceptances.every(Boolean);
  const canValidateDocs = allDocsRead && allAccepted;

  const set = <K extends keyof CabinetConfig>(key: K, val: CabinetConfig[K]) =>
    setForm((f) => ({ ...f, [key]: val }));
  const setLocation = (i: number, val: string) =>
    setForm((f) => {
      const locations = [...f.locations];
      locations[i] = val;
      return { ...f, locations };
    });

  function validateDocs() {
    k.acceptCabinetDocuments(MY_SURGEON_ID);
    setDocsValidatedAt(new Date().toISOString());
  }

  function finish() {
    k.saveCabinetConfig(MY_SURGEON_ID, form);
    router.push("/chirurgien");
  }

  return (
    <Shell>
      <PageHeader
        eyebrow="Mise en place cabinet"
        title={
          fromActivation && activationProspect
            ? `Bienvenue Dr ${activationProspect.firstName} ${activationProspect.lastName}`
            : "Mettre en place le service KOVELA pour votre cabinet"
        }
        subtitle={
          fromActivation
            ? "Activation cabinet en cours — informations cabinet, contacts autorisés, documents de service et prélèvement. Le référentiel essentiel sera ensuite construit avec l'équipe KOVELA."
            : "Ce lien vous a été transmis après un échange avec l'équipe KOVELA. Il permet de préparer l'activation du service : informations cabinet, contacts autorisés, documents de service et prélèvement."
        }
      />

      <div className="mx-auto max-w-3xl">
        {/* Mode démo (accès direct via /login, hors parcours activation) : honnêteté narrative. */}
        {!fromActivation && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200/50 bg-amber-50/40 px-4 py-3 text-[11.5px] leading-relaxed text-amber-900">
            <span className="mt-0.5 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800 ring-1 ring-amber-200">
              Mode démo
            </span>
            <span>
              Vous explorez le flux de mise en place sans lien d&apos;activation cabinet. En
              production, ce parcours est ouvert via un lien personnalisé transmis après un
              échange avec l&apos;équipe KOVELA — pas d&apos;inscription libre.
            </span>
          </div>
        )}
        <div className="mb-6 flex flex-wrap items-start gap-x-4 gap-y-3 rounded-xl bg-white px-5 py-4 text-[12.5px] leading-relaxed text-charcoal/70 shadow-soft ring-1 ring-navy-900/[0.05]">
          <div className="flex flex-col gap-1.5">
            <span className="flex w-fit items-center gap-2 rounded-md bg-teal-50/60 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-teal-700 ring-1 ring-teal-100/70">
              <span className="h-1 w-1 rounded-full bg-teal-500" />
              15 min · mise en place initiale du cabinet
            </span>
            <span className="flex w-fit items-center gap-2 rounded-md bg-navy-50 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-navy-700 ring-1 ring-navy-100">
              <span className="h-1 w-1 rounded-full bg-navy-700/60" />
              30–60 min · référentiel essentiel accompagné par KOVELA
            </span>
          </div>
          <span className="flex-1 min-w-[260px]">
            Objectif : activer proprement 2 ou 3 interventions prioritaires, pas tout formaliser
            d'un coup. Cette étape prépare le service avec votre cabinet ; le référentiel essentiel
            est ensuite construit avec l'équipe KOVELA depuis votre espace chirurgien.
          </span>
        </div>

        {/* Progression */}
        <div className="mb-7 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[11px] tracking-tight">
          {STEPS.map((label, i) => (
            <span key={label} className="flex items-center gap-1.5">
              <span
                className={`flex h-7 items-center gap-2 rounded-md px-2.5 font-medium ${
                  i === step
                    ? "bg-navy-900 text-white shadow-soft"
                    : i < step
                    ? "bg-teal-50/60 text-teal-700 ring-1 ring-teal-100/70"
                    : "bg-white text-charcoal/55 ring-1 ring-navy-900/[0.06]"
                }`}
              >
                <span
                  className={`flex h-[15px] w-[15px] items-center justify-center rounded text-[9px] font-bold ${
                    i === step
                      ? "bg-white/20 text-white"
                      : i < step
                      ? "bg-teal-600 text-white"
                      : "bg-navy-900/[0.06] text-charcoal/55"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="text-charcoal/25">›</span>}
            </span>
          ))}
        </div>

        <Card className="p-6">
          {/* Étape 1 — Identité & spécialisation */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-[1.35rem] font-medium tracking-tight text-navy-900">Identité du cabinet</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Chirurgien">
                  <input className={inputCls} value={me.name} disabled />
                </Field>
                <Field label="Cabinet / établissement principal">
                  <input
                    className={inputCls}
                    value={form.locations[0] ?? ""}
                    onChange={(e) => setLocation(0, e.target.value)}
                  />
                </Field>
                <Field label="Spécialisation principale">
                  <select
                    className={inputCls}
                    value={form.specialization}
                    onChange={(e) => set("specialization", e.target.value)}
                  >
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Verticale KOVELA associée (optionnel)"
                  hint="KOVELA démarre sur l'esthétique / plastique et se déploie ensuite sur d'autres segments de suivi."
                >
                  <select
                    className={inputCls}
                    value={form.vertical}
                    onChange={(e) => set("vertical", e.target.value)}
                  >
                    {VERTICALS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* Étape 2 — Lieux */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-[1.35rem] font-medium tracking-tight text-navy-900">Lieux d'intervention</h2>
              <p className="text-sm text-charcoal/60">Cliniques / établissements où vous opérez (jusqu'à 3).</p>
              {[0, 1, 2].map((i) => (
                <Field key={i} label={`Lieu ${i + 1}${i === 0 ? "" : " (optionnel)"}`}>
                  <input
                    className={inputCls}
                    value={form.locations[i] ?? ""}
                    onChange={(e) => setLocation(i, e.target.value)}
                    placeholder="ex : Clinique du Parc"
                  />
                </Field>
              ))}
            </div>
          )}

          {/* Étape 3 — Contacts cabinet autorisés */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-[1.35rem] font-medium tracking-tight text-navy-900">Contacts cabinet autorisés</h2>
              <p className="text-sm text-charcoal/60">
                Assistantes, secrétariat ou contacts de transmission autorisés à transmettre et
                modifier le planning opératoire du cabinet.
              </p>
              <div className="space-y-2">
                {k.assistantsFor(MY_SURGEON_ID).map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-navy-100 px-4 py-2.5">
                    <span className="text-sm text-navy-900">{a.name}</span>
                    <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">Autorisé</Badge>
                  </div>
                ))}
                {k.assistantsFor(MY_SURGEON_ID).length === 0 && (
                  <p className="text-xs text-charcoal/45">Aucun contact autorisé pour le moment.</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="Nom du contact (assistante, secrétariat…)"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                />
                <Button
                  variant="subtle"
                  disabled={!assistantName.trim()}
                  onClick={() => {
                    k.addAssistant(MY_SURGEON_ID, assistantName.trim());
                    setAssistantName("");
                  }}
                >
                  Ajouter
                </Button>
              </div>
              <p className="rounded-xl bg-bone/60 px-4 py-3 text-[12px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
                Le référentiel de suivi détaillé (durées par type d'intervention, fréquence des CR,
                préférences photo / audio / relances…) pourra être complété après activation du
                service depuis votre espace chirurgien.
              </p>
            </div>
          )}

          {/* Étape 4 — Documents de service */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-[1.35rem] font-medium tracking-tight text-navy-900">
                Documents de service
              </h2>
              <p className="text-[13.5px] leading-relaxed text-charcoal/65">
                Avant activation du service, le cabinet prend connaissance des documents KOVELA et
                confirme leur acceptation.
              </p>
              <p className="rounded-xl bg-bone/60 px-4 py-3 text-[12px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
                Cette étape permet de préparer la preuve d'acceptation qui devra être horodatée et
                versionnée en V1. Prototype : aucune valeur juridique définitive.
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {DOCS.map((d) => (
                  <div
                    key={d.key}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-navy-900/[0.06] transition-colors hover:ring-navy-900/[0.12]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium tracking-tight text-navy-900">
                        {d.title}
                      </p>
                      <p className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-charcoal/45">
                        Version {d.version}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {docsRead[d.key] ? (
                        <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">Lu</Badge>
                      ) : (
                        <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
                          À lire
                        </Badge>
                      )}
                      <Button variant="subtle" onClick={() => setOpenDoc(d.key)}>
                        {docsRead[d.key] ? "Relire" : "Lire"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-charcoal/45">
                Lecture jusqu'en bas requise pour chaque document avant acceptation.
              </p>

              <div className="rounded-xl bg-white p-5 ring-1 ring-navy-900/[0.06]">
                <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                  Acceptation
                </p>
                <div className="space-y-0.5">
                  {ACCEPTANCE_ITEMS.map((label, i) => (
                    <label
                      key={i}
                      className={`flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 text-[13px] leading-relaxed transition-colors ${
                        allDocsRead
                          ? "text-charcoal/80 hover:bg-bone/60"
                          : "text-charcoal/45"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-[3px] h-4 w-4 rounded border-navy-200 text-teal-600"
                        checked={acceptances[i]}
                        disabled={!allDocsRead}
                        onChange={(e) => {
                          const next = [...acceptances];
                          next[i] = e.target.checked;
                          setAcceptances(next);
                        }}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                {!allDocsRead && (
                  <p className="mt-3 text-[11px] text-amber-800/80">
                    Lire tous les documents pour activer l'acceptation.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary" disabled={!canValidateDocs} onClick={validateDocs}>
                  Valider les documents de service
                </Button>
                {docsValidatedAt && (
                  <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                    Documents validés — horodatage prototype :{" "}
                    {new Date(docsValidatedAt).toLocaleString("fr-FR")}
                  </Badge>
                )}
              </div>

              {docsValidatedAt && (
                <div className="rounded-xl bg-bone/60 px-4 py-3 text-[11.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
                  Chirurgien : {me.name} · Cabinet : {form.locations[0] ?? "—"} · Email contact :{" "}
                  {form.cabinetContact.email || "—"} · CGS v0.1 · Confidentialité v0.1 · DPA v0.1 ·
                  Annexe v0.1 · Règles v0.1.
                  <br />
                  <span className="text-charcoal/55">
                    En V1, cette acceptation devra être horodatée, versionnée et enregistrée dans
                    l'audit log.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Étape 5 — Facturation & prélèvement */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-display text-[1.35rem] font-medium tracking-tight text-navy-900">Facturation & prélèvement</h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-bone/60 p-5 ring-1 ring-navy-900/[0.04]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50">
                    Abonnement
                  </p>
                  <p className="mt-3 font-display text-[26px] font-medium tracking-tight text-navy-900">
                    {k.pricing.baseMonthly} € HT
                  </p>
                  <p className="mt-1 text-[11.5px] text-charcoal/55">
                    par mois · {k.pricing.includedPatients} patients activés
                    inclus — prélevé le 1er du mois
                  </p>
                </div>
                <div className="rounded-xl bg-bone/60 p-5 ring-1 ring-navy-900/[0.04]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50">
                    Variable
                  </p>
                  <p className="mt-3 font-display text-[26px] font-medium tracking-tight text-navy-900">
                    {k.pricing.perActivatedPatient} € HT
                  </p>
                  <p className="mt-1 text-[11.5px] text-charcoal/55">
                    par patient activé supplémentaire (au-delà des{" "}
                    {k.pricing.includedPatients} inclus) — prélevé le dernier
                    jour du mois
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-white px-5 py-4 text-[12.5px] leading-relaxed text-charcoal/70 ring-1 ring-navy-900/[0.06]">
                <p>
                  <span className="font-semibold text-navy-900">Patient activé</span> = onboarding
                  patient validé + suivi lancé.
                </p>
                <ul className="mt-2.5 space-y-1.5 pl-1">
                  {[
                    `L'abonnement mensuel de ${k.pricing.baseMonthly} € HT inclut ${k.pricing.includedPatients} patients activés et est prélevé le 1er de chaque mois.`,
                    `La part variable est calculée sur les patients activés au-delà des ${k.pricing.includedPatients} inclus.`,
                    "La part variable est prélevée le dernier jour de chaque mois.",
                    "Les prélèvements sont opérés via GoCardless (simulation — aucun paiement réel).",
                  ].map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="mt-2 h-[3px] w-[3px] shrink-0 rounded-full bg-charcoal/40" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-navy-depth p-6 text-white ring-1 ring-white/[0.06]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-100/55">
                      Mandat GoCardless (fictif)
                    </p>
                    <Badge className={`mt-2.5 ${mandateStyles[form.mandateStatus]}`}>
                      {mandateLabels[form.mandateStatus]}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => set("mandateStatus", "lien_envoye" as MandateStatus)}
                      className="rounded-lg bg-white/[0.06] px-3.5 py-2 text-[12px] font-medium tracking-tight text-white ring-1 ring-white/[0.1] transition-colors hover:bg-white/[0.1]"
                    >
                      Envoyer le lien GoCardless
                    </button>
                    <button
                      onClick={() => set("mandateStatus", "mandat_actif" as MandateStatus)}
                      className="rounded-lg bg-teal-500 px-3.5 py-2 text-[12px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-teal-600"
                    >
                      Simuler mandat actif
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-[10.5px] leading-relaxed text-navy-100/50">
                  Simulation — aucune vraie intégration GoCardless, aucune donnée bancaire, aucun
                  paiement réel.
                </p>
              </div>
            </div>
          )}

          {/* Étape 6 — Validation de la mise en place */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="font-display text-[1.35rem] font-medium tracking-tight text-navy-900">
                Validation de la mise en place
              </h2>
              <div className="rounded-xl bg-bone/60 px-5 py-4 text-[13.5px] leading-relaxed text-charcoal/75 ring-1 ring-navy-900/[0.04]">
                KOVELA assure la <span className="font-medium">coordination</span> et la{" "}
                <span className="font-medium">continuité post-opératoire</span> sous supervision
                humaine. KOVELA ne décide pas médicalement : toute décision relève du chirurgien.
              </div>
              <div className="rounded-xl bg-white p-5 ring-1 ring-navy-900/[0.06]">
                <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                  Récapitulatif
                </p>
                <dl className="grid gap-x-6 gap-y-2 text-[12.5px] sm:grid-cols-2">
                  {[
                    ["Chirurgien", me.name],
                    ["Spécialisation", form.specialization],
                    ["Verticale", form.vertical],
                    ["Lieux", form.locations.filter(Boolean).join(", ") || "—"],
                    [
                      "Contacts autorisés",
                      k.assistantsFor(MY_SURGEON_ID).map((a) => a.name).join(", ") || "—",
                    ],
                    [
                      "Documents de service",
                      docsValidatedAt
                        ? `validés (${new Date(docsValidatedAt).toLocaleDateString("fr-FR")})`
                        : "à valider",
                    ],
                    ["Mandat GoCardless", mandateLabels[form.mandateStatus]],
                  ].map(([label, value]) => (
                    <div key={label as string} className="flex justify-between gap-3 border-b border-navy-900/[0.04] pb-1.5 last:border-0">
                      <dt className="text-charcoal/55">{label}</dt>
                      <dd className="text-right font-medium tracking-tight text-navy-900">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="rounded-xl bg-bone/60 px-4 py-3 text-[11.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
                Après validation : le service cabinet est activé. Vous pourrez ensuite compléter le
                référentiel de suivi cabinet depuis votre espace chirurgien, puis transmettre votre
                planning opératoire.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-7 flex items-center justify-between border-t border-navy-900/[0.05] pt-6">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Retour
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 3 && !docsValidatedAt}
              >
                Continuer
              </Button>
            ) : (
              <Button variant="primary" onClick={finish}>
                Valider la mise en place du service
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Modal lecture document */}
      <Modal
        open={openDoc !== null}
        onClose={() => setOpenDoc(null)}
        title={
          openDoc
            ? `${DOCS.find((d) => d.key === openDoc)?.title} — ${DOCS.find((d) => d.key === openDoc)?.version}`
            : ""
        }
        wide
      >
        {openDoc && (
          <div className="space-y-4">
            <p className="rounded-xl bg-amber-50/60 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
              Document de démonstration — contenu placeholder. Aucune valeur juridique définitive ;
              à valider juridiquement avant la V1.
            </p>
            <div className="max-h-72 overflow-y-auto rounded-xl border border-navy-100 bg-navy-50/30 p-4 text-sm leading-relaxed text-charcoal/75">
              {DOCS.find((d) => d.key === openDoc)?.placeholder}
              <div className="mt-4 border-t border-navy-900/[0.06] pt-3 text-[11px] text-charcoal/45">
                — Fin du document {DOCS.find((d) => d.key === openDoc)?.version} —
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-charcoal/55">
                Lecture jusqu'en bas requise. Vous pourrez cocher l'acceptation après avoir marqué le
                document comme lu.
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setOpenDoc(null)}>
                  Fermer
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (openDoc) setDocsRead((prev) => ({ ...prev, [openDoc]: true }));
                    setOpenDoc(null);
                  }}
                >
                  Marquer comme lu
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Shell>
  );
}
