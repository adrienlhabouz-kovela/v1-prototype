import Link from "next/link";
import type { Metadata } from "next";
import { Wordmark } from "@/components/Brand";
import { LeadForm } from "./LeadForm";
import {
  LandingViewTracker,
  TrackedCtaLink,
} from "./LandingAnalytics";
import {
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

// ─── /chirurgiens-esthetiques — landing acquisition V6 ──────────────────
// Refonte basée sur audit sourcé (état de l'art 2025-2026 + teardown de
// 12 landings live : Linear, Stripe, Vercel /enterprise, Notion Business,
// Ramp, Mercury, Attio, Cal.com, Doctolib Pro, Resilience, Lifen,
// Curecall, Anthropic, Figma Enterprise).
//
// Décisions stratégiques :
//   - Témoignages 17 chirurgiens : anonymisés
//   - Mécanique RDV : LeadForm mailto + promesse Adrien 24h
//   - Pas de scarcité
//   - H1 manifesto « Le silence post-op. » exploitant l'insight stratégique
//     « le silence = futur addiction »
//   - Registre institutionnel premium (Anthropic + Resilience), landing
//     sert de 2e œil après bouche-à-oreille (pas funnel automatisé).

export const metadata: Metadata = {
  title:
    "KOVELA — Le silence post-op (chirurgiens esthétiques privés)",
  description:
    "Pour les cabinets de chirurgie esthétique privée premium. KOVELA prend en charge le suivi post-opératoire de vos patients — votre cabinet retrouve la concentration. HDS certifié, RGPD + CNIL conforme.",
  robots: { index: true, follow: true },
};

const CTA_PRIMARY = "Réserver 20 minutes";
const CTA_SECONDARY = "Voir comment ça marche";

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

// ─── Timeline cabinet — J-7 / J+1 / J+30 ─────────────────────────────────
// Format : ce que VOTRE cabinet fait / reçoit. Pas le parcours patient
// (secret médical). Pattern Curecall — institutionnel, clair, lisible.
const timeline = [
  {
    n: "J-7",
    t: "Préparation cadrée",
    d: "Votre référentiel cabinet est intégré. Votre équipe valide les consignes post-op pour l'intervention à venir.",
  },
  {
    n: "J+1 → J+15",
    t: "Suivi opéré",
    d: "Supervision humaine spécialisée + IA assistive interne. Service actif 8h-20h. Cabinet sollicité uniquement aux moments clés.",
  },
  {
    n: "J+30",
    t: "Clôture documentée",
    d: "CR factuel de fin de suivi + journal d'action complet remis au cabinet. Traçabilité de bout en bout.",
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

// ─── FAQ — question Ordre des médecins ajoutée (non-négociable en FR) ────
const faq = [
  {
    q: "Que dit l'Ordre des médecins de ce type de service ?",
    a: "KOVELA est conçu pour rester strictement dans le cadre de la déontologie médicale française. Aucun diagnostic, aucune prescription, aucune décision médicale n'est pris par KOVELA. La supervision humaine valide chaque CR et chaque transmission. Le chirurgien reste seul responsable du suivi médical de son patient. Nous travaillons à formaliser cette doctrine avec un comité de chirurgiens et de juristes spécialisés en droit médical.",
  },
  {
    q: "Mes données patients sont-elles vraiment hébergées en France ?",
    a: "Oui. Toutes les données circulant via KOVELA sont hébergées sur infrastructure HDS certifiée en France. Société française, supervision en France, sous-traitants français. Conformité RGPD et CNIL dès la conception. Logs et traçabilité de bout en bout. Auditable à tout moment.",
  },
  {
    q: "Et si le patient appelle directement le cabinet ?",
    a: "Rien ne change. Le patient garde tous ses canaux habituels d'accès au cabinet. KOVELA structure le flux post-op organisé (relances cadrées, photos contextualisées, CR factuels), sans se substituer aux urgences ni aux situations où le patient juge nécessaire de joindre directement le chirurgien.",
  },
  {
    q: "Qui parle aux patients ? Un humain ou une IA ?",
    a: "Un humain. Toujours. L'IA interne prépare des brouillons pour accélérer le travail des superviseurs, mais aucune réponse n'est envoyée au patient sans validation humaine. L'IA est désactivable, chaque action est loggée.",
  },
  {
    q: "Comment KOVELA s'intègre à mon cabinet ?",
    a: "Pas de logiciel à installer côté cabinet. 15 minutes de mise en place avec votre équipe pour transmettre votre cadre (consignes post-op, actes concernés, seuils d'alerte). Vous recevez ensuite les transmissions par votre canal habituel (mail sécurisé, SMS dédié, ou intégration ultérieure).",
  },
  {
    q: "Quand peut-on commencer ?",
    a: "Un échange opérationnel de 20 minutes permet de vérifier l'adéquation à votre volume et votre organisation. Les premiers pilotes démarrent sous 2 à 4 semaines après cet échange.",
  },
];

// ─── Cockpit produit — annotations renforcées ─────────────────────────────
function ProductMockup() {
  return (
    <section
      aria-label="Aperçu cockpit KOVELA"
      className="bg-white px-5 pb-16 pt-2 sm:px-8 sm:pb-20 sm:pt-4 reveal-target"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
            Cockpit superviseur
          </p>
          <h2 className="mt-3 font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.025em] text-navy-900 sm:text-[2rem]">
            Ce que voit l&apos;équipe KOVELA quand elle suit vos patients.
          </h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-charcoal/65">
            Trois zones. Une seule règle : l&apos;humain valide tout ce qui
            sort vers le patient et vers votre cabinet.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-navy-900 shadow-lift ring-1 ring-navy-900/15">
          <div className="flex items-center gap-1.5 border-b border-white/[0.08] bg-white/[0.03] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <p className="ml-3 truncate text-[9.5px] font-semibold uppercase tracking-[0.16em] text-navy-100/55">
              Cockpit superviseur · service actif 8h-20h
            </p>
          </div>

          <div className="grid gap-px bg-white/[0.04] md:grid-cols-3">
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

        {/* Lecture du cockpit — explainer renforcé */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["1", "Le patient s'exprime", "Photos, doutes, signaux post-op. Tout arrive au même endroit, contextualisé."],
            ["2", "L'IA propose, l'humain valide", "Brouillons relus par un superviseur formé. Jamais d'envoi automatique."],
            ["3", "Le cabinet reçoit l'essentiel", "Transmission factuelle, validée, tracée. Cabinet sollicité au bon moment."],
          ].map(([n, t, d]) => (
            <div key={n as string} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-[12px] font-bold tracking-tight text-teal-700 ring-1 ring-teal-500/30">
                {n}
              </span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold tracking-tight text-navy-900">
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
export default function ChirurgiensEsthetiquesLanding() {
  return (
    <div className="bg-white text-navy-900">
      <ScrollProgress />
      <RevealObserver />
      <LandingViewTracker />

      {/* ============================================================
          Header — sticky, teal CTA dominant unique.
          ============================================================ */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-navy-900/95 backdrop-blur-md">
        <div className="flex items-center justify-between gap-6 px-6 py-2.5 lg:px-10 xl:px-16">
          <Link href="/" className="flex items-center gap-2">
            <Wordmark light compact />
          </Link>
          <nav className="hidden items-center gap-8 text-[12.5px] tracking-tight text-navy-100/75 lg:flex">
            <a href="#constat" className="transition-colors hover:text-white">Le constat</a>
            <a href="#fonctionnement" className="transition-colors hover:text-white">Fonctionnement</a>
            <a href="#cadre" className="transition-colors hover:text-white">Cadre</a>
            <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
          </nav>
          <TrackedCtaLink
            href="#contact"
            eventName="hero_cta_click"
            extraPayload={{ position: "top_bar" }}
            className="whitespace-nowrap rounded-lg bg-teal-500 px-3.5 py-1.5 text-[12.5px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-teal-600"
          >
            <span className="sm:hidden">RDV</span>
            <span className="hidden sm:inline">{CTA_PRIMARY}</span>
          </TrackedCtaLink>
        </div>
      </header>

      {/* ============================================================
          HERO — H1 manifesto « Le silence post-op. »
          Exploite l'insight stratégique : le silence = futur addiction.
          Registre Anthropic/Linear : 3 mots, type-driven, dominant.
          ============================================================ */}
      <section className="relative bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="flex items-start px-5 pt-10 pb-7 sm:px-10 sm:pt-14 sm:pb-8 lg:px-10 lg:pt-20 lg:pb-8 xl:px-16 xl:pt-24 xl:pb-8">
            <div className="w-full max-w-[600px]">
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Pour chirurgiens esthétiques privés
                </p>
                <span className="h-px w-14 bg-teal-500/40" />
              </div>

              {/* H1 manifesto — 3 mots, ATF dominant */}
              <h1 className="mt-7 font-display text-[2.5rem] font-semibold leading-[0.95] tracking-[-0.045em] text-navy-900 sm:text-[3.5rem] lg:text-[4.2rem] xl:text-[4.8rem]">
                Le silence
                <br />
                <span className="text-teal-700">post-op.</span>
              </h1>

              <p className="mt-7 max-w-md text-[15.5px] leading-relaxed text-charcoal/70">
                KOVELA prend en charge le suivi post-opératoire de vos patients
                en chirurgie esthétique. Votre cabinet retrouve la
                concentration. Vos patients, un accompagnement structuré.
              </p>

              {/* 1 CTA dominant teal + 1 ghost — pattern Linear/Vercel */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <TrackedCtaLink
                  href="#contact"
                  eventName="hero_cta_click"
                  extraPayload={{ position: "hero_primary" }}
                  className="rounded-lg bg-teal-500 px-6 py-3.5 text-[14px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-teal-600"
                >
                  {CTA_PRIMARY}
                </TrackedCtaLink>
                <TrackedCtaLink
                  href="#fonctionnement"
                  eventName="secondary_cta_click"
                  extraPayload={{ position: "hero_secondary" }}
                  className="text-[14px] font-medium tracking-tight text-navy-700 underline-offset-4 transition-colors hover:text-navy-900 hover:underline"
                >
                  {CTA_SECONDARY} →
                </TrackedCtaLink>
              </div>

              {/* Trust strip ATF — pattern Resilience/Doctolib.
                  3 items only (Caffeine recommendation) :
                  - usage stat (17 chirurgiens)
                  - HDS
                  - RGPD */}
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 text-[11.5px] tracking-tight text-charcoal/70">
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <span className="font-medium">Conçu avec 17 chirurgiens privés</span>
                </span>
                <span className="hidden text-charcoal/25 sm:inline">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <IconShield className="h-3.5 w-3.5 text-teal-600/85" />
                  <span className="font-medium">HDS certifié</span>
                </span>
                <span className="hidden text-charcoal/25 sm:inline">·</span>
                <span className="font-medium">RGPD + CNIL</span>
              </div>

              {/* Card Sans/Avec — desktop only, mobile remonte en §1bis */}
              <div className="relative mt-7 hidden rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-900/[0.05] sm:block sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-0">
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

          <div
            className="relative min-h-[260px] bg-bone lg:min-h-[560px]"
            style={{
              backgroundImage:
                "url('/hero-consultation.webp'), url('/hero-consultation.jpg')",
              backgroundSize: "cover, cover",
              backgroundPosition: "center, center",
              backgroundRepeat: "no-repeat, no-repeat",
            }}
            role="img"
            aria-label="Cabinet de chirurgie esthétique — moment de calme"
          >
          </div>
        </div>
      </section>

      {/* Stats bar — 4 indicateurs honnêtes */}
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

      {/* §1 LE CONSTAT — pains + data-strip + quote-conclusion */}
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

          {/* Data-strip — 60-90 min + 17 chirurgiens */}
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

          <p className="mx-auto mt-12 max-w-3xl text-center font-display text-[1.5rem] italic leading-snug tracking-[-0.02em] text-navy-900 sm:text-[1.85rem]">
            Le post-op n&apos;est pas un problème médical.
            <br />
            C&apos;est un problème opérationnel.
          </p>
        </div>
      </section>

      {/* §1bis — Card Sans/Avec MOBILE */}
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
          §2 COMMENT ÇA MARCHE — timeline cabinet J-7 / J+1 / J+30.
          Re-écriture côté cabinet (jamais parcours patient → secret
          médical). Pattern Curecall / Resilience.
          ============================================================ */}
      <section
        id="fonctionnement"
        className="border-t border-navy-900/[0.06] bg-ivory reveal-target"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
              Comment ça marche, côté cabinet
            </p>
            <h2 className="mt-3 font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.025em] text-navy-900 sm:text-[2.3rem]">
              Trois jalons. Pas de logiciel à apprendre.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-charcoal/70">
              Votre référentiel est intégré une fois. Le service opère ensuite
              sur tous vos patients post-op.
            </p>
          </div>

          {/* Timeline cabinet — 3 jalons */}
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {timeline.map((s) => (
              <li
                key={s.n}
                className="rounded-2xl bg-white p-7 shadow-card ring-1 ring-navy-900/[0.05] hover-lift"
              >
                <span className="inline-flex rounded-md bg-teal-500/15 px-2.5 py-1 font-display text-[12.5px] font-semibold tracking-[0.04em] text-teal-700">
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

      {/* §4 DIFFÉRENCIATION */}
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
          §5 CADRE & SÉCURITÉ — section dédiée full-width, style Mercury.
          Le compliance comme feature, pas comme footer.
          Pattern Mercury / Vercel /enterprise / Doctolib.
          ============================================================ */}
      <section id="cadre" className="relative border-t border-navy-900/[0.06] bg-navy-900 text-white reveal-target">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-300">
              Cadre &amp; sécurité
            </p>
            <h2 className="mt-3 font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.025em] text-white sm:text-[2.3rem]">
              Le cabinet structuré. Le chirurgien protégé.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-navy-100/75">
              HDS / RGPD / CNIL dès la conception. Données hébergées en
              Europe. Société française. Supervision spécialisée formée
              au cadre KOVELA.
            </p>
          </div>

          {/* Badges row prominents — style Mercury security */}
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {trustLogosAcq.map(({ Logo, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-2xl bg-white p-4 text-center ring-1 ring-white/15"
              >
                <Logo />
                <p className="mt-3 text-[10.5px] tracking-tight text-charcoal/65">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* 3 piliers re-angle chirurgien */}
          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {piliers.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 hover-lift"
              >
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                  {p.eyebrow}
                </p>
                <h3 className="mt-2.5 font-display text-[15px] font-semibold tracking-tight text-white">
                  {p.title}
                </h3>
                <ul className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-navy-100/75">
                  {p.items.map((it) => (
                    <li key={it}>— {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-3xl text-center font-display text-[1.15rem] italic leading-relaxed tracking-tight text-navy-100/85">
            KOVELA ne remplace pas le chirurgien. KOVELA structure, documente
            et transmet.
          </p>
        </div>
      </section>

      {/* ============================================================
          §6 FAQ — Q Ordre des médecins non-négociable + 5 autres.
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
          §7 CTA + FORM — promesse Adrien sous 24h + canaux directs.
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
              Vingt minutes pour vérifier si KOVELA correspond à votre cabinet.
            </h2>

            {/* Promesse forte post-submit — substitue Calendly */}
            <div className="mt-6 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                Ce qui se passe après votre demande
              </p>
              <ul className="mt-3 space-y-2 text-[13.5px] leading-relaxed text-navy-100/85">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  Adrien Lhabouz, fondateur, vous répond personnellement
                  sous 24h ouvrées.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  Échange de 20 min pour valider l&apos;adéquation à votre
                  volume, votre organisation, votre cadre.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  Si pertinent : passage en phase pilote sous 2 à 4 semaines.
                </li>
              </ul>
            </div>

            {/* Canaux directs visibles — pas que le form */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] tracking-tight">
              <a
                href="mailto:contact@kovela.care"
                className="font-medium text-teal-300 hover:text-teal-200"
              >
                contact@kovela.care
              </a>
              <span className="text-navy-100/45">·</span>
              <Link
                href="/"
                className="font-medium text-teal-300 hover:text-teal-200"
              >
                Landing institutionnelle →
              </Link>
            </div>

            <p className="mt-7 text-[10.5px] leading-relaxed tracking-tight text-navy-100/50">
              KOVELA ne remplace pas le chirurgien, ne pose pas de diagnostic,
              ne prescrit pas et ne prend aucune décision médicale. En cas de
              situation urgente ou de doute important, le patient doit
              contacter le 15 / 112, les urgences de la clinique ou suivre les
              consignes remises par son chirurgien.
            </p>
          </div>

          <div>
            <LeadForm ctaLabel={CTA_PRIMARY} />
          </div>
        </div>
      </section>

      {/* Footer 4 cols */}
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
                <li><a href="#cadre" className="hover:text-white">Cadre &amp; sécurité</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                <li><Link href="/" className="hover:text-white">Landing institutionnelle →</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                Cabinet
              </p>
              <ul className="mt-3 space-y-2 text-[12px] tracking-tight text-navy-100/70">
                <li><a href="#contact" className="hover:text-white">Réserver 20 minutes</a></li>
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

      {/* Sticky bottom CTA mobile */}
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
