import Link from "next/link";
import type { Metadata } from "next";
import { BrandMark, Wordmark } from "@/components/Brand";
import { LeadForm } from "./LeadForm";

// ---------------------------------------------------------------------------
// /chirurgiens-esthetiques — landing courte d'acquisition dédiée chirurgiens
// esthétiques libéraux.
//
// Cette page n'est PAS la landing principale (qui reste sur /).
// Objectif unique : obtenir une demande d'échange / démo qualifiée.
// Pas de tarif affiché ici. Wording strict (cf. docs/WORDING_DOCTRINE.md).
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title:
    "KOVELA — Suivi post-opératoire structuré pour chirurgiens esthétiques",
  description:
    "KOVELA prend le relais opérationnel du post-opératoire de vos patients selon votre référentiel cabinet, sans recrutement ni outil à gérer.",
  robots: { index: true, follow: true },
};

const CTA_PRIMARY = "Voir si KOVELA est adapté à votre cabinet";
const CTA_SECONDARY = "Comprendre le fonctionnement";

const microReassurance = [
  "Service opéré",
  "Supervision issue du terrain",
  "IA interne assistive",
  "Sans décision médicale",
];

const pains = [
  "Messages post-op non filtrés",
  "Équipe cabinet sollicitée sur des sujets sensibles",
  "Patients anxieux dès les premiers jours",
  "Peu de traçabilité exploitable",
  "Chirurgien sollicité avec du bruit, pas toujours avec du contexte",
  "Expérience patient fragilisée après un acte pourtant réussi",
];

const solutionBenefits = [
  "Suivi patient structuré",
  "Référentiel cabinet actif",
  "Relances selon cadre défini",
  "Transmissions cabinet factuelles",
  "CR factuel en fin de suivi",
  "Journal d'action",
  "Aucune ressource à recruter",
];

const steps = [
  {
    n: "01",
    t: "Vous validez le cadre",
    d: "Actes concernés, durée du suivi, consignes, référentiel cabinet, contacts utiles.",
  },
  {
    n: "02",
    t: "Le patient active son suivi",
    d: "Il reçoit un lien sécurisé pour comprendre le dispositif, confirmer ses informations et activer son suivi.",
  },
  {
    n: "03",
    t: "KOVELA suit au quotidien",
    d: "Les échanges sont traités par une supervision issue du terrain, avec IA interne assistive pour structurer les éléments.",
  },
  {
    n: "04",
    t: "Vous recevez l'essentiel",
    d: "Transmissions cabinet si nécessaire, journal d'action et CR factuel exploitable.",
  },
];

const concreteBenefits = [
  "Moins de sollicitations post-op non structurées",
  "Une meilleure continuité perçue par le patient",
  "Un cabinet moins exposé à la charge invisible",
  "Des échanges documentés",
  "Un chirurgien sollicité avec contexte",
  "Une expérience post-op plus cohérente avec le niveau du geste",
];

const isNot = [
  "Un chatbot patient",
  "Une IA médicale",
  "Un secrétariat classique",
  "Un logiciel à paramétrer",
  "Un service d'urgence",
];

const isThat = [
  "Un service opéré",
  "Une supervision issue du terrain",
  "Un cadre validé avec le cabinet",
  "Une transmission factuelle",
  "Une traçabilité opérationnelle",
];

// Qualification cabinet — ressort de positionnement avant le CTA final.
const fitYes = [
  "vous opérez régulièrement en ambulatoire",
  "votre équipe reçoit des sollicitations post-op récurrentes",
  "vous ne souhaitez pas recruter une ressource dédiée",
  "vous voulez structurer le suivi sans ajouter un outil à gérer",
];

const fitNo = [
  "votre volume post-op est très faible",
  "vous cherchez un service d'urgence",
  "vous souhaitez une IA autonome côté patient",
];

// Composants utilitaires inline ---------------------------------------------

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

// Page ---------------------------------------------------------------------

export default function ChirurgiensEsthetiquesLanding() {
  return (
    <div className="min-h-screen bg-bone">
      {/* Top bar — minimaliste, navigation vers landing principale uniquement */}
      <header className="border-b border-navy-900/[0.05] bg-bone/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Wordmark />
          </Link>
          <Link
            href="#contact"
            className="rounded-md bg-navy-900 px-4 py-2 text-[12px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
          >
            {CTA_PRIMARY}
          </Link>
        </div>
      </header>

      {/* ============================================================
          HERO — promesse en 5 secondes
          ============================================================ */}
      <section className="px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center">
            <BrandMark />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700">
            Pour chirurgiens esthétiques libéraux
          </p>
          <h1 className="mt-4 font-display text-[2.3rem] font-medium leading-[1.05] tracking-tight text-navy-900 sm:text-[3rem]">
            Votre post-op prend trop de place.
            <br />
            <span className="text-teal-700">KOVELA prend le relais.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed tracking-tight text-charcoal/75 sm:text-[16px]">
            Nous prenons en charge le suivi post-opératoire quotidien de vos patients
            selon votre référentiel cabinet : échanges, relances, éléments déclarés,
            transmissions cabinet et CR factuels.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-[11.5px] italic leading-relaxed tracking-tight text-charcoal/55">
            CR factuel — synthèse courte des éléments déclarés et actions tracées,
            sans interprétation médicale.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-[13.5px] font-medium tracking-tight text-navy-900">
            Sans recruter. Sans former. Sans ajouter un logiciel de plus à gérer.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#contact"
              className="rounded-xl bg-navy-900 px-5 py-3 text-[13.5px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
            >
              {CTA_PRIMARY}
            </Link>
            <Link
              href="#fonctionnement"
              className="rounded-xl bg-white px-5 py-3 text-[13.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-bone"
            >
              {CTA_SECONDARY}
            </Link>
          </div>

          {/* Micro-réassurance */}
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

      {/* ============================================================
          DOULEUR MÉTIER
          ============================================================ */}
      <section className="border-t border-navy-900/[0.05] bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Constat terrain</SectionEyebrow>
            <SectionTitle>
              Le geste est maîtrisé. Le post-op reste souvent trop artisanal.
            </SectionTitle>
            <p className="mt-5 text-[14.5px] leading-relaxed tracking-tight text-charcoal/75">
              Après l&apos;intervention, les sollicitations arrivent vite : messages,
              photos, appels au cabinet, inquiétudes à J0 / J+1, questions répétitives,
              absence de réponse, besoin de relance. L&apos;équipe absorbe une charge
              diffuse, rarement structurée, qui finit souvent par remonter au chirurgien.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pains.map((p) => (
              <div
                key={p}
                className="rounded-xl border border-navy-900/[0.06] bg-bone/40 px-4 py-3.5"
              >
                <p className="flex items-start gap-2.5 text-[13px] leading-relaxed tracking-tight text-navy-900">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/80" />
                  {p}
                </p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center font-display text-[1.15rem] italic leading-relaxed tracking-tight text-navy-900">
            « Le problème n&apos;est pas le manque d&apos;attention. C&apos;est
            l&apos;absence d&apos;un système dédié. »
          </p>
        </div>
      </section>

      {/* ============================================================
          SOLUTION
          ============================================================ */}
      <section className="border-t border-navy-900/[0.05] bg-bone px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Réponse opérationnelle</SectionEyebrow>
            <SectionTitle>
              KOVELA devient votre couche opérationnelle post-op.
            </SectionTitle>
            <p className="mt-5 text-[14.5px] leading-relaxed tracking-tight text-charcoal/75">
              Votre cabinet transmet les informations utiles. KOVELA suit, documente,
              relance, prépare les transmissions et vous remonte les éléments
              nécessaires selon votre référentiel.
            </p>
          </div>

          <div className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {solutionBenefits.map((b) => (
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
        </div>
      </section>

      {/* ============================================================
          FONCTIONNEMENT 4 ÉTAPES
          ============================================================ */}
      <section
        id="fonctionnement"
        className="border-t border-navy-900/[0.05] bg-white px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Fonctionnement</SectionEyebrow>
            <SectionTitle>Simple pour le cabinet. Structuré pour le patient.</SectionTitle>
          </div>

          <ol className="mt-12 grid gap-6 lg:grid-cols-4">
            {steps.map((s) => (
              <li
                key={s.n}
                className="relative rounded-2xl bg-bone/40 p-5 ring-1 ring-navy-900/[0.05]"
              >
                <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-teal-700">
                  {s.n}
                </span>
                <h3 className="mt-2 font-display text-[1.05rem] font-medium leading-snug tracking-tight text-navy-900">
                  {s.t}
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed tracking-tight text-charcoal/70">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================
          BÉNÉFICES CONCRETS
          ============================================================ */}
      <section className="border-t border-navy-900/[0.05] bg-bone px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Ce que ça change</SectionEyebrow>
            <SectionTitle>Ce que ça change concrètement.</SectionTitle>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {concreteBenefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-xl bg-white px-4 py-3.5 shadow-soft ring-1 ring-navy-900/[0.05]"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[11px] font-bold text-teal-700 ring-1 ring-teal-100">
                  ✓
                </span>
                <span className="text-[13.5px] leading-relaxed tracking-tight text-navy-900">
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-12 max-w-xl text-center font-display text-[1.4rem] font-medium leading-tight tracking-tight text-navy-900">
            Vous gardez la main.{" "}
            <span className="text-teal-700">KOVELA prend le quotidien.</span>
          </p>
        </div>
      </section>

      {/* ============================================================
          DIFFÉRENCIATION
          ============================================================ */}
      <section className="border-t border-navy-900/[0.05] bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Différenciation</SectionEyebrow>
            <SectionTitle>Ce n&apos;est pas un logiciel de plus.</SectionTitle>
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
        </div>
      </section>

      {/* ============================================================
          CADRE CLAIR — doctrine + 15/112
          ============================================================ */}
      <section className="border-t border-navy-900/[0.05] bg-bone px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionEyebrow>Cadre</SectionEyebrow>
            <SectionTitle>Un cadre clair, sans confusion médicale.</SectionTitle>
          </div>

          <p className="mt-6 text-[14px] leading-relaxed tracking-tight text-charcoal/75">
            KOVELA ne remplace pas le chirurgien, ne pose pas de diagnostic, ne prescrit
            pas et ne prend aucune décision médicale. Le service structure les échanges,
            documente les éléments déclarés par le patient et transmet au cabinet selon
            le référentiel validé.
          </p>

          <div className="mt-5 rounded-xl border border-amber-200/40 bg-amber-50/40 px-5 py-4 text-[12.5px] leading-relaxed text-amber-900">
            <p className="font-semibold">Urgences — cadre strict</p>
            <p className="mt-1.5">
              KOVELA ne prend pas en charge les urgences. En cas de situation urgente ou
              de doute important, le patient doit contacter immédiatement le{" "}
              <span className="font-semibold">15 / 112</span>, les urgences de la
              clinique ou suivre les consignes remises par son chirurgien.
            </p>
          </div>

          <p className="mt-5 text-center text-[11.5px] tracking-tight text-charcoal/55">
            Les canaux réels de communication et de transmission seront validés en V1
            selon le cadre RGPD / HDS.
          </p>
        </div>
      </section>

      {/* ============================================================
          QUALIFICATION — pour quels cabinets ?
          Ressort de qualification avant le CTA final : aide à la
          conversion ET au filtrage des leads peu qualifiés.
          ============================================================ */}
      <section className="border-t border-navy-900/[0.05] bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Qualification</SectionEyebrow>
            <SectionTitle>
              Pour les cabinets qui veulent structurer sans recruter.
            </SectionTitle>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {/* Colonne gauche — KOVELA est pertinent si */}
            <div className="rounded-2xl bg-teal-50/40 p-6 ring-1 ring-teal-100/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700">
                KOVELA est pertinent si
              </p>
              <ul className="mt-4 space-y-2.5">
                {fitYes.map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13.5px] leading-relaxed tracking-tight text-navy-900"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500 text-[11px] font-bold text-white">
                      ✓
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne droite — KOVELA n'est pas adapté si */}
            <div className="rounded-2xl bg-bone/50 p-6 ring-1 ring-navy-900/[0.06]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                KOVELA n&apos;est pas adapté si
              </p>
              <ul className="mt-4 space-y-2.5">
                {fitNo.map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13.5px] leading-relaxed tracking-tight text-charcoal/65"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal/35" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA FINAL + FORMULAIRE
          ============================================================ */}
      <section
        id="contact"
        className="border-t border-navy-900/[0.06] bg-navy-depth px-5 py-16 text-white sm:px-8 sm:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300">
              Échange court
            </p>
            <h2 className="mt-3 font-display text-[2rem] font-medium leading-tight tracking-tight text-white sm:text-[2.4rem]">
              Votre post-op peut être structuré sans recruter.
            </h2>
            <p className="mt-4 text-[16px] font-medium tracking-tight text-teal-300">
              Structurer mon post-op sans recruter.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed tracking-tight text-navy-100/80">
              En 20 minutes, nous pouvons voir si KOVELA est adapté à votre volume,
              votre organisation et votre manière de suivre vos patients.
            </p>

            <ul className="mt-7 space-y-3">
              {[
                "Échange opérationnel, pas une démo logicielle",
                "Réponses précises sur le périmètre et la doctrine KOVELA",
                "Cadre activation cabinet présenté en clair",
              ].map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2.5 text-[13px] leading-relaxed tracking-tight text-navy-100/85"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-[11px] font-bold text-teal-300 ring-1 ring-teal-300/30">
                    ✓
                  </span>
                  {s}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[11px] tracking-tight text-navy-100/50">
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
            <LeadForm ctaLabel="Voir si KOVELA est adapté à mon cabinet" />
          </div>
        </div>
      </section>

      {/* ============================================================
          PIED DE PAGE — minimal
          ============================================================ */}
      <footer className="border-t border-navy-900/10 bg-navy-depth px-5 py-8 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Wordmark light />
          </div>
          <p className="text-[10.5px] tracking-tight text-navy-100/50">
            Prototype de présentation — les canaux et l&apos;architecture de production
            seront validés en V1 selon le cadre RGPD / HDS.
          </p>
          <Link
            href="/"
            className="text-[11.5px] font-medium tracking-tight text-teal-300 hover:text-teal-200"
          >
            Landing institutionnelle →
          </Link>
        </div>
      </footer>
    </div>
  );
}
