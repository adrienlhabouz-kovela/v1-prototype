import Link from "next/link";
import type { Metadata } from "next";
import { BrandMark, Wordmark } from "@/components/Brand";
import { LeadForm } from "./LeadForm";
import {
  LandingViewTracker,
  TrackedCtaLink,
} from "./LandingAnalytics";

// ---------------------------------------------------------------------------
// /chirurgiens-esthetiques — landing acquisition V3.1.
//
// Structure stricte toujours en 5 sections (les ajouts V3.1 s'insèrent
// DANS les sections existantes, jamais en nouvelles sections) :
//   1. Hero — promesse en 5 secondes + mockup cockpit produit juste en
//      dessous, dans la même zone visuelle.
//   2. Douleur cabinet — 5 douleurs concrètes.
//   3. Ce que KOVELA prend en charge — 7 blocs + mini-flow 5 étapes en
//      10 secondes + micro-explications CR factuel & avis Google.
//   4. Différenciation — 2 colonnes + phrase « Rien à implémenter / manager
//      / apprendre côté cabinet ».
//   5. CTA + formulaire — micro-bloc doctrine discret avant le bandeau.
//
// + Bloc social proof PRÉPARÉ mais DÉSACTIVÉ par défaut (cf. constante
//   SHOW_SOCIAL_PROOF). Aucun témoignage / logo / chiffre fictif n'est
//   affiché tant qu'un retour réel n'a pas été validé.
// + Tracking conversion prototype via LandingAnalytics.tsx.
//
// Page volontairement lisible en 60 secondes. Doctrine respectée
// (cf. docs/WORDING_DOCTRINE.md). Pas de tarif.
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title:
    "KOVELA — Suivi post-opératoire structuré pour chirurgiens esthétiques",
  description:
    "KOVELA prend le relais opérationnel sur le suivi post-op de vos patients, selon vos habitudes, sans recruter ni ajouter un logiciel à gérer.",
  robots: { index: true, follow: true },
};

const CTA_PRIMARY = "Demander un échange opérationnel de 20 min";
const CTA_SECONDARY = "Voir ce que KOVELA prend en charge";

const microReassurance = [
  "Service opéré",
  "Supervision humaine issue du terrain",
  "Assistance interne",
  "Sans décision médicale",
];

const pains = [
  "Photos et messages envoyés sans contexte",
  "Inquiétudes à J+1 : œdèmes, ecchymoses, douleurs, doutes",
  "Équipe cabinet sollicitée sur des sujets post-op sensibles",
  "Interruptions entre deux consultations",
  "Historique difficile à reconstituer quand il faut comprendre ce qui s'est passé",
];

// Ce que KOVELA prend en charge — 7 blocs, ordre par priorité métier.
const coverage = [
  "Suivi patient structuré",
  "Relances selon cadre défini",
  "Éléments déclarés documentés",
  "Transmissions cabinet factuelles",
  "CR factuel de fin de suivi",
  "Journal d'action",
  "Demande d'avis Google neutre en fin de parcours",
];

// Mini-flow « comment ça marche » — 5 étapes en 10 secondes.
const flow = [
  {
    n: "01",
    t: "Le cabinet transmet",
    d: "Consignes, actes, contacts utiles",
  },
  {
    n: "02",
    t: "Le patient active son suivi",
    d: "Lien sécurisé, informations confirmées",
  },
  {
    n: "03",
    t: "KOVELA suit et documente",
    d: "Échanges, relances, éléments déclarés",
  },
  {
    n: "04",
    t: "Le cabinet reçoit l'essentiel",
    d: "Transmissions cabinet + CR factuel",
  },
  {
    n: "05",
    t: "Avis Google neutre en fin de parcours",
    d: "Demande neutre, validée avec le cabinet",
  },
];

const isNot = [
  "Pas un chatbot patient",
  "Pas une IA médicale",
  "Pas un secrétariat classique",
  "Pas un service d'urgence",
];

const isThat = [
  "Un service opéré",
  "Une supervision humaine issue du terrain",
  "Un cadre validé avec le cabinet",
  "Des transmissions factuelles",
  "Une traçabilité opérationnelle",
];

// ---------------------------------------------------------------------------
// Preuve sociale — bloc PRÊT mais DÉSACTIVÉ tant qu'aucun témoignage
// chirurgien réel n'est validé. Aucun témoignage / chiffre / logo fictif
// n'est affiché en production.
//
// Pour activer une fois des retours réels validés :
//   1. Passer SHOW_SOCIAL_PROOF à true.
//   2. Remplir socialProofItems avec des entrées validées par le cabinet
//      concerné (autorisation écrite recommandée).
// ---------------------------------------------------------------------------

const SHOW_SOCIAL_PROOF = false;

type SocialProofItem = {
  type: "testimonial" | "pilot" | "feedback";
  surgeon?: string;
  cabinet?: string;
  city?: string;
  specialty?: string;
  quote?: string;
  metric?: string;
  status: "validated";
};

const socialProofItems: SocialProofItem[] = [
  // À remplir uniquement quand un retour terrain réel a été validé.
  // Exemple de structure cible :
  // {
  //   type: "testimonial",
  //   surgeon: "Dr. ...",
  //   cabinet: "Cabinet ...",
  //   city: "Paris",
  //   specialty: "Chirurgie esthétique",
  //   quote: "...",
  //   status: "validated",
  // },
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 font-display text-[1.85rem] font-medium leading-tight tracking-tight text-navy-900 sm:text-[2.1rem]">
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// Mockup produit — composition HTML/CSS d'un cockpit superviseur stylisé.
// Mirror visuel de l'interface réelle prototype (cf. /superviseur), sans
// rien inventer côté données. Wording strict, doctrine respectée.
// ---------------------------------------------------------------------------

function ProductMockup() {
  return (
    <section
      aria-label="Aperçu cockpit KOVELA"
      className="bg-bone px-5 pb-14 pt-2 sm:px-8 sm:pb-20 sm:pt-4"
    >
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl bg-navy-depth shadow-lift ring-1 ring-navy-900/15">
          {/* Top window bar */}
          <div className="flex items-center gap-1.5 border-b border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <p className="ml-3 truncate text-[9.5px] font-semibold uppercase tracking-[0.16em] text-navy-100/55">
              Cockpit superviseur · service actif 8h-20h · prototype
            </p>
          </div>

          {/* 3 colonnes — mirror visuel du workspace superviseur réel */}
          <div className="grid gap-px bg-white/[0.04] md:grid-cols-3">
            {/* Colonne 1 — File patients */}
            <div className="bg-navy-depth p-4">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                À traiter maintenant
              </p>
              <div className="mt-3 rounded-lg bg-white/[0.04] p-3 ring-1 ring-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-500/20 text-[10.5px] font-semibold tracking-tight text-teal-200 ring-1 ring-teal-400/30">
                    AD
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold tracking-tight text-white">
                      A.D.
                    </p>
                    <p className="text-[10px] tracking-tight text-navy-100/60">
                      J+1 · Rhinoplastie
                    </p>
                  </div>
                </div>
                <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2 py-0.5 text-[9.5px] font-medium tracking-tight text-amber-200 ring-1 ring-amber-400/30">
                  <span className="h-1 w-1 rounded-full bg-amber-400" />
                  À revoir selon référentiel
                </p>
              </div>
            </div>

            {/* Colonne 2 — Éléments déclarés / conversation */}
            <div className="bg-navy-depth p-4">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                Éléments déclarés
              </p>
              <div className="mt-3 space-y-2">
                <div className="rounded-lg bg-amber-500/[0.06] p-2.5 ring-1 ring-amber-400/20">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-200">
                    Message patient
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white">
                    Le patient déclare : œdème important + photo transmise.
                  </p>
                </div>
                <div className="rounded-lg bg-teal-500/[0.06] p-2.5 ring-1 ring-teal-400/20">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-teal-200">
                    Réponse KOVELA
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white">
                    Réponse patient préparée — à relire.
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne 3 — Actions cabinet */}
            <div className="bg-navy-depth p-4">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                Actions cabinet
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Transmission cabinet préparée",
                  "CR factuel en cours",
                  "Demande d'avis neutre prévue en fin de suivi",
                ].map((a) => (
                  <li
                    key={a}
                    className="flex items-start gap-2 rounded-md bg-white/[0.03] p-2 ring-1 ring-white/[0.06]"
                  >
                    <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-teal-500/25 text-[8.5px] font-bold text-teal-200 ring-1 ring-teal-400/30">
                      ✓
                    </span>
                    <span className="text-[10.5px] leading-relaxed tracking-tight text-white">
                      {a}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10.5px] tracking-tight text-charcoal/55">
          Aperçu cockpit — interface prototype superviseur KOVELA.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SocialProof — bloc préparé, désactivé tant que SHOW_SOCIAL_PROOF=false ou
// que socialProofItems est vide. Rend null par défaut. Aucune fausse preuve
// affichée.
// ---------------------------------------------------------------------------

function SocialProof() {
  if (!SHOW_SOCIAL_PROOF) return null;
  if (socialProofItems.length === 0) return null;

  return (
    <section className="border-t border-navy-900/[0.05] bg-bone/30 px-5 py-12 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-teal-700">
          Retours terrain
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {socialProofItems.map((item, i) => (
            <div
              key={`${item.type}-${i}`}
              className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-900/[0.05]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                {item.type === "testimonial"
                  ? "Témoignage"
                  : item.type === "pilot"
                  ? "Cabinet pilote"
                  : "Retour terrain"}
                <span className="text-charcoal/45"> · Validé</span>
              </p>
              {item.quote && (
                <p className="mt-3 text-[13px] italic leading-relaxed tracking-tight text-navy-900">
                  « {item.quote} »
                </p>
              )}
              <p className="mt-3 text-[11.5px] tracking-tight text-charcoal/65">
                {item.surgeon ?? item.cabinet}
                {item.specialty && <span> · {item.specialty}</span>}
                {item.city && <span> · {item.city}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChirurgiensEsthetiquesLanding() {
  return (
    <div className="min-h-screen bg-bone">
      {/* Tracking conversion — composant invisible, tracke landing_view. */}
      <LandingViewTracker />

      {/* Top bar */}
      <header className="border-b border-navy-900/[0.05] bg-bone/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Wordmark />
          </Link>
          <TrackedCtaLink
            href="#contact"
            eventName="hero_cta_click"
            extraPayload={{ position: "top_bar" }}
            className="whitespace-nowrap rounded-md bg-navy-900 px-3.5 py-2 text-[11.5px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800 sm:px-4 sm:text-[12px]"
          >
            <span className="sm:hidden">Échange 20 min</span>
            <span className="hidden sm:inline">{CTA_PRIMARY}</span>
          </TrackedCtaLink>
        </div>
      </header>

      {/* ============================================================
          1. HERO — promesse en 5 secondes
          ============================================================ */}
      <section className="bg-bone px-5 pb-8 pt-14 sm:px-8 sm:pb-10 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center">
            <BrandMark />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700">
            Pour chirurgiens esthétiques libéraux
          </p>
          <h1 className="mt-4 font-display text-[2.3rem] font-medium leading-[1.05] tracking-tight text-navy-900 sm:text-[2.9rem]">
            Votre post-op déborde sur votre cabinet.
            <br />
            <span className="text-teal-700">KOVELA prend le relais.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed tracking-tight text-charcoal/75 sm:text-[16px]">
            Messages, photos, appels, inquiétudes à J+1, relances, historique à
            reconstituer : KOVELA structure le suivi post-op de vos patients selon vos
            habitudes,{" "}
            <span className="font-semibold text-navy-900">
              sans recruter ni ajouter un logiciel à gérer
            </span>
            .
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[14px] font-medium tracking-tight text-navy-900">
            Votre cabinet transmet.{" "}
            <span className="text-teal-700">KOVELA prend le quotidien.</span>
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <TrackedCtaLink
              href="#contact"
              eventName="hero_cta_click"
              extraPayload={{ position: "hero_primary" }}
              className="rounded-xl bg-navy-900 px-5 py-3 text-[13.5px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
            >
              {CTA_PRIMARY}
            </TrackedCtaLink>
            <TrackedCtaLink
              href="#prise-en-charge"
              eventName="secondary_cta_click"
              extraPayload={{ position: "hero_secondary" }}
              className="rounded-xl bg-white px-5 py-3 text-[13.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-bone"
            >
              {CTA_SECONDARY}
            </TrackedCtaLink>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] tracking-tight text-charcoal/55">
            {microReassurance.map((m, i) => (
              <span key={m} className="flex items-center gap-3">
                {i > 0 && <span className="text-charcoal/25">·</span>}
                <span>{m}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mockup cockpit — extension visuelle du hero, juste en dessous. */}
      <ProductMockup />

      {/* SOCIAL PROOF — bloc préparé, désactivé tant qu'aucune preuve
          réelle validée. Rend null par défaut. */}
      <SocialProof />

      {/* ============================================================
          2. DOULEUR CABINET — courte et concrète
          ============================================================ */}
      <section className="border-t border-navy-900/[0.05] bg-white px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Constat cabinet</SectionEyebrow>
            <SectionTitle>
              Ce qui fatigue votre cabinet n&apos;est pas l&apos;intervention.
              C&apos;est l&apos;après.
            </SectionTitle>
            <p className="mt-4 text-[14.5px] leading-relaxed tracking-tight text-charcoal/75">
              Le post-op crée une charge diffuse : rarement simple, souvent
              chronophage, et difficile à tracer proprement.
            </p>
          </div>

          <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {pains.map((p) => (
              <div
                key={p}
                className="rounded-xl border border-navy-900/[0.06] bg-bone/40 px-4 py-2.5"
              >
                <p className="flex items-start gap-2.5 text-[13px] leading-relaxed tracking-tight text-navy-900">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/80" />
                  {p}
                </p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center font-display text-[1.15rem] italic leading-relaxed tracking-tight text-navy-900">
            « Le sujet n&apos;est pas de répondre plus.
            <br />
            C&apos;est de structurer mieux. »
          </p>
        </div>
      </section>

      {/* ============================================================
          3. CE QUE KOVELA PREND EN CHARGE — solution + bénéfices + mini-flow
          ============================================================ */}
      <section
        id="prise-en-charge"
        className="border-t border-navy-900/[0.05] bg-bone px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Prise en charge</SectionEyebrow>
            <SectionTitle>KOVELA prend le relais opérationnel.</SectionTitle>
            <p className="mt-5 text-[14.5px] leading-relaxed tracking-tight text-charcoal/75">
              Vous nous partagez vos consignes post-op habituelles, vos actes
              concernés et vos contacts utiles. KOVELA structure le cadre, suit les
              échanges, documente les éléments déclarés, prépare les transmissions
              cabinet et trace les actions.
            </p>
          </div>

          <div className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {coverage.map((b) => (
              <div
                key={b}
                className="rounded-xl bg-white px-4 py-3.5 shadow-soft ring-1 ring-navy-900/[0.05]"
              >
                <p className="flex items-start gap-2.5 text-[13px] font-medium leading-relaxed tracking-tight text-navy-900">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  {b}
                </p>
              </div>
            ))}
          </div>

          {/* Mini-flow 5 étapes en 10 secondes — compact, horizontal sur
              desktop, 2 colonnes sur tablette, empilé sur mobile. */}
          <div className="mt-10 sm:mt-12">
            <p className="mb-4 text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
              Comment ça marche · 5 étapes
            </p>
            <ol className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
              {flow.map((s) => (
                <li
                  key={s.n}
                  className="rounded-xl bg-white px-3.5 py-3 shadow-soft ring-1 ring-navy-900/[0.05]"
                >
                  <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-teal-700">
                    {s.n}
                  </span>
                  <p className="mt-1.5 text-[12px] font-semibold leading-snug tracking-tight text-navy-900">
                    {s.t}
                  </p>
                  <p className="mt-1 text-[10.5px] leading-relaxed tracking-tight text-charcoal/60">
                    {s.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Micro-explications doctrinales, deux lignes courtes alignées. */}
          <div className="mx-auto mt-8 max-w-3xl space-y-2 text-center">
            <p className="text-[11.5px] leading-relaxed tracking-tight text-charcoal/65">
              <span className="font-semibold text-navy-900">CR factuel</span>{" "}
              <span className="text-charcoal/35">·</span> synthèse courte des éléments
              déclarés, actions tracées, relances et transmissions cabinet, sans
              interprétation médicale.
            </p>
            <p className="text-[11.5px] leading-relaxed tracking-tight text-charcoal/65">
              <span className="font-semibold text-navy-900">Demande d&apos;avis Google</span>{" "}
              <span className="text-charcoal/35">·</span> en fin de suivi, KOVELA peut
              envoyer une demande d&apos;avis Google neutre, validée avec le cabinet,
              sans incitation, sans filtrage et sans promesse d&apos;avis positif.
            </p>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-center font-display text-[1.4rem] font-medium leading-tight tracking-tight text-navy-900">
            Vous gardez la main.{" "}
            <span className="text-teal-700">KOVELA gère le quotidien.</span>
          </p>
        </div>
      </section>

      {/* ============================================================
          4. DIFFÉRENCIATION — compacte
          ============================================================ */}
      <section className="border-t border-navy-900/[0.05] bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Différenciation</SectionEyebrow>
            <SectionTitle>Ce n&apos;est pas un logiciel de plus.</SectionTitle>
            <p className="mx-auto mt-5 max-w-2xl text-[14.5px] font-medium leading-relaxed tracking-tight text-navy-900">
              Rien à installer. Rien à manager.{" "}
              <span className="text-teal-700">Rien à apprendre côté cabinet.</span>
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-bone/40 p-6 ring-1 ring-navy-900/[0.05]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                Ce que KOVELA n&apos;est pas
              </p>
              <ul className="mt-4 space-y-2.5">
                {isNot.map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13.5px] leading-relaxed tracking-tight text-charcoal/65"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal/30" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-navy-depth p-6 text-white ring-1 ring-navy-900/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">
                Ce que KOVELA est
              </p>
              <ul className="mt-4 space-y-2.5">
                {isThat.map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13.5px] leading-relaxed tracking-tight text-white"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center font-display text-[1.15rem] italic leading-relaxed tracking-tight text-navy-900">
            Le patient ne retient pas seulement le geste.
            <br />
            Il retient aussi la façon dont il a été accompagné après.
          </p>
        </div>
      </section>

      {/* ============================================================
          5. CTA + FORMULAIRE — précédé d'un micro-bloc doctrine discret
          ============================================================ */}
      <section
        id="contact"
        className="border-t border-navy-900/[0.06] bg-navy-depth px-5 py-16 text-white sm:px-8 sm:py-20"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300">
              Échange opérationnel
            </p>
            <h2 className="mt-3 font-display text-[2rem] font-medium leading-tight tracking-tight text-white sm:text-[2.4rem]">
              Structurer votre post-op sans recruter.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed tracking-tight text-navy-100/80">
              En 20 minutes, nous vérifions si KOVELA est adapté à votre volume,
              votre organisation et vos habitudes de suivi.
            </p>

            {/* Micro-bloc doctrine plus discret — police plus petite, fond
                moins contrasté. La mention prototype est déplacée vers le
                footer pour ne pas concurrencer le CTA. */}
            <p className="mt-6 text-[10.5px] leading-relaxed tracking-tight text-navy-100/50">
              KOVELA ne remplace pas le chirurgien, ne pose pas de diagnostic, ne
              prescrit pas et ne prend aucune décision médicale. En cas de situation
              urgente ou de doute important, le patient doit contacter le 15 / 112,
              les urgences de la clinique ou suivre les consignes remises par son
              chirurgien.
            </p>

            <p className="mt-5 text-[11px] tracking-tight text-navy-100/50">
              Vous pouvez aussi écrire directement à{" "}
              <a
                href="mailto:contact@kovela.care"
                className="font-medium text-teal-300 hover:text-teal-200"
              >
                contact@kovela.care
              </a>
              .
            </p>
          </div>

          <div>
            <LeadForm ctaLabel={CTA_PRIMARY} />
          </div>
        </div>
      </section>

      {/* Footer minimal — accueille la mention prototype RGPD/HDS pour
          la sortir du bandeau CTA sans la cacher. */}
      <footer className="border-t border-navy-900/10 bg-navy-depth px-5 py-6 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <Wordmark light />
          <p className="text-center text-[10.5px] leading-relaxed tracking-tight text-navy-100/45 sm:text-left">
            Prototype de présentation — canaux et architecture de production à valider
            en V1 selon le cadre RGPD / HDS.
          </p>
          <Link
            href="/"
            className="shrink-0 text-[11.5px] font-medium tracking-tight text-teal-300 hover:text-teal-200"
          >
            Landing institutionnelle →
          </Link>
        </div>
      </footer>
    </div>
  );
}
