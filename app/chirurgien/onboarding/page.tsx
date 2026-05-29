"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      "Annexe détaillant les modalités opérationnelles du service KOVELA : supervision humaine, IA assistive interne, gating des comptes-rendus, escalades vers le cabinet, plages de traitement indicatives. Document de démonstration — version prototype v0.1.",
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

export default function ChirurgienOnboarding() {
  const k = useKovela();
  const router = useRouter();
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
        title="Mettre en place le service KOVELA pour votre cabinet"
        subtitle="Ce lien vous a été transmis après un échange avec l'équipe KOVELA. Il permet de préparer l'activation du service : informations cabinet, contacts autorisés, documents de service et prélèvement."
      />

      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-teal-50/50 px-4 py-3 text-xs leading-relaxed text-navy-900 ring-1 ring-teal-100">
          <Badge className="bg-teal-100 text-teal-800 ring-teal-200">
            Temps estimé : 5 à 7 minutes
          </Badge>
          <span className="text-charcoal/75">
            Ces informations permettent à l'équipe KOVELA de préparer le service avec votre cabinet.
            Elles restent modifiables ensuite depuis votre espace chirurgien. Le référentiel de suivi
            détaillé sera complété après activation.
          </span>
        </div>

        {/* Progression */}
        <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs">
          {STEPS.map((label, i) => (
            <span key={label} className="flex items-center gap-2">
              <span
                className={`flex h-6 items-center gap-1.5 rounded-full px-2.5 font-medium ${
                  i === step
                    ? "bg-navy-900 text-white"
                    : i < step
                    ? "bg-teal-50 text-teal-700 ring-1 ring-teal-100"
                    : "bg-navy-50 text-charcoal/55"
                }`}
              >
                {i < step ? "✓" : i + 1} {label}
              </span>
              {i < STEPS.length - 1 && <span className="text-charcoal/30">→</span>}
            </span>
          ))}
        </div>

        <Card className="p-6">
          {/* Étape 1 — Identité & spécialisation */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl text-navy-900">Identité du cabinet</h2>
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
              <h2 className="font-display text-xl text-navy-900">Lieux d'intervention</h2>
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
              <h2 className="font-display text-xl text-navy-900">Contacts cabinet autorisés</h2>
              <p className="text-sm text-charcoal/60">
                Assistantes, secrétariat ou contacts de transmission autorisés à transmettre et
                modifier le planning opératoire du cabinet.
              </p>
              <div className="space-y-2">
                {k.assistantsFor(MY_SURGEON_ID).map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-navy-100 px-4 py-2.5">
                    <span className="text-sm text-navy-900">{a.name}</span>
                    <Badge className="bg-teal-50 text-teal-700 ring-teal-100">Autorisé</Badge>
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
              <p className="rounded-xl bg-navy-50/60 p-3 text-[11px] leading-relaxed text-charcoal/65">
                Le référentiel de suivi détaillé (durées par type d'intervention, fréquence des CR,
                préférences photo / audio / relances…) pourra être complété après activation du
                service depuis votre espace chirurgien.
              </p>
            </div>
          )}

          {/* Étape 4 — Documents de service */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl text-navy-900">Documents de service</h2>
              <p className="text-sm text-charcoal/65">
                Avant activation du service, le cabinet prend connaissance des documents KOVELA et
                confirme leur acceptation.
              </p>
              <p className="rounded-xl bg-navy-50/60 p-3 text-[11px] leading-relaxed text-charcoal/65">
                Cette étape permet de préparer la preuve d'acceptation qui devra être horodatée et
                versionnée en V1. Prototype : aucune valeur juridique définitive.
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {DOCS.map((d) => (
                  <div
                    key={d.key}
                    className="flex items-center justify-between gap-3 rounded-xl border border-navy-100 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy-900">{d.title}</p>
                      <p className="text-[11px] text-charcoal/50">Version {d.version}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {docsRead[d.key] ? (
                        <Badge className="bg-teal-50 text-teal-700 ring-teal-100">Lu</Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-700 ring-amber-100">À lire</Badge>
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

              <div className="rounded-xl border border-navy-100 p-4">
                <p className="mb-2 text-xs font-medium text-navy-900">Acceptation</p>
                <div className="space-y-1.5">
                  {ACCEPTANCE_ITEMS.map((label, i) => (
                    <label
                      key={i}
                      className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-[13px] text-charcoal/80 hover:bg-navy-50/50"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-navy-200 text-teal-600"
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
                  <p className="mt-2 text-[11px] text-amber-700">
                    Lire tous les documents pour activer l'acceptation.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary" disabled={!canValidateDocs} onClick={validateDocs}>
                  Valider les documents de service
                </Button>
                {docsValidatedAt && (
                  <Badge className="bg-teal-50 text-teal-700 ring-teal-100">
                    Documents validés — horodatage prototype :{" "}
                    {new Date(docsValidatedAt).toLocaleString("fr-FR")}
                  </Badge>
                )}
              </div>

              {docsValidatedAt && (
                <div className="rounded-xl bg-navy-50/60 p-3 text-[11px] leading-relaxed text-charcoal/65">
                  Chirurgien : {me.name} · Cabinet : {form.locations[0] ?? "—"} · Email contact :{" "}
                  {form.cabinetContact.email || "—"} · CGS v0.1 · Confidentialité v0.1 · DPA v0.1 ·
                  Annexe v0.1 · Règles v0.1.
                  <br />
                  En V1, cette acceptation devra être horodatée, versionnée et enregistrée dans
                  l'audit log.
                </div>
              )}
            </div>
          )}

          {/* Étape 5 — Facturation & prélèvement */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl text-navy-900">Facturation & prélèvement</h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-navy-50/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-charcoal/50">Abonnement</p>
                  <p className="mt-1 font-display text-2xl text-navy-900">{k.pricing.baseMonthly} € HT</p>
                  <p className="text-xs text-charcoal/55">par mois — prélevé le 1er de chaque mois</p>
                </div>
                <div className="rounded-xl bg-navy-50/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-charcoal/50">Variable</p>
                  <p className="mt-1 font-display text-2xl text-navy-900">{k.pricing.perActivatedPatient} € HT</p>
                  <p className="text-xs text-charcoal/55">par patient activé — prélevé le dernier jour du mois</p>
                </div>
              </div>

              <div className="rounded-xl border border-navy-100 p-4 text-xs leading-relaxed text-charcoal/70">
                <p><span className="font-semibold text-navy-900">Patient activé</span> = onboarding patient validé + suivi lancé.</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>L'abonnement mensuel de {k.pricing.baseMonthly} € HT est prélevé le 1er de chaque mois.</li>
                  <li>La part variable est calculée selon le nombre de patients activés dans le mois.</li>
                  <li>La part variable est prélevée le dernier jour de chaque mois.</li>
                  <li>Les prélèvements sont opérés via GoCardless (simulation — aucun paiement réel).</li>
                </ul>
              </div>

              <div className="rounded-xl bg-navy-depth p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-navy-100/60">Mandat GoCardless (fictif)</p>
                    <Badge className={`mt-2 ${mandateStyles[form.mandateStatus]}`}>
                      {mandateLabels[form.mandateStatus]}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="subtle" onClick={() => set("mandateStatus", "lien_envoye" as MandateStatus)}>
                      Envoyer le lien GoCardless
                    </Button>
                    <Button variant="primary" onClick={() => set("mandateStatus", "mandat_actif" as MandateStatus)}>
                      Simuler mandat actif
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-navy-100/50">
                  Simulation — aucune vraie intégration GoCardless, aucune donnée bancaire, aucun paiement réel.
                </p>
              </div>
            </div>
          )}

          {/* Étape 6 — Validation de la mise en place */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl text-navy-900">Validation de la mise en place</h2>
              <div className="rounded-xl bg-navy-50/60 p-4 text-sm leading-relaxed text-charcoal/75">
                KOVELA assure la <span className="font-medium">coordination</span> et la{" "}
                <span className="font-medium">continuité post-opératoire</span> sous supervision humaine.
                KOVELA ne décide pas médicalement : toute décision relève du chirurgien.
              </div>
              <div className="rounded-xl border border-navy-100 p-4 text-sm">
                <p className="mb-2 font-medium text-navy-900">Récapitulatif</p>
                <ul className="space-y-1 text-xs text-charcoal/70">
                  <li>Chirurgien : {me.name}</li>
                  <li>Spécialisation : {form.specialization}</li>
                  <li>Verticale : {form.vertical}</li>
                  <li>Lieux : {form.locations.filter(Boolean).join(", ") || "—"}</li>
                  <li>
                    Contacts autorisés :{" "}
                    {k.assistantsFor(MY_SURGEON_ID).map((a) => a.name).join(", ") || "—"}
                  </li>
                  <li>
                    Documents de service :{" "}
                    {docsValidatedAt
                      ? `validés (${new Date(docsValidatedAt).toLocaleDateString("fr-FR")})`
                      : "à valider"}
                  </li>
                  <li>Mandat GoCardless : {mandateLabels[form.mandateStatus]}</li>
                </ul>
              </div>
              <p className="rounded-xl bg-navy-50/60 p-3 text-[11px] leading-relaxed text-charcoal/65">
                Après validation : le service cabinet est activé. Vous pourrez ensuite compléter le
                référentiel de suivi cabinet depuis votre espace chirurgien, puis transmettre votre
                planning opératoire.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between border-t border-navy-900/[0.06] pt-5">
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
