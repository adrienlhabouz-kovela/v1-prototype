"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// ---------------------------------------------------------------------------
// LeadForm — formulaire d'acquisition chirurgiens esthétiques.
//
// Objectif : capturer un lead qualifié avec structure compatible CRM /
// RevOps (UTM + segment + meta). Pas de backend branché : la soumission
// affiche un état de succès et logge en console côté prototype. La
// structure du lead est prête pour intégration HubSpot / Pipedrive /
// Salesforce / API maison en V1.
// ---------------------------------------------------------------------------

type LeadFormFields = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  specialty: string;
  monthlyVolume: string;
  message: string;
};

const INITIAL_FIELDS: LeadFormFields = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  specialty: "Chirurgie esthétique",
  monthlyVolume: "",
  message: "",
};

const VOLUME_OPTIONS = [
  { value: "", label: "Sélectionner…" },
  { value: "<10", label: "Moins de 10 / mois" },
  { value: "10-25", label: "10 à 25 / mois" },
  { value: "25-50", label: "25 à 50 / mois" },
  { value: "50+", label: "Plus de 50 / mois" },
];

const SPECIALTY_OPTIONS = [
  "Chirurgie esthétique",
  "Chirurgie plastique reconstructrice",
  "Médecine esthétique opératoire",
  "Autre activité opératoire régulière",
];

function LeadFormInner({ ctaLabel }: { ctaLabel: string }) {
  const params = useSearchParams();
  const [fields, setFields] = useState<LeadFormFields>(INITIAL_FIELDS);
  const [submitted, setSubmitted] = useState(false);

  // Capture des UTM + métadonnées RevOps au montage. Champs cachés
  // persistés dans l'état pour être envoyés au backend en V1.
  const [meta, setMeta] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    landing_version: "chirurgiens-esthetiques-v1",
    lead_segment: "chirurgien_esthetique",
    route: "/chirurgiens-esthetiques",
  });

  useEffect(() => {
    if (!params) return;
    setMeta((m) => ({
      ...m,
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      utm_content: params.get("utm_content") ?? "",
      utm_term: params.get("utm_term") ?? "",
    }));
  }, [params]);

  function update<K extends keyof LeadFormFields>(key: K, value: LeadFormFields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const lead = {
      ...fields,
      ...meta,
      submitted_at: new Date().toISOString(),
      status: "new_lead",
    };
    // Prototype : aucun backend. La structure est prête pour intégration
    // CRM en V1 (HubSpot / Pipedrive / Salesforce / API maison).
    console.log("[KOVELA — lead acquisition chirurgien]", lead);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-lift ring-1 ring-teal-100/60">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-[15px] font-bold text-white">
            ✓
          </span>
          <h3 className="font-display text-[20px] font-medium tracking-tight text-navy-900">
            Demande reçue
          </h3>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-charcoal/75">
          Merci. Un membre de l&apos;équipe KOVELA revient vers vous sous 48 heures
          ouvrées pour confirmer un créneau d&apos;échange court (20 minutes).
        </p>
        <p className="mt-3 rounded-lg bg-bone/60 px-4 py-3 text-[12.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
          Si votre demande est urgente, écrivez directement à{" "}
          <a
            href="mailto:contact@kovela.care"
            className="font-medium text-teal-700 hover:text-teal-800"
          >
            contact@kovela.care
          </a>
          .
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-navy-900/[0.1] bg-white px-3.5 py-2.5 text-[14px] tracking-tight text-navy-900 placeholder:text-charcoal/40 outline-none transition-colors focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/10";
  const labelCls =
    "block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/60 mb-1.5";

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-lift ring-1 ring-navy-900/[0.06] sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className={labelCls}>Nom complet</span>
          <input
            required
            type="text"
            value={fields.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            autoComplete="name"
            className={inputCls}
            placeholder="Dr. Camille Aragon"
          />
        </label>
        <label>
          <span className={labelCls}>Email professionnel</span>
          <input
            required
            type="email"
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
            className={inputCls}
            placeholder="camille@cabinet-aragon.fr"
          />
        </label>
        <label>
          <span className={labelCls}>Téléphone</span>
          <input
            required
            type="tel"
            value={fields.phone}
            onChange={(e) => update("phone", e.target.value)}
            autoComplete="tel"
            className={inputCls}
            placeholder="06 ··"
          />
        </label>
        <label>
          <span className={labelCls}>Ville</span>
          <input
            required
            type="text"
            value={fields.city}
            onChange={(e) => update("city", e.target.value)}
            autoComplete="address-level2"
            className={inputCls}
            placeholder="Paris, Lyon, Bordeaux…"
          />
        </label>
        <label>
          <span className={labelCls}>Spécialité</span>
          <select
            value={fields.specialty}
            onChange={(e) => update("specialty", e.target.value)}
            className={inputCls}
          >
            {SPECIALTY_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelCls}>Interventions / mois</span>
          <select
            required
            value={fields.monthlyVolume}
            onChange={(e) => update("monthlyVolume", e.target.value)}
            className={inputCls}
          >
            {VOLUME_OPTIONS.map((v) => (
              <option key={v.value} value={v.value} disabled={v.value === ""}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>Message (optionnel)</span>
        <textarea
          value={fields.message}
          onChange={(e) => update("message", e.target.value)}
          rows={3}
          className={`${inputCls} resize-none`}
          placeholder="Quelques mots sur votre organisation actuelle, vos interventions principales…"
        />
      </label>

      <button
        type="submit"
        className="w-full rounded-xl bg-navy-900 px-5 py-3.5 text-[14px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
      >
        {ctaLabel}
      </button>

      <p className="text-center text-[11.5px] font-medium tracking-tight text-navy-900">
        Pour vérifier le volume, l&apos;organisation actuelle et le cadre possible.
      </p>

      <p className="text-center text-[10.5px] leading-relaxed tracking-tight text-charcoal/55">
        Réservé aux chirurgiens libéraux et cabinets avec activité opératoire régulière.
        Réponse de l&apos;équipe sous 48 h ouvrées. Aucune donnée patient n&apos;est demandée
        ici.
      </p>
    </form>
  );
}

export function LeadForm({ ctaLabel }: { ctaLabel: string }) {
  // useSearchParams nécessite une Suspense boundary en App Router.
  // Fallback : skeleton invisible (mêmes dimensions que le formulaire)
  // pour éviter l'apparition fugace d'un texte « Chargement… » avant
  // hydratation. L'utilisateur voit directement le formulaire propre.
  return (
    <Suspense
      fallback={
        <div
          aria-hidden
          className="min-h-[520px] rounded-2xl bg-white shadow-lift ring-1 ring-navy-900/[0.06]"
        />
      }
    >
      <LeadFormInner ctaLabel={ctaLabel} />
    </Suspense>
  );
}
