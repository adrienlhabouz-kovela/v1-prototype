import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/Brand";
import {
  IconCircleCheck,
  IconCircleX,
  IconShield,
  IconSilence,
  IconTarget,
  IconTrend,
  CompliancePills,
  trustLogos,
} from "@/components/landing-shared";
import { RevealObserver } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";

const DEMO = "mailto:contact@kovela.care?subject=Demande%20d%27%C3%A9change%20op%C3%A9rationnel%20KOVELA";
const PILOT = "mailto:contact@kovela.care?subject=Discuter%20du%20pilote%20KOVELA";
const CTA_DEMO_LABEL = "Demander un échange opérationnel";




// ─── Données hero — bloc comparatif & barre de preuves ────────────────────
const beforeKovela = [
  "Suivi dispersé (téléphone, emails)",
  "Perte d'informations et oublis",
  "Charge admin chronophage",
  "Satisfaction patient variable",
];

const withKovela = [
  "Parcours structuré et centralisé",
  "Traçabilité complète et sécurisée",
  "Temps médical recentré",
  "Expérience patient premium",
];

const heroStats: { icon: React.ReactNode; value: string; label: string }[] = [
  { icon: <IconTarget className="h-[26px] w-[26px]" />, value: "100%", label: "Traçabilité" },
  { icon: <IconSilence className="h-[26px] w-[26px]" />, value: "Zéro bruit", label: "Patient" },
  { icon: <IconTrend className="h-[26px] w-[26px]" />, value: "+30%", label: "Satisfaction patient" },
  { icon: <IconShield className="h-[26px] w-[26px]" />, value: "Sécurisé", label: "HDS + RGPD" },
];

const pains = [
  { t: "Messages dispersés", d: "WhatsApp, appels, SMS, emails, secrétariat : les échanges patients arrivent partout, sans fil conducteur." },
  { t: "Charge cabinet", d: "Relances manuelles, photos à classer, doutes à apaiser. Le cabinet absorbe le bruit." },
  { t: "Sollicitations non structurées", d: "Le chirurgien est sollicité trop tôt, trop tard, ou sans dossier structuré." },
  { t: "Historique éclaté", d: "La responsabilité reste au chirurgien, mais l'historique se reconstitue entre canaux." },
];

const solutions = [
  { t: "Référentiel chirurgien", d: "Vos règles de suivi sont formalisées avec KOVELA. Le service applique votre cadre." },
  { t: "Supervision humaine", d: "Une équipe spécialisée suit les patients selon le référentiel cabinet." },
  { t: "IA assistive", d: "L'IA prépare, résume, structure. La superviseuse valide. Le chirurgien décide." },
  { t: "CR factuels", d: "Le chirurgien accède à une synthèse claire, factuelle, validée KOVELA." },
  { t: "Transmission cabinet", d: "Le cabinet est sollicité au bon moment, avec les bons éléments." },
];

const steps = [
  { t: "Mise en place initiale", d: "15 min pour cadrer le cabinet, les contacts et les règles de base." },
  { t: "Référentiel essentiel", d: "30–60 min avec KOVELA pour cadrer 2 ou 3 interventions prioritaires." },
  { t: "Onboarding patient", d: "Le patient est intégré au suivi, sans donnée médicale inutile." },
  { t: "Suivi opéré", d: "KOVELA suit, documente, relance et transmet selon les règles définies." },
  { t: "CR factuel", d: "L'IA prépare, la superviseuse valide, le CR devient disponible chirurgien." },
];

const aiDoes = [
  "Prépare les brouillons de CR",
  "Résume les échanges patient",
  "Reformule des réponses non médicales",
  "Compile factuellement une transmission cabinet",
  "Signale les actions opérationnelles à traiter",
];

const aiDoesNever = [
  "Pas de réponse autonome au patient",
  "Pas d'avis médical, pas de diagnostic",
  "Pas d'interprétation des photos",
  "Pas de transmission cabinet sans validation humaine",
  "Pas d'évaluation chiffrée du patient",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">{children}</p>;
}

export default function LandingPreviewAlpha() {
  return (
    <div className="bg-white pb-20 text-navy-900 md:pb-0">
      {/* ALPHA-5 — Sticky scroll progress bar tout en haut. */}
      <ScrollProgress />
      {/* ALPHA-3 — Observer global qui anime les sections marquées
          .reveal-target à leur apparition dans le viewport. */}
      <RevealObserver />

      {/* Header — barre navy pleine largeur, version compacte.
          - lg+ : wordmark + nav + lien prototype + CTA teal.
          - < lg : wordmark + hamburger (<details>) qui ouvre le menu.
            Le CTA de header est retiré sur mobile car la sticky bar
            en bas porte déjà l'action principale. */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-navy-900/95 backdrop-blur-md">
        <div className="flex items-center justify-between gap-6 px-6 py-2.5 lg:px-10 xl:px-16">
          <Wordmark light compact />
          <nav className="hidden items-center gap-8 text-[12.5px] tracking-tight text-navy-100/75 lg:flex">
            <a href="#probleme" className="transition-colors hover:text-white">Le constat</a>
            <a href="#solution" className="transition-colors hover:text-white">La solution</a>
            <a href="#etapes" className="transition-colors hover:text-white">Fonctionnement</a>
            <a href="#cadre" className="transition-colors hover:text-white">Cadre KOVELA</a>
            <a href="#modele" className="transition-colors hover:text-white">Tarifs</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-[12.5px] font-medium text-navy-100/80 transition-colors hover:text-white lg:block"
            >
              Voir le prototype
            </Link>
            <a
              href={DEMO}
              className="hidden rounded-lg bg-teal-500 px-3.5 py-1.5 text-[12.5px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-teal-600 lg:inline-flex"
            >
              {CTA_DEMO_LABEL}
            </a>

            {/* Hamburger menu — mobile/tablette uniquement, <lg.
                <details> natif : pas d'état React, accessible clavier,
                close au tap d'un lien (navigation). */}
            <details className="relative lg:hidden">
              <summary
                aria-label="Ouvrir le menu"
                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 [&::-webkit-details-marker]:hidden"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </summary>
              <nav className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg border border-navy-900/[0.08] bg-white py-1 shadow-lift">
                {[
                  { label: "Le constat", href: "#probleme" },
                  { label: "La solution", href: "#solution" },
                  { label: "Fonctionnement", href: "#etapes" },
                  { label: "Cadre KOVELA", href: "#cadre" },
                  { label: "Tarifs", href: "#modele" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 text-[14px] tracking-tight text-navy-900 transition-colors hover:bg-ivory"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="my-1 border-t border-navy-900/[0.06]" />
                <Link
                  href="/login"
                  className="block px-4 py-2.5 text-[14px] tracking-tight text-charcoal/65 transition-colors hover:bg-ivory"
                >
                  Voir le prototype
                </Link>
              </nav>
            </details>
          </div>
        </div>
      </header>

      {/* ============================================================
          Section A — Hero split : contenu gauche + photo droite
          ALPHA-7 : décorations gradient mesh subtil derrière le hero.
          ============================================================ */}
      <section className="relative overflow-hidden bg-white">
        {/* Gradient mesh decorations — blobs floutés ultra-discrets */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-teal-400/[0.08] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/4 top-1/3 hidden h-[20rem] w-[20rem] rounded-full bg-amber-200/[0.10] blur-3xl lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 hidden h-[18rem] w-[18rem] rounded-full bg-teal-300/[0.08] blur-3xl lg:block"
        />

        <div className="relative grid lg:grid-cols-2">
          {/* Colonne gauche — promesse + comparatif. ALPHA-6 : padding top
              plus généreux desktop. */}
          <div className="flex items-start px-5 pt-10 pb-7 sm:px-10 sm:pt-14 sm:pb-8 lg:px-10 lg:pt-20 lg:pb-8 xl:px-16 xl:pt-28 xl:pb-8">
            <div className="w-full max-w-[680px]">
              {/* Eyebrow + filet */}
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Coordination post-opératoire
                </p>
                <span className="h-px w-14 bg-teal-500/40" />
              </div>

              <h1 className="mt-6 font-display text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.035em] text-navy-900 sm:mt-7 sm:text-balance sm:text-[2.4rem] sm:leading-[1.04] lg:text-[3.1rem] lg:tracking-[-0.045em] xl:text-[3.75rem] xl:leading-[1.02] 2xl:text-[4.25rem]">
                KOVELA fait disparaître le bruit post-op du quotidien du
                cabinet.
              </h1>

              <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-charcoal/70">
                Un suivi post-op structuré. Des chirurgiens libérés du bruit.
              </p>

              {/* CTAs — sur mobile, on garde uniquement le secondaire
                  "Voir le fonctionnement" : le CTA primaire est porté
                  par la sticky bottom bar et serait redondant ici. À
                  partir de sm+, les 2 CTAs réapparaissent inline. */}
              <div className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <a
                  href={DEMO}
                  className="hidden rounded-lg bg-navy-900 px-6 py-3 text-center text-[13.5px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800 sm:inline-flex"
                >
                  Réserver un call de 20 min
                </a>
                <a
                  href="#etapes"
                  className="rounded-lg bg-white px-6 py-3 text-center text-[13.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-ivory"
                >
                  Voir le fonctionnement
                </a>
              </div>

              {/* Conformité réglementaire — intégrée au hero, juste sous
                  les CTAs, registre Apple/Stripe discret. */}
              <div className="mt-5">
                <CompliancePills />
              </div>

              {/* ============================================================
                  Card Avant / Avec KOVELA
                  --------------------------------------------------------------
                  Mobile (< sm) : 2 cartes empilées visuellement contrastées
                    (rouge léger pour Avant, teal léger pour Avec) avec un
                    pastille "VS" centrée entre les deux. Pattern Apple :
                    contraste immédiat sans interaction.
                  Desktop (sm+) : carte unifiée à 2 colonnes avec VS badge
                    sur le séparateur — inchangée.
                  ============================================================ */}

              {/* === MOBILE (< sm) — Option A === */}
              <div className="mt-7 space-y-3 sm:hidden">
                {/* Avant KOVELA — bg rouge léger */}
                <div className="rounded-2xl bg-[#FDF4F2] p-5 ring-1 ring-[#D24B3E]/15">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#D24B3E]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#D24B3E]">
                      Avant
                    </span>
                    <h3 className="font-display text-[16.5px] font-semibold tracking-tight text-navy-900">
                      KOVELA
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-2.5">
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
                    Coût caché élevé
                  </p>
                </div>

                {/* Séparateur VS rond centré */}
                <div className="flex items-center justify-center">
                  <span className="-my-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[10px] font-semibold uppercase tracking-wide text-teal-700 shadow-card ring-4 ring-white">
                    VS
                  </span>
                </div>

                {/* Avec KOVELA — bg teal léger */}
                <div className="rounded-2xl bg-[#EAF7F4] p-5 ring-1 ring-teal-500/20">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-teal-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
                      Avec
                    </span>
                    <h3 className="font-display text-[16.5px] font-semibold tracking-tight text-navy-900">
                      KOVELA
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-2.5">
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
                    ROI rapide et mesurable
                  </p>
                </div>
              </div>

              {/* === DESKTOP (sm+) — Carte unifiée actuelle inchangée === */}
              <div className="relative mt-7 hidden rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-900/[0.05] sm:block sm:p-6">
                {/* Badge VS sur le séparateur */}
                <div className="pointer-events-none absolute left-1/2 top-[22px] z-10 -translate-x-1/2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-[10px] font-semibold uppercase tracking-wide text-teal-700 ring-4 ring-white">
                    VS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-0">
                  {/* Avant KOVELA */}
                  <div className="pr-6">
                    <h3 className="font-display text-[16.5px] font-medium tracking-tight text-navy-900">
                      Avant KOVELA
                    </h3>
                    <ul className="mt-3.5 space-y-2">
                      {beforeKovela.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2 text-[12.5px] leading-snug text-charcoal/75"
                        >
                          <IconCircleX className="mt-px h-[15px] w-[15px] shrink-0 text-[#D24B3E]" />
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[13px] font-semibold tracking-tight text-[#D24B3E]">
                      Coût caché élevé
                    </p>
                  </div>

                  {/* Avec KOVELA */}
                  <div className="border-l border-navy-900/[0.07] pl-6">
                    <h3 className="font-display text-[16.5px] font-medium tracking-tight text-navy-900">
                      Avec KOVELA
                    </h3>
                    <ul className="mt-3.5 space-y-2">
                      {withKovela.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2 text-[12.5px] leading-snug text-navy-900"
                        >
                          <IconCircleCheck className="mt-px h-[15px] w-[15px] shrink-0 text-teal-500" />
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[13px] font-semibold tracking-tight text-teal-600">
                      ROI rapide et mesurable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite — photo hero.
              Sources empilées : WebP en priorité, puis JPG (si déposé
              plus tard), puis gradient crème en filet de sécurité. */}
          <div
            className="relative min-h-[220px] lg:min-h-[480px]"
            style={{
              backgroundImage:
                "url('/hero-consultation.webp'), url('/hero-consultation.jpg'), linear-gradient(135deg, #FAF8F4 0%, #F4F1EC 50%, #F1EBE0 100%)",
              backgroundSize: "cover, cover, cover",
              backgroundPosition: "center, center, center",
              backgroundRepeat: "no-repeat, no-repeat, no-repeat",
            }}
            role="img"
            aria-label="Chirurgien en consultation post-opératoire avec une patiente"
          >
            {/* Voile teal quasi invisible — n'altère pas le rendu photo. */}
            <div className="pointer-events-none absolute inset-0 bg-teal-sheen opacity-20" />
          </div>
        </div>
      </section>

      {/* Barre de preuves — 4 indicateurs */}
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
            Le suivi post-opératoire repensé pour les{" "}
            <span className="font-medium text-teal-600">
              chirurgiens exigeants
            </span>
            .
          </p>
        </div>
      </section>

      {/* Section B — Problème cabinet */}
      <section id="probleme" className="mx-auto max-w-6xl px-6 py-14 reveal-target">
        <Eyebrow>Le constat</Eyebrow>
        <h2 className="max-w-2xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
          Après l&apos;intervention, tout repose encore trop souvent sur la disponibilité du cabinet.
        </h2>
        <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-charcoal/65">
          Le post-op vit entre canaux dispersés, relances manuelles et
          historiques éclatés. Une photo arrive par message, une question suit
          deux heures plus tard, puis il faut reconstituer le contexte.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map((p) => (
            <div
              key={p.t}
              className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045] hover-lift"
            >
              <div className="mb-4 h-px w-7 bg-teal-500/70" />
              <h3 className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                {p.t}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-charcoal/60">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section C — Solution KOVELA · 5 piliers */}
      <section id="solution" className="border-y border-navy-900/[0.06] bg-white reveal-target">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Eyebrow>La solution KOVELA</Eyebrow>
          <h2 className="max-w-3xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
            Le flux opérationnel est pris en charge — humain et IA, encadrés par votre référentiel.
          </h2>
          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {solutions.map((p, i) => (
              <div
                key={p.t}
                className="rounded-2xl bg-ivory p-6 ring-1 ring-navy-900/[0.05] hover-lift"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-900 font-display text-[12px] font-medium text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-[14px] font-semibold tracking-tight text-navy-900">
                  {p.t}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-charcoal/60">{p.d}</p>
              </div>
            ))}
          </div>
          <blockquote className="mt-10 rounded-2xl border-l-2 border-teal-500/80 bg-ivory p-7">
            <p className="font-display text-[16.5px] leading-relaxed tracking-tight text-navy-900 md:text-[18px]">
              KOVELA n&apos;est pas un logiciel que le chirurgien doit gérer. C&apos;est un{" "}
              <span className="font-semibold">service opéré</span> qui structure le suivi
              post-opératoire pour son cabinet, avec une équipe de supervision humaine spécialisée
              et une IA assistive interne.
            </p>
          </blockquote>
          <p className="mt-8 font-display text-[24px] italic leading-tight tracking-[-0.01em] text-navy-900">
            Le patient se sent accompagné. Le cabinet respire.
          </p>
        </div>
      </section>

      {/* Section E — Baseline terrain (douleur opérationnelle mesurable) */}
      <section className="border-y border-navy-900/[0.06] bg-white reveal-target">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <Eyebrow>Une douleur opérationnelle mesurable</Eyebrow>
          <h2 className="max-w-3xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
            60 à 90 minutes de travail humain par patient, sur 3 à 15 jours.
          </h2>
          <p className="mt-5 max-w-3xl text-[14.5px] leading-relaxed text-charcoal/70">
            En suivi manuel (WhatsApp, audio, SMS), un patient post-op représente
            généralement{" "}
            <span className="font-medium text-navy-900">60 à 90 minutes</span> de
            travail humain sur{" "}
            <span className="font-medium text-navy-900">3 à 15 jours</span>.
            KOVELA structure ce temps : référentiel cabinet, supervision humaine,
            CR factuels.
          </p>
          <p className="mt-5 max-w-3xl rounded-md bg-ivory px-3 py-2 text-[11.5px] leading-relaxed text-charcoal/60 ring-1 ring-navy-900/[0.04]">
            Baseline terrain — à mesurer et affiner en pilote KOVELA. Aucun gain chiffré n&apos;est
            promis à ce stade.
          </p>
        </div>
      </section>

      {/* Bande preuve terrain — prudente, non chiffrée, non datée. */}
      <section className="border-b border-navy-900/[0.06] bg-ivory reveal-target">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <p className="text-[12.5px] leading-relaxed text-charcoal/65">
            <span className="font-semibold text-navy-900">Construit à partir de retours terrain</span>
            {" "}de chirurgiens esthétiques et d&apos;une expérience opérationnelle post-opératoire
            manuelle.
          </p>
        </div>
      </section>

      {/* Section F — Comment ça marche */}
      <section id="etapes" className="mx-auto max-w-6xl px-6 py-14 reveal-target">
        <Eyebrow>Comment ça marche</Eyebrow>
        <h2 className="font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
          De la mise en place au CR disponible chirurgien, en cinq étapes.
        </h2>
        <ol className="mt-10 grid gap-3 md:grid-cols-5">
          {steps.map((s, i) => (
            <li
              key={s.t}
              className="relative rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]"
            >
              <span className="font-display text-[26px] font-medium leading-none tracking-tight text-teal-600/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-[13.5px] font-semibold tracking-tight text-navy-900">
                {s.t}
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-charcoal/60">{s.d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-[12.5px] leading-relaxed text-charcoal/55">
          Démarrage accompagné par l&apos;équipe KOVELA. Référentiel relu avant
          tout usage opérationnel. Lien patient sécurisé, sans application à
          télécharger.
        </p>
      </section>

      {/* Section G — IA assistive (compactée, objection chirurgien préservée) */}
      <section id="ia" className="bg-navy-depth text-white reveal-target">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <Eyebrow>
            <span className="text-teal-300/90">IA assistive · jamais autonome</span>
          </Eyebrow>
          <h2 className="max-w-2xl font-sans text-[1.8rem] font-semibold leading-tight tracking-[-0.022em] text-white md:text-[2.1rem]">
            L&apos;IA aide l&apos;équipe. Elle ne décide jamais.
          </h2>

          {/* Mobile (< md) : panneau unifié compact, listes serrées,
              séparateur fin entre les deux sections. Aucune perte de
              contenu (5 items "fait" + 5 items "ne fait jamais"). */}
          <div className="mt-7 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08] md:hidden">
            <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-teal-300/90">
              L&apos;IA KOVELA fait
            </h3>
            <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-navy-100/85">
              {aiDoes.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <span className="mt-[7px] h-1 w-2.5 shrink-0 bg-teal-400/70" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>

            <div className="my-4 h-px w-full bg-white/[0.08]" />

            <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-navy-100/70">
              L&apos;IA KOVELA ne fait jamais
            </h3>
            <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-navy-100/70">
              {aiDoesNever.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <span className="mt-[7px] h-1 w-2.5 shrink-0 bg-navy-100/30" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop (md+) : 2 cartes côte à côte, inchangé. */}
          <div className="mt-8 hidden gap-3 md:grid md:grid-cols-2">
            <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08]">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300/90">
                L&apos;IA KOVELA fait
              </h3>
              <ul className="mt-3.5 space-y-2 text-[13px] leading-relaxed text-navy-100/85">
                {aiDoes.map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-[7px] h-1 w-3 shrink-0 bg-teal-400/70" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08]">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-100/70">
                L&apos;IA KOVELA ne fait jamais
              </h3>
              <ul className="mt-3.5 space-y-2 text-[13px] leading-relaxed text-navy-100/70">
                {aiDoesNever.map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-[7px] h-1 w-3 shrink-0 bg-navy-100/30" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 font-display text-[20px] italic leading-tight tracking-[-0.01em] text-teal-200/85">
            L&apos;IA prépare. L&apos;humain valide. Le chirurgien décide.
          </p>
        </div>
      </section>

      {/* Section H — Cadre opérationnel KOVELA · architecture de confiance */}
      <section id="cadre" className="border-y border-navy-900/[0.06] bg-white reveal-target">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            <BrandMark size={44} className="shrink-0 text-navy-900" />
            <div>
              <Eyebrow>Cadre opérationnel KOVELA</Eyebrow>
              <h2 className="max-w-3xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
                Un cadre clair pour suivre, documenter et transmettre — sans remplacer le chirurgien.
              </h2>
              <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-charcoal/70">
                <span className="font-semibold text-navy-900">HDS / RGPD dès la conception.</span>{" "}
                Consentement patient, traçabilité des actions, séparation
                stricte des rôles, documentation RGPD. Site public hors HDS,
                application métier pensée pour HDS dès le premier jour.
              </p>

              {/* 3 piliers : Humain · IA encadrée · Traçabilité */}
              <div className="mt-10 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045] hover-lift">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-700">
                    Humain
                  </p>
                  <h3 className="mt-2.5 font-display text-[14.5px] font-semibold tracking-tight text-navy-900">
                    Supervision spécialisée
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-charcoal/70">
                    <li>— Équipe de superviseurs formée</li>
                    <li>— Validation humaine de chaque CR</li>
                    <li>— Head of Care · revue qualité continue</li>
                    <li>— Aucune décision médicale prise par KOVELA</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045] hover-lift">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-700">
                    IA encadrée
                  </p>
                  <h3 className="mt-2.5 font-display text-[14.5px] font-semibold tracking-tight text-navy-900">
                    Assistive · jamais autonome
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-charcoal/70">
                    <li>— Brouillons IA uniquement</li>
                    <li>— Aucune réponse IA autonome au patient</li>
                    <li>— Garde-fous de formulation (MedicalGuard)</li>
                    <li>— Désactivable et loggée</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045] hover-lift">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-700">
                    Traçabilité
                  </p>
                  <h3 className="mt-2.5 font-display text-[14.5px] font-semibold tracking-tight text-navy-900">
                    Référentiel · CR · transmissions
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-charcoal/70">
                    <li>— Référentiel cabinet relu KOVELA</li>
                    <li>— Comptes-rendus factuels validés</li>
                    <li>— Transmissions cabinet validées avant envoi</li>
                    <li>— Logs et historique d&apos;actions</li>
                  </ul>
                </div>
              </div>

              {/* Qui supervise — profils terrain senior, non médicaux. Répond à
                  l'objection chirurgien : qui lit mes patients et quel est leur niveau.
                  Wording condensé : 2 paragraphes courts + 1 note horaires courte. */}
              <div className="mt-8 rounded-2xl bg-ivory px-5 py-5 ring-1 ring-navy-900/[0.05]">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                  Qui supervise ?
                </p>
                <p className="mt-2 font-sans text-[16px] font-semibold tracking-tight text-navy-900">
                  Une supervision issue du terrain.
                </p>
                <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-navy-900">
                  Profils senior issus du bloc, du cabinet ou du suivi patient —
                  aides opératoires, infirmières, coordinatrices — formés au
                  référentiel KOVELA. Ils structurent et documentent, sans
                  diagnostiquer, prescrire ni interpréter.
                </p>
                <p className="mt-3 max-w-3xl rounded-md bg-white/60 px-3 py-2 text-[12px] leading-relaxed text-charcoal/70 ring-1 ring-navy-900/[0.04]">
                  <span className="font-medium text-navy-900">Horaires du service.</span>{" "}
                  Plage opérée définie avec le cabinet (par ex. 8h–20h). Hors
                  horaires : messages conservés, situations urgentes orientées
                  vers les contacts définis par le chirurgien.
                </p>
              </div>

              {/* Phrase doctrine */}
              <p className="mt-8 max-w-3xl font-display text-[20px] italic leading-relaxed tracking-tight text-navy-900">
                KOVELA ne remplace pas le chirurgien. KOVELA structure, documente et transmet.
              </p>

              {/* Trust logos — visuels concrets des certifications/conformités
                  visées par l'architecture KOVELA. */}
              <div className="mt-8 rounded-2xl border border-navy-900/[0.06] bg-white p-7">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Certifications &amp; conformités visées
                </p>
                <div className="mt-6 grid grid-cols-2 items-start gap-x-6 gap-y-7 sm:grid-cols-4">
                  {trustLogos.map(({ Logo, label }) => (
                    <div key={label} className="flex flex-col items-center text-center">
                      <Logo />
                      <p className="mt-3 text-[11px] tracking-tight text-charcoal/55">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Ibis — Un projet construit sur le terrain · 3 cards (Doctrine fondue dans §G/§H) */}
      <section className="mx-auto max-w-6xl px-6 py-12 reveal-target">
        <Eyebrow>Un projet construit sur le terrain</Eyebrow>
        <h2 className="max-w-3xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
          Qui porte KOVELA, et comment.
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Fondateur */}
          <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045] hover-lift">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Fondateur
            </p>
            <h3 className="mt-2.5 font-display text-[14px] font-semibold tracking-tight text-navy-900">
              Une culture de structuration et de risque
            </h3>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-charcoal/65">
              KOVELA est porté par Adrien Lhabouz, entrepreneur et cofondateur de Trecento Asset
              Management, avec une culture d&apos;investissement et d&apos;analyse du risque.
            </p>
          </div>

          {/* Chirurgiens */}
          <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045] hover-lift">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Chirurgiens
            </p>
            <h3 className="mt-2.5 font-display text-[14px] font-semibold tracking-tight text-navy-900">
              Conçu à partir de retours terrain
            </h3>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-charcoal/65">
              Le service est construit à partir de retours terrain de chirurgiens esthétiques
              privés et d&apos;années d&apos;expérience cabinet.
            </p>
          </div>

          {/* Produit */}
          <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045] hover-lift">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Produit
            </p>
            <h3 className="mt-2.5 font-display text-[14px] font-semibold tracking-tight text-navy-900">
              Plateforme déjà démontrable
            </h3>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-charcoal/65">
              Plateforme complète : activation cabinet, parcours chirurgien, espace superviseur,
              suivi patient, workflow CR et cockpit admin opérationnels.
            </p>
          </div>
        </div>

        {/* Preuve d'exécution sobre */}
        <p className="mt-10 max-w-3xl rounded-md bg-ivory px-3 py-2 text-[11.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
          <span className="font-medium text-navy-900">Preuve d&apos;exécution :</span> produit
          fonctionnel · activation cabinet · parcours chirurgien · espace superviseur ·
          suivi patient · workflow CR · cockpit admin.
        </p>
      </section>

      {/* Section I — Tarification · Moins qu'un mi-temps. Plus qu'un outil. */}
      <section id="modele" className="mx-auto max-w-6xl px-6 py-14 reveal-target">
        <Eyebrow>Tarification</Eyebrow>
        <h2 className="max-w-3xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
          Moins qu&apos;un mi-temps. Plus qu&apos;un outil.
        </h2>
        <p className="mt-5 max-w-3xl text-[14.5px] leading-relaxed text-charcoal/70">
          Accès à une organisation post-op structurée, sans créer un poste
          supplémentaire dans le cabinet.
        </p>

        {/* Card pricing — fixe (5 patients inclus) + variable (au-delà) */}
        <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy-900/[0.06] hover-lift">
          <div className="flex flex-wrap items-center gap-2 border-b border-navy-900/[0.05] bg-ivory px-7 py-4">
            <span className="rounded-md bg-navy-900 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white">
              Offre pilote
            </span>
            {["Accès service", "5 patients inclus", "Usage réel", "Service opéré"].map((b) => (
              <span
                key={b}
                className="rounded-md bg-white px-2.5 py-1 text-[10.5px] font-medium tracking-tight text-navy-700 ring-1 ring-navy-100"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="grid items-stretch md:grid-cols-[1fr_auto_1fr]">
            {/* Bloc fixe — accès mensuel + 5 patients inclus */}
            <div className="px-7 py-10 md:py-12">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                Accès mensuel au service
              </p>
              <p className="mt-4 font-display text-[2.6rem] font-medium leading-none tracking-tight text-navy-900 md:text-[3rem]">
                690 €{" "}
                <span className="text-[14px] font-normal text-charcoal/55">HT / mois</span>
              </p>
              <p className="mt-3 text-[12.5px] font-medium tracking-tight text-teal-700">
                Inclut jusqu&apos;à 5 patients activés par mois.
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] leading-relaxed text-charcoal/70">
                <li>
                  Accès mensuel au service KOVELA, incluant les 5 premiers
                  patients activés chaque mois.
                </li>
                <li>Facturé le 1er du mois.</li>
              </ul>
            </div>

            {/* Séparateur + */}
            <div className="flex items-center justify-center border-t border-navy-900/[0.05] md:border-l md:border-t-0 md:border-navy-900/[0.05] md:px-2">
              <span className="font-display text-[28px] font-light leading-none text-charcoal/35 md:text-[40px]">
                +
              </span>
            </div>

            {/* Bloc variable — au-delà des 5 patients inclus */}
            <div className="border-t border-navy-900/[0.05] px-7 py-10 md:border-l md:border-t-0 md:py-12">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                Au-delà des 5 patients inclus
              </p>
              <p className="mt-4 font-display text-[2.6rem] font-medium leading-none tracking-tight text-navy-900 md:text-[3rem]">
                80 €{" "}
                <span className="text-[14px] font-normal text-charcoal/55">
                  HT / patient activé
                </span>
              </p>
              <p className="mt-3 text-[12.5px] font-medium tracking-tight text-teal-700">
                À partir du 6e patient activé du mois.
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] leading-relaxed text-charcoal/70">
                <li>
                  Au-delà : 80 € HT par patient activé supplémentaire,
                  facturé en fin de mois selon l&apos;usage réel.
                </li>
                <li>Patient activé : onboarding validé + suivi lancé.</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-navy-900/[0.05] bg-ivory px-7 py-5">
            <p className="font-display text-[15.5px] italic leading-relaxed tracking-tight text-navy-900 md:text-[17px]">
              5 patients inclus chaque mois. Au-delà, vous ne payez que l&apos;usage réel.
            </p>
          </div>
        </div>

        {/* 2 colonnes bénéfices : Ce que le cabinet évite · Ce que KOVELA apporte */}
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-ivory p-7 ring-1 ring-navy-900/[0.05] hover-lift">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Ce que le cabinet évite
            </p>
            <ul className="mt-5 space-y-2 text-[13px] leading-relaxed text-charcoal/70">
              {[
                "Recherche de profil",
                "Recrutement",
                "Formation initiale et montée en compétence",
                "Congés, absences et indisponibilités",
                "Remplacement",
                "Management quotidien",
                "Coût fixe déconnecté du volume patient",
              ].map((it) => (
                <li key={it} className="flex gap-3">
                  <span className="mt-[7px] h-1 w-3 shrink-0 bg-navy-900/30" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-7 shadow-card ring-1 ring-navy-900/[0.045] hover-lift">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-700">
              Ce que KOVELA apporte
            </p>
            <ul className="mt-5 space-y-2 text-[13px] leading-relaxed text-navy-900">
              {[
                "Référentiel cabinet",
                "Supervision humaine",
                "Messages programmés",
                "Transmissions cabinet",
                "Comptes-rendus factuels",
                "Interface chirurgien",
                "Service structuré toute l'année",
                "Expérience patient mieux structurée",
                "Chirurgien sollicité au bon moment, avec un dossier clair",
              ].map((it) => (
                <li key={it} className="flex gap-3">
                  <span className="mt-[7px] h-1 w-3 shrink-0 bg-teal-500/70" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-[11.5px] leading-relaxed text-charcoal/55">
          Conditions pilotes ajustables selon volume patient, niveau
          d&apos;accompagnement et configuration du cabinet.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <a
            href={DEMO}
            className="rounded-lg bg-navy-900 px-6 py-3 text-[13.5px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
          >
            Demander un échange opérationnel
          </a>
          <a
            href={PILOT}
            className="rounded-lg bg-white px-6 py-3 text-[13.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-ivory"
          >
            Discuter du pilote
          </a>
        </div>
      </section>

      {/* Section J — CTA final.
          Masquée < md : la sticky bottom bar mobile porte déjà l'action,
          ce bandeau navy serait redondant. Réapparaît dès md+ où la
          sticky bar est masquée (md:hidden côté sticky bar). */}
      <section className="hidden bg-navy-depth text-white md:block reveal-target">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] md:text-[2.4rem]">
            Structurer le suivi post-opératoire de votre cabinet.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[14.5px] leading-relaxed text-navy-100/75">
            Démarrage progressif sur 2 ou 3 interventions prioritaires, avec accompagnement KOVELA.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            <a
              href={DEMO}
              className="rounded-lg bg-white px-6 py-3 text-[13.5px] font-medium tracking-tight text-navy-900 shadow-soft transition-colors hover:bg-ivory"
            >
              Demander un échange opérationnel
            </a>
            <Link
              href="/chirurgien"
              className="rounded-lg bg-white/[0.05] px-6 py-3 text-[13.5px] font-medium tracking-tight text-white ring-1 ring-white/15 transition-colors hover:bg-white/[0.1]"
            >
              Voir le parcours chirurgien
            </Link>
          </div>
        </div>
      </section>

      {/* ALPHA-4 — Footer enrichi 4 colonnes : Produit · Ressources ·
          Légal · Contact, plus ligne basse copyright/SIRET/locale. */}
      <footer className="bg-navy-950 text-navy-100/55">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-8 sm:px-10">
          {/* Grid 4 colonnes (1 col + 4 col à partir de sm) */}
          <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
            {/* Colonne 1 — brand + tagline */}
            <div>
              <Wordmark light compact />
              <p className="mt-4 max-w-[16rem] text-[12.5px] leading-relaxed text-navy-100/50">
                Coordination post-opératoire opérée pour chirurgiens
                libéraux. Supervision humaine + IA assistive interne, dans le
                respect du cadre HDS.
              </p>
            </div>

            {/* Colonne 2 — Produit */}
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/70">
                Produit
              </p>
              <ul className="mt-4 space-y-2.5 text-[12.5px] text-navy-100/55">
                <li><a href="#solution" className="transition-colors hover:text-white">Le service</a></li>
                <li><a href="#etapes" className="transition-colors hover:text-white">Fonctionnement</a></li>
                <li><a href="#cadre" className="transition-colors hover:text-white">Cadre opérationnel</a></li>
                <li><a href="#modele" className="transition-colors hover:text-white">Tarifs</a></li>
                <li>
                  <Link href="/chirurgiens-esthetiques" className="transition-colors hover:text-white">
                    Pour chirurgiens esthétiques
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 3 — Ressources */}
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/70">
                Ressources
              </p>
              <ul className="mt-4 space-y-2.5 text-[12.5px] text-navy-100/55">
                <li><a href="#cadre" className="transition-colors hover:text-white">Documentation</a></li>
                <li><a href="#etapes" className="transition-colors hover:text-white">FAQ</a></li>
                <li>
                  <a href="mailto:contact@kovela.care" className="transition-colors hover:text-white">
                    Nous écrire
                  </a>
                </li>
                <li>
                  <Link href="/login" className="transition-colors hover:text-white">
                    Voir le prototype
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 4 — Légal */}
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/70">
                Légal
              </p>
              <ul className="mt-4 space-y-2.5 text-[12.5px] text-navy-100/55">
                <li><a href="#" className="transition-colors hover:text-white">Mentions légales</a></li>
                <li><a href="#" className="transition-colors hover:text-white">CGU</a></li>
                <li><a href="#" className="transition-colors hover:text-white">DPA</a></li>
                <li><a href="#" className="transition-colors hover:text-white">RGPD</a></li>
              </ul>
            </div>
          </div>

          {/* Ligne basse — séparée par filet, copyright + SIRET + locale +
              LinkedIn + mention prototype (conservée légalement). */}
          <div className="mt-10 border-t border-white/[0.08] pt-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-navy-100/40">
                <span>KOVELA SAS</span>
                <span className="text-navy-100/20">·</span>
                <span>Paris</span>
                <span className="text-navy-100/20">·</span>
                <span>SIRET 000 000 000 00000</span>
                <span className="text-navy-100/20">·</span>
                <span>© {new Date().getFullYear()} KOVELA</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                {/* Locale switcher visuel (EN désactivé) */}
                <div className="flex items-center gap-1.5">
                  <span className="rounded-md bg-white/[0.08] px-2 py-0.5 font-semibold text-white/80">
                    FR
                  </span>
                  <span className="px-2 py-0.5 text-navy-100/30">EN</span>
                </div>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/"
                  aria-label="LinkedIn"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-navy-100/60 transition-colors hover:bg-white/[0.12] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Mention légale prototype — conservée discrète tout en bas */}
            <p className="mt-4 text-[10.5px] leading-relaxed text-navy-100/30">
              Prototype de démonstration — données fictives, hors HDS. Aucune
              donnée réelle collectée sur ce site. · kovela.care
            </p>
          </div>
        </div>
      </footer>

      {/* ============================================================
          Sticky bottom contact bar — mobile uniquement (md:hidden).
          Pattern 2026 (Calendly, Linear, Vercel) : CTA primaire et
          contact direct toujours accessibles, supprime la friction
          "scroll-pour-trouver-le-CTA".
          ============================================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-navy-900/[0.08] bg-white/95 px-4 py-3 shadow-[0_-6px_24px_-8px_rgba(10,31,45,0.18)] backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2">
          <a
            href={DEMO}
            className="flex flex-1 items-center justify-center rounded-lg bg-navy-900 px-4 py-3 text-[13.5px] font-semibold tracking-tight text-white shadow-soft"
          >
            Réserver un call de 20 min
          </a>
          <a
            href="mailto:contact@kovela.care"
            aria-label="Nous écrire par email"
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg bg-white text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-ivory"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3.5 7l8.5 6.5L20.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
