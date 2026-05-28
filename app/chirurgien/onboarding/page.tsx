"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { useKovela } from "@/lib/store";
import { mandateLabels, mandateStyles } from "@/lib/format";
import type { CabinetConfig, FollowType, MandateStatus } from "@/lib/types";

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

const PROTOCOLS = ["J+5", "J+8", "J+12", "J+15", "Personnalisé"];
const CR_FREQUENCIES = [
  "CR fin de suivi",
  "CR hebdomadaire",
  "CR à la demande",
  "CR si escalade transmise",
];
const CHANNELS = ["Email cabinet", "Interface KOVELA", "Contact cabinet référent", "Autre canal"];
const HOURS = ["Jours ouvrés — 9h à 18h (indicatif)", "7j/7 — plage indicative", "Plage personnalisée"];

const FOLLOW_TYPES: { value: FollowType; label: string; desc: string }[] = [
  { value: "standard", label: "Standard", desc: "Suivi structuré + CR de fin de suivi." },
  { value: "renforce", label: "Renforcé", desc: "Suivi structuré + relances plus fréquentes + CR intermédiaire." },
  { value: "premium", label: "Premium cabinet", desc: "Suivi structuré + CR plus détaillé + vigilance opérationnelle renforcée." },
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

const STEPS = ["Identité", "Lieux", "Préférences de suivi", "Assistantes", "Facturation", "Validation"];

export default function ChirurgienOnboarding() {
  const k = useKovela();
  const router = useRouter();
  const me = k.surgeon(MY_SURGEON_ID);

  const [step, setStep] = useState(0);
  const [assistantName, setAssistantName] = useState("");
  const [form, setForm] = useState<CabinetConfig>(() => ({ ...(me?.config as CabinetConfig) }));

  if (!me) return null;

  const set = <K extends keyof CabinetConfig>(key: K, val: CabinetConfig[K]) =>
    setForm((f) => ({ ...f, [key]: val }));
  const setContact = (key: keyof CabinetConfig["cabinetContact"], val: string) =>
    setForm((f) => ({ ...f, cabinetContact: { ...f.cabinetContact, [key]: val } }));
  const setPref = (key: keyof CabinetConfig["patientPrefs"], val: boolean) =>
    setForm((f) => ({ ...f, patientPrefs: { ...f.patientPrefs, [key]: val } }));
  const setLocation = (i: number, val: string) =>
    setForm((f) => {
      const locations = [...f.locations];
      locations[i] = val;
      return { ...f, locations };
    });

  function finish() {
    k.saveCabinetConfig(MY_SURGEON_ID, form);
    router.push("/chirurgien/planning");
  }

  return (
    <Shell>
      <PageHeader
        eyebrow="Mise en place cabinet"
        title="Mise en place du service KOVELA"
        subtitle="L'équipe KOVELA met en place le service pour votre cabinet. Précisez vos préférences de fonctionnement avant l'import du planning opératoire."
      />

      <div className="mx-auto max-w-3xl">
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

          {/* Étape 3 — Préférences de suivi */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl text-navy-900">Préférences de suivi</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Durée de suivi par défaut"
                  hint="Cette durée sert à préparer le suivi opérationnel par défaut. Elle pourra être ajustée patient par patient."
                >
                  <select
                    className={inputCls}
                    value={form.defaultProtocol}
                    onChange={(e) => set("defaultProtocol", e.target.value)}
                  >
                    {[form.defaultProtocol, ...PROTOCOLS]
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field label="Fréquence des comptes-rendus">
                  <select
                    className={inputCls}
                    value={form.crFrequency}
                    onChange={(e) => set("crFrequency", e.target.value)}
                  >
                    {[form.crFrequency, ...CR_FREQUENCIES]
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </Field>
              </div>

              <div>
                <span className="mb-2 block text-xs font-medium text-charcoal/60">Typologie de suivi souhaitée</span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {FOLLOW_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set("followType", t.value)}
                      className={`rounded-xl border p-3 text-left transition-colors ${
                        form.followType === t.value
                          ? "border-teal-300 bg-teal-50/50"
                          : "border-navy-100 hover:bg-navy-50/50"
                      }`}
                    >
                      <span className="text-sm font-medium text-navy-900">{t.label}</span>
                      <span className="mt-1 block text-[11px] leading-snug text-charcoal/55">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Canal de transmission cabinet">
                  <select
                    className={inputCls}
                    value={form.transmissionChannel}
                    onChange={(e) => set("transmissionChannel", e.target.value)}
                  >
                    {[form.transmissionChannel, ...CHANNELS]
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field
                  label="Horaires de traitement souhaités"
                  hint="Les horaires servent à organiser les flux opérationnels. Ils ne modifient pas les consignes d'urgence du patient."
                >
                  <select
                    className={inputCls}
                    value={form.workingHours}
                    onChange={(e) => set("workingHours", e.target.value)}
                  >
                    {[form.workingHours, ...HOURS]
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                  </select>
                </Field>
              </div>

              <div className="rounded-xl bg-navy-50/50 p-4">
                <p className="mb-2 text-xs font-medium text-charcoal/60">Contact de transmission cabinet</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className={inputCls} placeholder="Nom" value={form.cabinetContact.name} onChange={(e) => setContact("name", e.target.value)} />
                  <input className={inputCls} placeholder="Rôle" value={form.cabinetContact.role} onChange={(e) => setContact("role", e.target.value)} />
                  <input className={inputCls} placeholder="Email (fictif)" value={form.cabinetContact.email} onChange={(e) => setContact("email", e.target.value)} />
                  <input className={inputCls} placeholder="Téléphone (fictif)" value={form.cabinetContact.phone} onChange={(e) => setContact("phone", e.target.value)} />
                </div>
              </div>

              <div>
                <span className="mb-2 block text-xs font-medium text-charcoal/60">Préférences de suivi opérationnel</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {([
                    ["photo", "Autoriser l'ajout de photos"],
                    ["audio", "Autoriser l'ajout d'audios"],
                    ["relancesOnboarding", "Autoriser les relances d'onboarding"],
                    ["rappelSilencieux", "Autoriser le rappel patient silencieux"],
                  ] as [keyof CabinetConfig["patientPrefs"], string][]).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 rounded-xl border border-navy-100 px-3 py-2 text-sm text-charcoal/75">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-navy-200 text-teal-600"
                        checked={form.patientPrefs[key]}
                        onChange={(e) => setPref(key, e.target.checked)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <Field label="Message d'accueil personnalisé du cabinet (non médical)">
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={3}
                  value={form.welcomeMessage}
                  onChange={(e) => set("welcomeMessage", e.target.value)}
                />
              </Field>
            </div>
          )}

          {/* Étape 4 — Assistantes */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl text-navy-900">Assistantes / secrétariat autorisés</h2>
              <p className="text-sm text-charcoal/60">
                Les assistantes autorisées peuvent déposer et modifier le planning opératoire du cabinet.
              </p>
              <div className="space-y-2">
                {k.assistantsFor(MY_SURGEON_ID).map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-navy-100 px-4 py-2.5">
                    <span className="text-sm text-navy-900">{a.name}</span>
                    <Badge className="bg-teal-50 text-teal-700 ring-teal-100">Autorisée</Badge>
                  </div>
                ))}
                {k.assistantsFor(MY_SURGEON_ID).length === 0 && (
                  <p className="text-xs text-charcoal/45">Aucune assistante pour le moment.</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="Nom de l'assistante"
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
                  Inviter
                </Button>
              </div>
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

          {/* Étape 6 — Validation */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl text-navy-900">Validation du fonctionnement KOVELA</h2>
              <div className="rounded-xl bg-navy-50/60 p-4 text-sm leading-relaxed text-charcoal/75">
                KOVELA assure la <span className="font-medium">coordination</span> et la{" "}
                <span className="font-medium">continuité post-opératoire</span> sous supervision humaine.
                KOVELA ne décide pas médicalement : toute décision relève du chirurgien.
              </div>
              <div className="rounded-xl border border-navy-100 p-4 text-sm">
                <p className="mb-2 font-medium text-navy-900">Récapitulatif</p>
                <ul className="space-y-1 text-xs text-charcoal/70">
                  <li>Spécialisation : {form.specialization}</li>
                  <li>Verticale : {form.vertical}</li>
                  <li>Lieux : {form.locations.filter(Boolean).join(", ") || "—"}</li>
                  <li>Durée de suivi par défaut : {form.defaultProtocol}</li>
                  <li>Typologie : {FOLLOW_TYPES.find((t) => t.value === form.followType)?.label}</li>
                  <li>Fréquence CR : {form.crFrequency}</li>
                  <li>Assistantes : {k.assistantsFor(MY_SURGEON_ID).map((a) => a.name).join(", ") || "—"}</li>
                  <li>Mandat GoCardless : {mandateLabels[form.mandateStatus]}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between border-t border-navy-900/[0.06] pt-5">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Retour
            </Button>
            {step < STEPS.length - 1 ? (
              <Button variant="primary" onClick={() => setStep((s) => s + 1)}>
                Continuer
              </Button>
            ) : (
              <Button variant="primary" onClick={finish}>
                Enregistrer et accéder au planning opératoire
              </Button>
            )}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
