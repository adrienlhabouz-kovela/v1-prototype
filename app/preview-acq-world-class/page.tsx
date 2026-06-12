import Link from "next/link";
import type { Metadata } from "next";
import { Wordmark } from "@/components/Brand";
import { LeadForm } from "../chirurgiens-esthetiques/LeadForm";
import {
  LandingViewTracker,
  TrackedCtaLink,
} from "../chirurgiens-esthetiques/LandingAnalytics";
import {
  CompliancePills,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconShield,
  IconTarget,
  LogoCnil,
  LogoEidas,
  LogoHds,
  LogoRgpd,
} from "@/components/landing-shared";
import { RevealObserver } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";

// ─── /preview-acq-world-class ────────────────────────────────────────────
// Landing acquisition V5 — pack world-class.
//
// Vs V3.1 (/chirurgiens-esthetiques) :
//   ✓ 4 critiques doctrine corrigées (VS, +30%, wording, card centered)
//   ✓ 7 polish premium (ScrollProgress, reveal, hover-lift, sticky CTA,
//     footer 4 cols, quote-conclusion, data-strip 17 chirurgiens)
//   ✓ Hero CTA primaire teal saturé (conversion-first acquisition)
//   ✓ Mockup annoté (lecture du cockpit en 3 zones)
//   ✓ FAQ condensée (6 questions accordion)
//   ✓ Cadre & conformité re-angle chirurgien (sécurité juridique)

export const metadata: Metadata = {
  title:
    "KOVELA — Faire disparaître le bruit post-op du cabinet (chirurgiens esthétiques)",
  description:
    "Extension opérationnelle premium du cabinet : suivi post-op structuré, supervision humaine, IA interne, journal d'action. HDS certifié, RGPD + CNIL conforme, données hébergées en Europe.",
  robots: { index: false, follow: false }, // preview — pas d'indexation
};

const CTA_PRIMARY = "Demander un échange opérationnel";
const CTA_SECONDARY = "Voir comment ça marche";

// ─── Card Sans/Avec — wording aligné sur la home validée ─────────────────
const beforeKovela = [
  "Photos sans contexte",
  "Inquiétudes dispersées",
  "Cabinet sollicité au mauvais moment",
  "Historique éclaté",
];
const beforeKovelaConclusion = "Charge cabinet diffuse";

const withKovela = [
  "Suivi structuré et centralisé",
  "Relances cadrées selon votre référentiel",
  "Transmissions factuelles validées",
  "CR + journal d'action complet",
];
const withKovelaConclusion = "Cabinet sollicité au bon moment";

// ─── Stats bar — 4 indicateurs HONNÊTES (plus de +30% aspirationnel) ─────
const heroStats: { icon: React.ReactNode; value: string; label: string }[] = [
  { icon: <IconClock className="h-[26px] w-[26px]" />, value: "8h-20h", label: "Service opéré" },
  { icon: <IconTarget className="h-[26px] w-[26px]" />, value: "100%", label: "Traçabilité" },
  { icon: <IconShield className="h-[26px] w-[26px]" />, value: "Sécurisé", label: "HDS + RGPD" },
  { icon: <IconCircleCheck className="h-[26px] w-[26px]" />, value: "0", label: "Décision médicale par KOVELA" },
];

const pains = [
  "Photos et messages envoyés sans contexte",
  "Inquiétudes à J+1 : œdèmes, ecchymoses, doutes",
  "Équipe cabinet sollicitée sur des sujets sensibles",
  "Interruptions entre deux consultations",
  "Historique difficile à reconstituer",
];

const flow = [
  {
    n: "01",
    t: "Vous transmettez votre cadre",
    d: "Consignes post-op, actes concernés, contacts utiles. 15 min de mise en place avec l'équipe KOVELA.",
  },
  {
    n: "02",
    t: "KOVELA opère le suivi",
    d: "Supervision humaine spécialisée + IA assistive interne, dans votre cadre. Service actif 8h-20h.",
  },
  {
    n: "03",
    t: "Vous recevez l'essentiel",
    d: "Transmissions factuelles, CR de fin de suivi, journal d'action complet. Cabinet sollicité au bon moment.",
  },
];

const isNot = [
  "Pas un logiciel à apprendre",
  "Pas un chatbot patient",
  "Pas une IA médicale",
  "Pas un service d'urgence",
];

const isThat = [
  "Une extension opérationnelle premium du cabinet",
  "Une supervision humaine issue du terrain",
  "Une assistance IA interne, jamais autonome",
  "Un journal d'action et 100 % de traçabilité",
];

// ─── 3 piliers Cadre — re-angle sécurité juridique chirurgien ────────────
const piliers = [
  {
    eyebrow: "Responsabilité",
    title: "Le chirurgien garde la main",
    items: [
      "KOVELA ne diagnostique pas, ne prescrit pas",
      "Aucune décision médicale prise par KOVELA",
      "Référentiel cabinet relu et validé",
      "Journal d'action complet sur chaque suivi",
    ],
  },
  {
    eyebrow: "Conformité",
    title: "HDS, RGPD, CNIL dès la conception",
    items: [
      "Données hébergées en Europe",
      "Société française · supervision FR",
      "Logs et traçabilité de bout en bout",
      "Désactivable et exportable à tout moment",
    ],
  },
  {
    eyebrow: "Supervision",
    title: "Humain en validation finale",
    items: [
      "Équipe formée au cadre KOVELA",
      "Validation humaine de chaque CR",
      "Head of Care · revue qualité continue",
      "IA brouillons uniquement, jamais autonome",
    ],
  },
];

const trustLogosAcq: { Logo: () => React.ReactElement; label: string }[] = [
  { Logo: LogoHds, label: "Hébergement santé" },
  { Logo: LogoRgpd, label: "Conformité européenne" },
  { Logo: LogoEidas, label: "Identité électronique" },
  { Logo: LogoCnil, label: "Autorité française" },
];

// ─── FAQ — 6 questions condensées (standard acquisition health-tech) ─────
const faq = [
  {
    q: "Le chirurgien garde-t-il la main sur le suivi ?",
    a: "Oui, intégralement. KOVELA ne diagnostique pas, ne prescrit pas et ne prend aucune décision médicale. Vous transmettez votre cadre (consignes, actes, seuils d'alerte) et nous l'opérons dans le respect strict de votre référentiel. Chaque CR est validé humainement avant transmission.",
  },
  {
    q: "Qui répond aux patients ? Une IA ou un humain ?",
    a: "Un humain. Toujours. L'IA interne prépare des brouillons pour accélérer le travail des superviseurs, mais aucune réponse n'est envoyée au patient sans validation humaine. L'IA est désactivable et chaque action est loggée.",
  },
  {
    q: "Comment KOVELA s'intègre à mon cabinet ?",
    a: "Pas de logiciel à installer côté cabinet. 15 minutes de mise en place avec votre équipe pour transmettre votre cadre. Vous recevez ensuite les transmissions par votre canal habituel (mail sécurisé, SMS dédié, ou intégration CRM cabinet selon vos préférences).",
  },
  {
    q: "Quelles données sont collectées et hébergées ?",
    a: "Uniquement les éléments nécessaires au suivi post-op (consignes du chirurgien, messages patient, photos transmises, CR). Données hébergées en Europe sur infrastructure HDS certifiée. Conformité RGPD et CNIL dès la conception. Logs et traçabilité de bout en bout.",
  },
  {
    q: "Combien ça coûte ?",
    a: (
      <>
        Le détail tarification est sur la{" "}
        <Link href="/" className="font-medium text-teal-700 underline-offset-2 hover:underline">
          landing institutionnelle
        </Link>
        . En synthèse : forfait accès mensuel + facturation à l'usage réel (par
        patient activé). Pas d'engagement long, pas de surprise.
      </>
    ),
  },
  {
    q: "Quand peut-on commencer ?",
    a: "Le pilote est ouvert à un nombre limité de cabinets pour la phase d'amorçage. Un échange opérationnel de 20 minutes permet de vérifier l'adéquation à votre volume et votre organisation. Les pilotes démarrent sous 2 à 4 semaines après cet échange.",
  },
];

// ─── ProductMockup — cockpit annoté (lecture en 3 zones) ─────────────────
function ProductMockup() {
  return (
    <section
      aria-label="Aperçu cockpit KOVELA"
      className="bg-white px-5 pb-16 pt-2 sm:px-8 sm:pb-20 sm:pt-4 reveal-target"
    >
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl bg-navy-900 shadow-lift ring-1 ring-navy-900/15">
          {/* Top window bar */}
          <div className="flex items-center gap-1.5 border-b border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <p className="ml-3 truncate text-[9.5px] font-semibold uppercase tracking-[0.16em] text-navy-100/55">
              Cockpit superviseur · service actif 8h-20h
            </p>
          </div>

          <div className="grid gap-px bg-white/[0.04] md:grid-cols-3">
            {/* Colonne 1 — Zone 1 (À traiter) */}
            <div className="bg-navy-900 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                  À traiter maintenant
                </p>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-500/25 text-[9px] font-bold text-teal-200 ring-1 ring-teal-400/30">
                  1
                </span>
              </div>
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

            {/* Colonne 2 — Zone 2 (IA propose, humain valide) */}
            <div className="bg-navy-900 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                  Éléments déclarés
                </p>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-500/25 text-[9px] font-bold text-teal-200 ring-1 ring-teal-400/30">
                  2
                </span>
              </div>
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
                    Brouillon IA · à valider
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white">
                    Réponse patient préparée — à relire avant envoi.
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne 3 — Zone 3 (Sortie cabinet factuelle) */}
            <div className="bg-navy-900 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                  Actions cabinet
                </p>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-500/25 text-[9px] font-bold text-teal-200 ring-1 ring-teal-400/30">
                  3
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {[
                  "Transmission cabinet préparée",
                  "CR factuel en cours",
                  "Demande d'avis neutre prévue",
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

        {/* Lecture du cockpit — 3 zones annotées */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Le patient s'exprime", "Photos, doutes, signaux. Tout arrive au même endroit."],
            ["2", "L'IA propose, l'humain valide", "Brouillons relus, jamais d'envoi auto."],
            ["3", "Le cabinet reçoit l'essentiel", "Transmission factuelle, validée, tracée."],
          ].map(([n, t, d]) => (
            <div key={n as string} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-[11px] font-bold tracking-tight text-teal-700 ring-1 ring-teal-500/30">
                {n}
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold tracking-tight text-navy-900">
                  {t}
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-charcoal/60">
                  {d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function PreviewAcqWorldClass() {
  return (
    <div className="bg-white text-navy-900">
      <ScrollProgress />
      <RevealObserver />
      <LandingViewTracker />

      {/* ============================================================
          Header navy compact — sticky, teal CTA conversion-first.
          ============================================================ */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-navy-900/95 backdrop-blur-md">
        <div className="flex items-center justify-between gap-6 px-6 py-2.5 lg:px-10 xl:px-16">
          <Link href="/" className="flex items-center gap-2">
            <Wordmark light compact />
          </Link>
          <nav className="hidden items-center gap-8 text-[12.5px] tracking-tight text-navy-100/75 lg:flex">
            <a href="#constat" className="transition-colors hover:text-white">Le constat</a>
            <a href="#fonctionnement" className="transition-colors hover:text-white">Fonctionnement</a>
            <a href="#cadre" className="transition-colors hover:text-white">Cadre &amp; conformité</a>
            <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
            <a href="#contact" className="transition-colors hover:text-white">Contact</a>
          </nav>
          <TrackedCtaLink
            href="#contact"
            eventName="hero_cta_click"
            extraPayload={{ position: "top_bar" }}
            className="whitespace-nowrap rounded-lg bg-teal-500 px-3.5 py-1.5 text-[12.5px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-teal-600"
          >
            <span className="sm:hidden">Échange</span>
            <span className="hidden sm:inline">{CTA_PRIMARY}</span>
          </TrackedCtaLink>
        </div>
      </header>

      {/* ============================================================
          HERO — split texte gauche / photo droite + card Sans/Avec
          centrée (desktop) — VS retiré, wording aligné home.
          ============================================================ */}
      <section className="relative bg-white">
        <div className="grid lg:grid-cols-2">
          {/* Colonne gauche */}
          <div className="flex items-start px-5 pt-10 pb-7 sm:px-10 sm:pt-14 sm:pb-8 lg:px-10 lg:pt-16 lg:pb-6 xl:px-16 xl:pt-20 xl:pb-6">
            <div className="w-full max-w-[600px]">
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Pour chirurgiens esthétiques
                </p>
                <span className="h-px w-14 bg-teal-500/40" />
              </div>

              <h1 className="mt-7 font-display text-[1.55rem] font-semibold leading-[1.1] tracking-[-0.035em] text-navy-900 sm:text-balance sm:text-[2.2rem] sm:leading-[1.05] lg:text-[2.65rem] lg:tracking-[-0.04em] xl:text-[2.95rem]">
                KOVELA fait disparaître le bruit post-op du quotidien du
                cabinet.
              </h1>

              <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-charcoal/70">
                Un suivi post-op structuré. Des chirurgiens libérés du bruit.
              </p>

              {/* CTA primaire TEAL saturé — conversion-first acquisition std */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <TrackedCtaLink
                  href="#contact"
                  eventName="hero_cta_click"
                  extraPayload={{ position: "hero_primary" }}
                  className="rounded-lg bg-teal-500 px-6 py-3 text-[13.5px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-teal-600"
                >
                  {CTA_PRIMARY}
                </TrackedCtaLink>
                <TrackedCtaLink
                  href="#fonctionnement"
                  eventName="secondary_cta_click"
                  extraPayload={{ position: "hero_secondary" }}
                  className="rounded-lg bg-white px-6 py-3 text-[13.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-ivory"
                >
                  {CTA_SECONDARY}
                </TrackedCtaLink>
              </div>

              {/* Compliance pills — ligne 2 dépliable sur mobile via shared */}
              <div className="mt-5">
                <CompliancePills />
              </div>

              {/* ============================================================
                  Card Sans / Avec KOVELA — wording aligné home.
                  Desktop : 2 colonnes centrées dans 1 carte (PAS de VS).
                  Mobile : remontée en section dédiée après §1 (cf. plus bas).
                  ============================================================ */}
              <div className="relative mt-7 hidden rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-900/[0.05] sm:block sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-0">
                  {/* Sans */}
                  <div className="text-center sm:pr-6">
                    <div className="flex items-center justify-center gap-2">
                      <span className="rounded-md bg-[#D24B3E]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#D24B3E]">
                        Sans
                      </span>
                      <h3 className="font-display text-[16.5px] font-semibold tracking-tight text-navy-900">
                        KOVELA
                      </h3>
                    </div>
                    <ul className="mt-4 inline-flex flex-col items-start gap-2 text-left">
                      {beforeKovela.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2 text-[12.5px] leading-snug text-charcoal/75"
                        >
                          <IconCircleX className="mt-px h-[15px] w-[15px] shrink-0 text-[#D24B3E]" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 inline-flex rounded-md bg-[#D24B3E]/10 px-2.5 py-1 text-[12px] font-semibold tracking-tight text-[#D24B3E]">
                      {beforeKovelaConclusion}
                    </p>
                  </div>

                  {/* Avec */}
                  <div className="text-center sm:border-l sm:border-navy-900/[0.07] sm:pl-6">
                    <div className="flex items-center justify-center gap-2">
                      <span className="rounded-md bg-teal-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
                        Avec
                      </span>
                      <h3 className="font-display text-[16.5px] font-semibold tracking-tight text-navy-900">
                        KOVELA
                      </h3>
                    </div>
                    <ul className="mt-4 inline-flex flex-col items-start gap-2 text-left">
                      {withKovela.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2 text-[12.5px] leading-snug text-navy-900"
                        >
                          <IconCircleCheck className="mt-px h-[15px] w-[15px] shrink-0 text-teal-600" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 inline-flex rounded-md bg-teal-500/15 px-2.5 py-1 text-[12px] font-semibold tracking-tight text-teal-700">
                      {withKovelaConclusion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite — photo. Fallback flat bone. */}
          <div
            className="relative min-h-[220px] bg-bone lg:min-h-[480px]"
            style={{
              backgroundImage:
                "url('/hero-consultation.webp'), url('/hero-consultation.jpg')",
              backgroundSize: "cover, cover",
              backgroundPosition: "center, center",
              backgroundRepeat: "no-repeat, no-repeat",
            }}
            role="img"
            aria-label="Chirurgien en consultation post-opératoire avec une patiente"
          >
          </div>
        </div>
      </section>

      {/* Barre de preuves — 4 indicateurs honnêtes (plus de +30% aspirationnel) */}
      <section className="border-t border-navy-900/[0.06] bg-white">
        <div className="grid grid-cols-2 gap-x-5 gap-y-7 px-5 pb-8 pt-7 sm:grid-cols-4 sm:gap-x-10 sm:px-6 sm:pb-10 sm:pt-8 lg:gap-y-0 lg:px-10 xl:px-16">
          {heroStats.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 sm:gap-4 ${
                i > 0 ? "sm:border-l sm:border-navy-900/[0.07] sm:pl-10" : ""
              }`}
            >
              <span className="shrink-0 text-teal-600/85">{s.icon}</span>
              <div className="leading-none">
                <p className="font-display text-[18px] font-semibold tracking-tight text-navy-900 sm:text-[22px]">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[12px] tracking-tight text-charcoal/60 sm:mt-2 sm:text-[12.5px]">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Baseline */}
      <section className="border-t border-navy-900/[0.06] bg-ivory">
        <div className="px-6 py-5 text-center">
          <p className="text-[15px] tracking-tight text-charcoal/70">
            <span className="font-display font-semibold text-navy-900">
              KOVELA.
            </span>{" "}
            Une extension opérationnelle premium pour les{" "}
            <span className="font-medium text-teal-600">
              chirurgiens exigeants
            </span>
            .
          </p>
        </div>
      </section>

      {/* ============================================================
          §1 LE CONSTAT — douleur cabinet + data-strip + quote.
          ============================================================ */}
      <section id="constat" className="border-t border-navy-900/[0.06] bg-white reveal-target">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
              Le constat
            </p>
            <h2 className="mt-3 font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.025em] text-navy-900 sm:text-[2.3rem]">
              Ce qui fatigue votre cabinet n&apos;est pas l&apos;intervention.
              C&apos;est l&apos;après.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-charcoal/70">
              Le post-op crée une charge diffuse : rarement simple, souvent
              chronophage, et difficile à tracer proprement.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pains.map((p) => (
              <div
                key={p}
                className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045] hover-lift"
              >
                <div className="mb-4 h-px w-7 bg-amber-500/70" />
                <p className="text-[14px] leading-relaxed tracking-tight text-navy-900">
                  {p}
                </p>
              </div>
            ))}
          </div>

          {/* Data-strip — 17 chirurgiens + 60-90 min (markers crédibilité) */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-ivory p-6 ring-1 ring-navy-900/[0.05]">
              <p className="font-display text-[1.75rem] font-medium leading-none tracking-tight text-navy-900">
                60-90 min
              </p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-charcoal/65">
                de travail humain par patient, sur 3-15 jours en suivi manuel
                (WhatsApp, audio, SMS).
              </p>
            </div>
            <div className="rounded-2xl bg-ivory p-6 ring-1 ring-navy-900/[0.05]">
              <p className="font-display text-[1.75rem] font-medium leading-none tracking-tight text-navy-900">
                17 chirurgiens
              </p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-charcoal/65">
                esthétiques privés interrogés en entretien terrain avec leur
                équipe. Cadre KOVELA validé.
              </p>
            </div>
          </div>

          {/* Quote-conclusion italique — aligné home */}
          <p className="mx-auto mt-12 max-w-3xl text-center font-display text-[1.5rem] italic leading-snug tracking-[-0.02em] text-navy-900 sm:text-[1.85rem]">
            Le post-op n&apos;est pas un problème médical.
            <br />
            C&apos;est un problème opérationnel.
          </p>
        </div>
      </section>

      {/* ============================================================
          §1bis — Card Sans/Avec MOBILE (après §1, hors hero).
          ============================================================ */}
      <section className="border-b border-navy-900/[0.06] bg-white sm:hidden">
        <div className="px-5 py-10">
          <div className="space-y-3">
            <div className="rounded-2xl bg-[#FDF4F2] p-6 shadow-card ring-1 ring-[#D24B3E]/20 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="rounded-md bg-[#D24B3E]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#D24B3E]">
                  Sans
                </span>
                <h3 className="font-display text-[16.5px] font-semibold tracking-tight text-navy-900">
                  KOVELA
                </h3>
              </div>
              <ul className="mt-4 inline-flex flex-col items-start gap-2.5 text-left">
                {beforeKovela.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2.5 text-[13px] leading-snug text-charcoal/80"
                  >
                    <IconCircleX className="mt-px h-[16px] w-[16px] shrink-0 text-[#D24B3E]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 inline-flex rounded-md bg-[#D24B3E]/10 px-2.5 py-1 text-[12px] font-semibold tracking-tight text-[#D24B3E]">
                {beforeKovelaConclusion}
              </p>
            </div>

            <div className="rounded-2xl bg-[#EAF7F4] p-6 shadow-card ring-1 ring-teal-500/30 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="rounded-md bg-teal-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
                  Avec
                </span>
                <h3 className="font-display text-[16.5px] font-semibold tracking-tight text-navy-900">
                  KOVELA
                </h3>
              </div>
              <ul className="mt-4 inline-flex flex-col items-start gap-2.5 text-left">
                {withKovela.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2.5 text-[13px] leading-snug text-navy-900"
                  >
                    <IconCircleCheck className="mt-px h-[16px] w-[16px] shrink-0 text-teal-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 inline-flex rounded-md bg-teal-500/15 px-2.5 py-1 text-[12px] font-semibold tracking-tight text-teal-700">
                {withKovelaConclusion}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          §2 COMMENT ÇA MARCHE — 3 étapes (tenu plus simple que home).
          ============================================================ */}
      <section
        id="fonctionnement"
        className="border-t border-navy-900/[0.06] bg-ivory reveal-target"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
              Comment ça marche
            </p>
            <h2 className="mt-3 font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.025em] text-navy-900 sm:text-[2.3rem]">
              Trois étapes. Pas de logiciel à apprendre.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-charcoal/70">
              Vous transmettez votre cadre. KOVELA opère selon vos habitudes.
              Vous recevez l&apos;essentiel.
            </p>
          </div>

          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {flow.map((s) => (
              <li
                key={s.n}
                className="rounded-2xl bg-white p-7 shadow-card ring-1 ring-navy-900/[0.05] hover-lift"
              >
                <span className="font-display text-[28px] font-medium leading-none tracking-tight text-teal-600/80">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-[16px] font-semibold tracking-tight text-navy-900">
                  {s.t}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-charcoal/65">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-12 max-w-xl text-center font-display text-[1.25rem] font-medium leading-tight tracking-tight text-navy-900">
            Vous gardez la main.{" "}
            <span className="text-teal-700">KOVELA gère le quotidien.</span>
          </p>
        </div>
      </section>

      {/* §3 Mockup cockpit annoté */}
      <ProductMockup />

      {/* ============================================================
          §4 DIFFÉRENCIATION — Ce que KOVELA n'est pas / est.
          ============================================================ */}
      <section className="border-t border-navy-900/[0.06] bg-white reveal-target">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
              Différenciation
            </p>
            <h2 className="mt-3 font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.025em] text-navy-900 sm:text-[2.3rem]">
              Ce n&apos;est pas un logiciel de plus.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium leading-relaxed text-navy-900">
              Rien à installer. Rien à manager.{" "}
              <span className="text-teal-700">
                Rien à apprendre côté cabinet.
              </span>
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-ivory p-7 ring-1 ring-navy-900/[0.05] hover-lift">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                Ce que KOVELA n&apos;est pas
              </p>
              <ul className="mt-5 space-y-3">
                {isNot.map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[14px] leading-relaxed tracking-tight text-charcoal/70"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal/30" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-navy-900 p-7 text-white ring-1 ring-navy-900/10 hover-lift">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">
                Ce que KOVELA est
              </p>
              <ul className="mt-5 space-y-3">
                {isThat.map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[14px] leading-relaxed tracking-tight text-white"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center font-display text-[1.2rem] italic leading-relaxed tracking-tight text-navy-900 sm:text-[1.35rem]">
            Le patient ne retient pas seulement le geste.
            <br />
            Il retient aussi la façon dont il a été accompagné après.
          </p>
        </div>
      </section>

      {/* ============================================================
          §5 CADRE & CONFORMITÉ — re-angle sécurité juridique chirurgien.
          ============================================================ */}
      <section id="cadre" className="border-t border-navy-900/[0.06] bg-ivory reveal-target">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
              Cadre &amp; conformité
            </p>
            <h2 className="mt-3 font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.025em] text-navy-900 sm:text-[2.3rem]">
              Le cabinet structuré. Le chirurgien protégé.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-charcoal/70">
              <span className="font-semibold text-navy-900">
                HDS / RGPD dès la conception.
              </span>{" "}
              Données hébergées en Europe. Société française. Supervision
              spécialisée formée au cadre KOVELA.
            </p>
          </div>

          {/* 3 piliers re-angle chirurgien */}
          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {piliers.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045] hover-lift"
              >
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-700">
                  {p.eyebrow}
                </p>
                <h3 className="mt-2.5 font-display text-[14.5px] font-semibold tracking-tight text-navy-900">
                  {p.title}
                </h3>
                <ul className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-charcoal/70">
                  {p.items.map((it) => (
                    <li key={it}>— {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Encart logos */}
          <div className="mt-10 rounded-2xl border border-navy-900/[0.06] bg-white p-7">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
              Certifications &amp; conformités visées
            </p>
            <div className="mt-6 grid grid-cols-2 items-start gap-x-6 gap-y-7 sm:grid-cols-4">
              {trustLogosAcq.map(({ Logo, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center"
                >
                  <Logo />
                  <p className="mt-3 text-[11px] tracking-tight text-charcoal/55">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center font-display text-[1.15rem] italic leading-relaxed tracking-tight text-navy-900">
            KOVELA ne remplace pas le chirurgien. KOVELA structure, documente
            et transmet.
          </p>
        </div>
      </section>

      {/* ============================================================
          §6 FAQ — 6 questions condensées (accordion natif).
          ============================================================ */}
      <section id="faq" className="border-t border-navy-900/[0.06] bg-white reveal-target">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
              Questions fréquentes
            </p>
            <h2 className="mt-3 font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.025em] text-navy-900 sm:text-[2.3rem]">
              Ce que les chirurgiens nous demandent le plus.
            </h2>
          </div>

          <div className="mt-10 divide-y divide-navy-900/[0.08] rounded-2xl bg-ivory ring-1 ring-navy-900/[0.05]">
            {faq.map((item, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden sm:px-6 sm:py-5">
                  <h3 className="text-[14.5px] font-semibold leading-snug tracking-tight text-navy-900 sm:text-[15px]">
                    {item.q}
                  </h3>
                  <svg
                    viewBox="0 0 16 16"
                    className="mt-1 h-4 w-4 shrink-0 text-charcoal/55 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M4 6 8 10 12 6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-[13.5px] leading-relaxed text-charcoal/70 sm:px-6 sm:pb-6 sm:text-[14px]">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          §7 CTA + FORMULAIRE — LeadForm conservé.
          ============================================================ */}
      <section
        id="contact"
        className="border-t border-navy-900/[0.06] bg-navy-900 px-5 py-20 text-white sm:px-8 sm:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300">
              Échange opérationnel
            </p>
            <h2 className="mt-3 font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[2.4rem]">
              Faire disparaître le bruit post-op de votre cabinet.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed tracking-tight text-navy-100/80">
              En 20 minutes, nous vérifions si KOVELA est adapté à votre volume,
              votre organisation et vos habitudes de suivi.
            </p>

            <p className="mt-6 text-[10.5px] leading-relaxed tracking-tight text-navy-100/50">
              KOVELA ne remplace pas le chirurgien, ne pose pas de diagnostic,
              ne prescrit pas et ne prend aucune décision médicale. En cas de
              situation urgente ou de doute important, le patient doit
              contacter le 15 / 112, les urgences de la clinique ou suivre les
              consignes remises par son chirurgien.
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

      {/* ============================================================
          Footer enrichi 4 colonnes (Produit · Cabinet · Cadre · Légal)
          ============================================================ */}
      <footer className="border-t border-navy-900/10 bg-navy-900 px-5 py-12 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Wordmark light compact />
              <p className="mt-3 text-[11px] leading-relaxed tracking-tight text-navy-100/45">
                Extension opérationnelle premium pour les cabinets de
                chirurgie esthétique.
              </p>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                Produit
              </p>
              <ul className="mt-3 space-y-2 text-[12px] tracking-tight text-navy-100/70">
                <li><a href="#fonctionnement" className="hover:text-white">Fonctionnement</a></li>
                <li><a href="#cadre" className="hover:text-white">Cadre &amp; conformité</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                <li><Link href="/" className="hover:text-white">Landing institutionnelle →</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                Cabinet
              </p>
              <ul className="mt-3 space-y-2 text-[12px] tracking-tight text-navy-100/70">
                <li><a href="#contact" className="hover:text-white">Demander un échange</a></li>
                <li>
                  <a href="mailto:contact@kovela.care" className="hover:text-white">
                    contact@kovela.care
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                Légal
              </p>
              <ul className="mt-3 space-y-2 text-[12px] tracking-tight text-navy-100/70">
                <li>HDS certifié</li>
                <li>RGPD + CNIL</li>
                <li>Données hébergées en Europe</li>
                <li>Société française</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/[0.08] pt-5 text-center text-[10.5px] leading-relaxed tracking-tight text-navy-100/45">
            Prototype de présentation — canaux et architecture de production à
            valider en V1 selon le cadre RGPD / HDS.
          </div>
        </div>
      </footer>

      {/* ============================================================
          Sticky bottom CTA mobile — pattern Calendly/Linear conversion.
          Visible uniquement sur mobile, dimmed quand au-dessus du form.
          ============================================================ */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 sm:hidden">
        <TrackedCtaLink
          href="#contact"
          eventName="hero_cta_click"
          extraPayload={{ position: "sticky_bottom_mobile" }}
          className="pointer-events-auto flex w-full items-center justify-center rounded-full bg-teal-500 px-5 py-3.5 text-[13.5px] font-semibold tracking-tight text-white shadow-lift"
        >
          {CTA_PRIMARY}
        </TrackedCtaLink>
      </div>
    </div>
  );
}
