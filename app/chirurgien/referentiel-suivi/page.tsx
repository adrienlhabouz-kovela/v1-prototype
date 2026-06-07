"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, CardHeader, PageHeader } from "@/components/ui";
import { useKovela } from "@/lib/store";
import type { CabinetConfig, FollowType } from "@/lib/types";

const MY_SURGEON_ID = "s1";

const PROTOCOLS = ["J+5", "J+8", "J+12", "J+15", "Personnalisé"];
const CR_FREQUENCIES = [
  "CR fin de suivi",
  "CR hebdomadaire",
  "CR à la demande",
  "CR si transmission cabinet effectuée",
];
const CHANNELS = ["Email cabinet", "Interface KOVELA", "Contact cabinet référent", "Autre canal"];
const HOURS = [
  "Jours ouvrés — 9h à 18h (indicatif)",
  "7j/7 — plage indicative",
  "Plage personnalisée",
];

const FOLLOW_TYPES: { value: FollowType; label: string; desc: string }[] = [
  { value: "standard", label: "Standard", desc: "Suivi structuré + CR de fin de suivi." },
  {
    value: "renforce",
    label: "Renforcé",
    desc: "Suivi structuré + relances plus fréquentes + CR intermédiaire.",
  },
  {
    value: "premium",
    label: "Premium cabinet",
    desc: "Suivi structuré + CR plus détaillé + vigilance opérationnelle renforcée.",
  },
];

const inputCls =
  "w-full rounded-xl border border-navy-100 px-3 py-2 text-sm outline-none focus:border-teal-400";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-charcoal/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-charcoal/45">{hint}</span>}
    </label>
  );
}

export default function ReferentielSuiviPage() {
  const k = useKovela();
  const router = useRouter();
  const me = k.surgeon(MY_SURGEON_ID);

  const [form, setForm] = useState<CabinetConfig>(() => ({ ...(me?.config as CabinetConfig) }));

  if (!me) return null;

  const set = <K extends keyof CabinetConfig>(key: K, val: CabinetConfig[K]) =>
    setForm((f) => ({ ...f, [key]: val }));
  const setContact = (key: keyof CabinetConfig["cabinetContact"], val: string) =>
    setForm((f) => ({ ...f, cabinetContact: { ...f.cabinetContact, [key]: val } }));
  const setPref = (key: keyof CabinetConfig["patientPrefs"], val: boolean) =>
    setForm((f) => ({ ...f, patientPrefs: { ...f.patientPrefs, [key]: val } }));

  function save(complete: boolean) {
    k.saveCabinetConfig(MY_SURGEON_ID, form);
    if (complete) {
      k.markReferentielComplete(MY_SURGEON_ID);
    }
    router.push("/chirurgien");
  }

  const alreadyComplete = me.config.referentielComplete;

  return (
    <Shell>
      <PageHeader
        eyebrow={me.name}
        title="Référentiel de suivi cabinet"
        subtitle="Préférences de suivi par type d'intervention — informations utilisées par l'équipe KOVELA pour organiser le suivi avec votre cabinet."
      >
        <Link href="/chirurgien">
          <Button variant="ghost">Retour à l'espace chirurgien</Button>
        </Link>
      </PageHeader>

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-white px-5 py-4 text-[12.5px] leading-relaxed text-charcoal/70 shadow-soft ring-1 ring-navy-900/[0.05]">
          <Badge
            className={
              alreadyComplete
                ? "bg-teal-50/60 text-teal-700 ring-teal-100/70"
                : "bg-amber-50/50 text-amber-800 ring-amber-200/50"
            }
          >
            {alreadyComplete ? "Référentiel : complété" : "Référentiel : à compléter"}
          </Badge>
          <span className="flex-1 min-w-[260px]">
            Informations utilisées par l'équipe KOVELA pour organiser le suivi, modifiables à tout
            moment.
          </span>
        </div>

        <Card className="p-6 space-y-5">
          <h2 className="font-display text-[1.35rem] font-medium tracking-tight text-navy-900">Durées et fréquence</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Durée de suivi par défaut"
              hint="Sert à préparer le suivi opérationnel par défaut. Ajustable patient par patient."
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
            <span className="mb-2 block text-xs font-medium text-charcoal/60">
              Durées de suivi par type d'intervention
            </span>
            <div className="space-y-1.5">
              {Object.entries(form.interventionDurations).map(([type, dur]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className="flex-1 truncate text-sm text-navy-900">{type}</span>
                  <input
                    className="w-44 rounded-lg border border-navy-100 px-2.5 py-1.5 text-sm outline-none focus:border-teal-400"
                    value={dur}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        interventionDurations: {
                          ...f.interventionDurations,
                          [type]: e.target.value,
                        },
                      }))
                    }
                    placeholder="ex : J+12 / J+15"
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-charcoal/45">
              Préférences de fonctionnement déclarées par le cabinet, ajustables patient par
              patient.
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-5">
          <h2 className="font-display text-[1.35rem] font-medium tracking-tight text-navy-900">Typologie et organisation</h2>

          <div>
            <span className="mb-2 block text-xs font-medium text-charcoal/60">
              Typologie de suivi souhaitée
            </span>
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
                  <span className="mt-1 block text-[11px] leading-snug text-charcoal/55">
                    {t.desc}
                  </span>
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
              hint="Servent à organiser les flux opérationnels. Ne modifient pas les consignes d'urgence du patient."
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
            <p className="mb-2 text-xs font-medium text-charcoal/60">
              Contact de transmission cabinet
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className={inputCls}
                placeholder="Nom"
                value={form.cabinetContact.name}
                onChange={(e) => setContact("name", e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Rôle"
                value={form.cabinetContact.role}
                onChange={(e) => setContact("role", e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Email (fictif)"
                value={form.cabinetContact.email}
                onChange={(e) => setContact("email", e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Téléphone (fictif)"
                value={form.cabinetContact.phone}
                onChange={(e) => setContact("phone", e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display text-[1.35rem] font-medium tracking-tight text-navy-900">Préférences patient</h2>

          <div>
            <span className="mb-2 block text-xs font-medium text-charcoal/60">
              Préférences de suivi opérationnel
            </span>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["photo", "Autoriser l'ajout de photos"],
                  ["audio", "Autoriser l'ajout d'audios"],
                  ["relancesOnboarding", "Autoriser les relances d'onboarding"],
                  ["rappelSilencieux", "Autoriser le rappel patient silencieux"],
                ] as [keyof CabinetConfig["patientPrefs"], string][]
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 rounded-xl border border-navy-100 px-3 py-2 text-sm text-charcoal/75"
                >
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
        </Card>

        <Card className="p-6">
          <CardHeader
            title="Valider le référentiel"
            subtitle="Une fois validé, l'équipe KOVELA exploite ces préférences pour organiser le suivi."
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => save(false)}>
              Enregistrer sans marquer comme complété
            </Button>
            <Button variant="primary" onClick={() => save(true)}>
              Valider le référentiel de suivi
            </Button>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
