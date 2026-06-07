import Link from "next/link";
import type { Metadata } from "next";
import { BrandMark, Wordmark } from "@/components/Brand";
import { LeadForm } from "./LeadForm";

// ---------------------------------------------------------------------------
// /chirurgiens-esthetiques — landing acquisition V3.
//
// Structure stricte : 5 sections.
//   1. Hero — promesse en 5 secondes.
//   2. Douleur cabinet — 5 douleurs concrètes.
//   3. Ce que KOVELA prend en charge — fusion solution + fonctionnement +
//      bénéfices en 7 blocs courts.
//   4. Différenciation — 2 colonnes courtes.
//   5. CTA + formulaire — micro-bloc doctrine discret avant le bandeau.
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

export default function ChirurgiensEsthetiquesLanding() {
  return (
    <div className="min-h-screen bg-bone">
      {/* Top bar */}
      <header className="border-b border-navy-900/[0.05] bg-bone/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Wordmark />
          </Link>
          <Link
            href="#contact"
            className="whitespace-nowrap rounded-md bg-navy-900 px-3.5 py-2 text-[11.5px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800 sm:px-4 sm:text-[12px]"
          >
            {/* Label court sur mobile, complet sur sm+, pour éviter
                l'overflow du top bar à côté du Wordmark. */}
            <span className="sm:hidden">Échange 20 min</span>
            <span className="hidden sm:inline">{CTA_PRIMARY}</span>
          </Link>
        </div>
      </header>

      {/* ============================================================
          1. HERO — promesse en 5 secondes
          ============================================================ */}
      <section className="px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
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
            <Link
              href="#contact"
              className="rounded-xl bg-navy-900 px-5 py-3 text-[13.5px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
            >
              {CTA_PRIMARY}
            </Link>
            <Link
              href="#prise-en-charge"
              className="rounded-xl bg-white px-5 py-3 text-[13.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-bone"
            >
              {CTA_SECONDARY}
            </Link>
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

      {/* ============================================================
          2. DOULEUR CABINET — courte et concrète
          ============================================================ */}
      <section className="border-t border-navy-900/[0.05] bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Constat cabinet</SectionEyebrow>
            <SectionTitle>
              Ce qui fatigue votre cabinet n&apos;est pas l&apos;intervention.
              C&apos;est l&apos;après.
            </SectionTitle>
            <p className="mt-5 text-[14.5px] leading-relaxed tracking-tight text-charcoal/75">
              Le post-op crée une charge diffuse : rarement simple, souvent
              chronophage, et difficile à tracer proprement.
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
            « Le sujet n&apos;est pas de répondre plus.
            <br />
            C&apos;est de structurer mieux. »
          </p>
        </div>
      </section>

      {/* ============================================================
          3. CE QUE KOVELA PREND EN CHARGE — solution + bénéfices fusionnés
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

          {/* Micro-explications doctrinales, en deux lignes courtes
              alignées sous la grille. */}
          <div className="mx-auto mt-6 max-w-3xl space-y-2 text-center">
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

            {/* Micro-bloc doctrine discret — ne pas en faire une section
                dédiée. Reste lisible, sobre, non anxiogène. */}
            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[11px] leading-relaxed tracking-tight text-navy-100/70">
              <p>
                KOVELA ne remplace pas le chirurgien, ne pose pas de diagnostic, ne
                prescrit pas et ne prend aucune décision médicale. En cas de situation
                urgente ou de doute important, le patient doit contacter le 15 / 112,
                les urgences de la clinique ou suivre les consignes remises par son
                chirurgien.
              </p>
              <p className="mt-2 text-navy-100/45">
                Prototype de présentation — canaux et architecture de production à
                valider en V1 selon le cadre RGPD / HDS.
              </p>
            </div>

            <p className="mt-6 text-[11px] tracking-tight text-navy-100/50">
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

      {/* Footer minimal */}
      <footer className="border-t border-navy-900/10 bg-navy-depth px-5 py-7 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <Wordmark light />
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
