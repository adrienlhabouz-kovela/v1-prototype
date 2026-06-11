import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/Brand";

const DEMO = "mailto:contact@kovela.care?subject=Demande%20de%20démo%20KOVELA";
const PILOT = "mailto:contact@kovela.care?subject=Discuter%20du%20pilote%20KOVELA";

// ─── Icônes hero ──────────────────────────────────────────────────────────
// Petites icônes inline (currentColor) — taille/couleur pilotées via className.

function IconCircleX({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M7.3 7.3 12.7 12.7 M12.7 7.3 7.3 12.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCircleCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6.5 10.2 9 12.6 13.7 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTarget({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconSilence({ className = "" }: { className?: string }) {
  // Bulle de conversation barrée — promesse « plus de bruit côté patient ».
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5.2L8 18.5V15H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M4 20 20 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTrend({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 15.5 9.5 10l3.2 3.2L20 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5 5.5 6v5c0 4.2 2.8 7.2 6.5 8.5 3.7-1.3 6.5-4.3 6.5-8.5V6L12 3.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9.2 12.1 11 14l4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  { icon: <IconTarget className="h-[22px] w-[22px]" />, value: "100%", label: "Traçabilité" },
  { icon: <IconSilence className="h-[22px] w-[22px]" />, value: "Zéro bruit", label: "Patient" },
  { icon: <IconTrend className="h-[22px] w-[22px]" />, value: "+30%", label: "Satisfaction patient" },
  { icon: <IconShield className="h-[22px] w-[22px]" />, value: "Sécurisé", label: "HDS + RGPD" },
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

const cabinetChanges = [
  "Moins de messages dispersés",
  "Moins de relances manuelles",
  "Patients mieux guidés",
  "CR factuels disponibles",
  "Transmissions cabinet plus claires",
  "Chirurgien sollicité avec un dossier prêt",
  "Expérience patient mieux structurée",
  "Démarrage accompagné · 2 ou 3 interventions prioritaires",
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

export default function Landing() {
  return (
    <div className="bg-bone text-navy-900">
      {/* Header — barre navy pleine largeur */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-navy-900/95 backdrop-blur-md">
        <div className="flex items-center justify-between gap-6 px-6 py-3.5 lg:px-10 xl:px-16">
          <Wordmark light />
          <nav className="hidden items-center gap-9 text-[13px] tracking-tight text-navy-100/75 lg:flex">
            <a href="#probleme" className="transition-colors hover:text-white">Le constat</a>
            <a href="#solution" className="transition-colors hover:text-white">La solution</a>
            <a href="#etapes" className="transition-colors hover:text-white">Fonctionnement</a>
            <a href="#cadre" className="transition-colors hover:text-white">Cadre KOVELA</a>
            <a href="#modele" className="transition-colors hover:text-white">Tarifs</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-[13px] font-medium text-navy-100/80 transition-colors hover:text-white sm:block"
            >
              Voir le prototype
            </Link>
            <a
              href={DEMO}
              className="rounded-lg bg-teal-500 px-4 py-2 text-[13px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-teal-600"
            >
              Demander une démo
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================
          Section A — Hero split : contenu gauche + photo droite
          ============================================================ */}
      <section className="relative bg-bone">
        <div className="grid lg:grid-cols-2">
          {/* Colonne gauche — promesse + comparatif */}
          <div className="flex items-center px-6 py-12 sm:px-10 lg:px-10 lg:py-16 xl:px-16 xl:py-20">
            <div className="w-full max-w-[600px]">
              {/* Eyebrow + filet */}
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Coordination post-opératoire
                </p>
                <span className="h-px w-14 bg-teal-500/40" />
              </div>

              <h1 className="mt-7 text-balance font-display text-[2.5rem] font-normal leading-[1.07] tracking-[-0.02em] text-navy-900 sm:text-[2.9rem] xl:text-[3.1rem]">
                KOVELA fait disparaître le bruit post-op du quotidien du
                cabinet.
              </h1>

              <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-charcoal/70">
                Un suivi post-op structuré. Des chirurgiens libérés du bruit.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={DEMO}
                  className="rounded-lg bg-navy-900 px-6 py-3 text-[13.5px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
                >
                  Demander une démo
                </a>
                <a
                  href="#etapes"
                  className="rounded-lg bg-white px-6 py-3 text-[13.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-ivory"
                >
                  Voir le fonctionnement
                </a>
              </div>

              {/* Carte comparative Avant / Avec */}
              <div className="relative mt-9 rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.05] sm:p-7">
                {/* Badge VS sur le séparateur */}
                <div className="pointer-events-none absolute left-1/2 top-[26px] z-10 hidden -translate-x-1/2 sm:block">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-[10.5px] font-semibold uppercase tracking-wide text-teal-700 ring-4 ring-white">
                    VS
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-0">
                  {/* Avant KOVELA */}
                  <div className="sm:pr-7">
                    <h3 className="font-display text-[17px] font-medium tracking-tight text-navy-900">
                      Avant KOVELA
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {beforeKovela.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2.5 text-[13px] leading-snug text-charcoal/75"
                        >
                          <IconCircleX className="mt-px h-[17px] w-[17px] shrink-0 text-[#D24B3E]" />
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-[14px] font-semibold tracking-tight text-[#D24B3E]">
                      Coût caché élevé
                    </p>
                  </div>

                  {/* Avec KOVELA */}
                  <div className="sm:border-l sm:border-navy-900/[0.07] sm:pl-7">
                    <h3 className="font-display text-[17px] font-medium tracking-tight text-navy-900">
                      Avec KOVELA
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {withKovela.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2.5 text-[13px] leading-snug text-navy-900"
                        >
                          <IconCircleCheck className="mt-px h-[17px] w-[17px] shrink-0 text-teal-500" />
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-[14px] font-semibold tracking-tight text-teal-600">
                      ROI rapide et mesurable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite — visuel cabinet.
              Slot photo : dépose le fichier dans public/hero-consultation.jpg
              et il s'affichera automatiquement. À défaut, fond navy premium. */}
          <div
            className="relative min-h-[320px] bg-navy-depth bg-cover bg-center lg:min-h-[680px]"
            style={{ backgroundImage: "url('/hero-consultation.jpg')" }}
            role="img"
            aria-label="Chirurgien en consultation post-opératoire avec une patiente"
          >
            <div className="pointer-events-none absolute inset-0 bg-teal-sheen" />
          </div>
        </div>
      </section>

      {/* Barre de preuves — 5 indicateurs */}
      <section className="border-t border-navy-900/[0.06] bg-bone">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 px-6 py-7 sm:grid-cols-4 lg:gap-y-0 lg:px-10 xl:px-16">
          {heroStats.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 ${
                i > 0 ? "sm:border-l sm:border-navy-900/[0.07] sm:pl-6" : ""
              }`}
            >
              <span className="shrink-0 text-teal-600/85">{s.icon}</span>
              <div className="leading-none">
                <p className="font-display text-[18px] font-semibold tracking-tight text-navy-900">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[12px] tracking-tight text-charcoal/60">
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
      <section id="probleme" className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Le constat</Eyebrow>
        <h2 className="max-w-2xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
          Après l&apos;intervention, tout repose encore trop souvent sur la disponibilité du cabinet.
        </h2>
        <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-charcoal/65">
          Le post-opératoire est un moment clé de l&apos;expérience patient. Il vit pourtant entre
          canaux dispersés, relances manuelles et historiques éclatés. Une photo arrive par
          message, une question suit deux heures plus tard, puis il faut reconstituer le contexte.
        </p>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map((p) => (
            <div
              key={p.t}
              className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]"
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
      <section id="solution" className="border-y border-navy-900/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Eyebrow>La solution KOVELA</Eyebrow>
          <h2 className="max-w-3xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
            Le flux opérationnel est pris en charge — humain et IA, encadrés par votre référentiel.
          </h2>
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {solutions.map((p, i) => (
              <div
                key={p.t}
                className="rounded-2xl bg-ivory p-6 ring-1 ring-navy-900/[0.05]"
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
          <blockquote className="mt-12 rounded-2xl border-l-2 border-teal-500/80 bg-ivory p-7">
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

      {/* Section D — Ce qui change pour votre cabinet */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow>Ce qui change pour votre cabinet</Eyebrow>
            <h2 className="font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
              Le suivi devient structuré, lisible et exploitable.
            </h2>
            <p className="mt-5 text-[14.5px] leading-relaxed text-charcoal/65">
              Pas un outil de plus à gérer. Un service opéré qui prend en charge le flux
              post-opératoire de votre cabinet, dans le respect de votre référentiel.
            </p>
            <Link
              href="/chirurgien"
              className="mt-7 inline-block rounded-lg bg-navy-900 px-5 py-3 text-[13px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
            >
              Voir l&apos;espace chirurgien
            </Link>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {cabinetChanges.map((b) => (
              <div
                key={b}
                className="flex items-start gap-3 rounded-xl bg-white p-4 text-[13px] tracking-tight text-navy-900 shadow-soft ring-1 ring-navy-900/[0.05]"
              >
                <span className="mt-1 h-1 w-3 shrink-0 bg-teal-500/70" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section E — Baseline terrain (douleur opérationnelle mesurable) */}
      <section className="border-y border-navy-900/[0.06] bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Eyebrow>Une douleur opérationnelle mesurable</Eyebrow>
          <h2 className="max-w-3xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
            60 à 90 minutes de travail humain par patient, sur 3 à 15 jours.
          </h2>
          <p className="mt-5 max-w-3xl text-[14.5px] leading-relaxed text-charcoal/70">
            En suivi manuel WhatsApp / audio, un patient post-opératoire représente généralement
            <span className="font-medium text-navy-900"> 60 à 90 minutes</span> de travail humain
            sur <span className="font-medium text-navy-900">3 à 15 jours</span> selon
            l&apos;intervention. KOVELA structure ce temps grâce à un référentiel cabinet, une
            supervision humaine, des messages programmés, des comptes-rendus factuels et une IA
            assistive.
          </p>
          <p className="mt-5 max-w-3xl rounded-md bg-bone/70 px-3 py-2 text-[11.5px] leading-relaxed text-charcoal/60 ring-1 ring-navy-900/[0.04]">
            Baseline terrain — à mesurer et affiner en pilote KOVELA. Aucun gain chiffré n&apos;est
            promis à ce stade.
          </p>
        </div>
      </section>

      {/* Bande preuve terrain — prudente, non chiffrée, non datée. */}
      <section className="border-b border-navy-900/[0.06] bg-bone/40">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <p className="text-[12.5px] leading-relaxed text-charcoal/65">
            <span className="font-semibold text-navy-900">Construit à partir de retours terrain</span>
            {" "}de chirurgiens esthétiques et d&apos;une expérience opérationnelle post-opératoire
            manuelle.
          </p>
        </div>
      </section>

      {/* Section F — Comment ça marche */}
      <section id="etapes" className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Comment ça marche</Eyebrow>
        <h2 className="font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
          De la mise en place au CR disponible chirurgien, en cinq étapes.
        </h2>
        <ol className="mt-12 grid gap-3 md:grid-cols-5">
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
          Démarrage accompagné par l&apos;équipe KOVELA. Le référentiel est relu avec vous avant
          tout usage opérationnel.
        </p>
        <p className="mt-3 max-w-3xl text-[12.5px] leading-relaxed text-charcoal/55">
          Le patient accède au suivi via un lien sécurisé, sans application à télécharger.
        </p>
      </section>

      {/* Section G — IA assistive */}
      <section id="ia" className="bg-navy-depth text-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Eyebrow>
            <span className="text-teal-300/90">IA assistive · jamais autonome</span>
          </Eyebrow>
          <h2 className="max-w-2xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-white md:text-[2.4rem]">
            L&apos;IA aide l&apos;équipe. Elle ne décide jamais.
          </h2>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/[0.04] p-7 ring-1 ring-white/[0.08]">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300/90">
                L&apos;IA KOVELA fait
              </h3>
              <ul className="mt-5 space-y-2.5 text-[13.5px] leading-relaxed text-navy-100/85">
                {aiDoes.map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-[7px] h-1 w-3 shrink-0 bg-teal-400/70" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-7 ring-1 ring-white/[0.08]">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-100/70">
                L&apos;IA KOVELA ne fait jamais
              </h3>
              <ul className="mt-5 space-y-2.5 text-[13.5px] leading-relaxed text-navy-100/70">
                {aiDoesNever.map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-[7px] h-1 w-3 shrink-0 bg-navy-100/30" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-10 font-display text-[24px] italic leading-tight tracking-[-0.01em] text-teal-200/85">
            L&apos;IA prépare. L&apos;humain valide. Le chirurgien décide.
          </p>
          <p className="mt-5 max-w-2xl text-[11.5px] leading-relaxed text-navy-100/45">
            KOVELA ne décide pas médicalement. KOVELA organise les échanges, documente le suivi
            et transmet au cabinet selon les règles définies.
          </p>
        </div>
      </section>

      {/* Section bonus — Supervision & qualité (compact) */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <Eyebrow>Supervision &amp; qualité opérationnelle</Eyebrow>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-charcoal/70">
          KOVELA ne scale pas seulement par la tech. La charge, les CR, les transmissions cabinet
          et la qualité opérationnelle sont suivis dans l&apos;interface.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            "Charge superviseurs",
            "CR en file de validation",
            "Transmissions cabinet",
            "Qualité opérationnelle",
          ].map((c) => (
            <span
              key={c}
              className="rounded-md bg-white px-2.5 py-1 text-[11px] font-medium tracking-tight text-navy-700 ring-1 ring-navy-100"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Section H — Cadre opérationnel KOVELA · architecture de confiance */}
      <section id="cadre" className="border-y border-navy-900/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            <BrandMark size={44} className="shrink-0 text-navy-900" />
            <div>
              <Eyebrow>Cadre opérationnel KOVELA</Eyebrow>
              <h2 className="max-w-3xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
                Un cadre clair pour suivre, documenter et transmettre — sans remplacer le chirurgien.
              </h2>
              <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-charcoal/70">
                <span className="font-semibold text-navy-900">HDS / RGPD dès la conception.</span>{" "}
                KOVELA est construit dès le départ pour être opéré dans un environnement HDS, avec
                consentement patient, traçabilité des actions, séparation stricte des rôles et
                documentation RGPD.
              </p>

              {/* 3 piliers : Humain · IA encadrée · Traçabilité */}
              <div className="mt-10 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]">
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
                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]">
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
                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]">
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
                  l'objection chirurgien : qui lit mes patients et quel est leur niveau. */}
              <div className="mt-10 rounded-2xl bg-bone/60 px-5 py-5 ring-1 ring-navy-900/[0.05]">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                  Qui supervise ?
                </p>
                <p className="mt-2 font-sans text-[16px] font-semibold tracking-tight text-navy-900">
                  Une supervision issue du terrain.
                </p>
                <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-navy-900">
                  Les superviseurs KOVELA sont des profils senior issus du bloc, du cabinet ou
                  du suivi patient — aides opératoires expérimentées, infirmières ou
                  coordinatrices de parcours — formés au référentiel KOVELA et aux limites non
                  médicales du service.
                </p>
                <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-navy-900">
                  Ils ne diagnostiquent pas, ne prescrivent pas et n&apos;interprètent pas. Ils
                  structurent le suivi, documentent les échanges et transmettent au cabinet
                  selon le cadre validé avec le chirurgien.
                </p>
                <p className="mt-4 max-w-3xl rounded-md bg-white/60 px-3 py-2 text-[12px] leading-relaxed text-charcoal/70 ring-1 ring-navy-900/[0.04]">
                  <span className="font-medium text-navy-900">Horaires du service.</span>{" "}
                  KOVELA opère le suivi sur une plage quotidienne élargie, définie avec le
                  cabinet — par exemple 8h–20h. Hors horaires, les messages sont conservés et
                  repris à l&apos;ouverture du service ; les situations urgentes restent
                  orientées vers les contacts d&apos;urgence définis par le chirurgien.
                </p>
              </div>

              {/* Phrase doctrine */}
              <p className="mt-10 max-w-3xl font-display text-[20px] italic leading-relaxed tracking-tight text-navy-900">
                KOVELA ne remplace pas le chirurgien. KOVELA structure, documente et transmet.
              </p>

              {/* 2 cards site public / app métier — concept architectural distinct (HDS) */}
              <div className="mt-10 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-ivory p-6 ring-1 ring-navy-900/[0.05]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                    Site public
                  </p>
                  <p className="mt-2.5 font-display text-[14.5px] font-semibold tracking-tight text-navy-900">
                    Hors HDS — aucune donnée patient
                  </p>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-charcoal/65">
                    Présentation du service, contact démo. Aucun formulaire patient, aucune
                    collecte de donnée de santé.
                  </p>
                </div>
                <div className="rounded-2xl bg-ivory p-6 ring-1 ring-navy-900/[0.05]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                    Application métier cible
                  </p>
                  <p className="mt-2.5 font-display text-[14.5px] font-semibold tracking-tight text-navy-900">
                    Pensée pour HDS, RGPD, principes CNIL
                  </p>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-charcoal/65">
                    Accès par rôle, traçabilité, minimisation, droits des personnes. IA assistive
                    désactivable et loggée.
                  </p>
                </div>
              </div>

              <p className="mt-8 text-[11.5px] leading-relaxed text-charcoal/45">
                Prototype de démonstration — hébergement production, certification et
                documentation juridique finalisés avant tout usage réel. Ce site est un
                démonstrateur : aucune donnée patient n&apos;y est collectée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section I — Tarification · Moins qu'un mi-temps. Plus qu'un outil. */}
      <section id="modele" className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Tarification</Eyebrow>
        <h2 className="max-w-3xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
          Moins qu&apos;un mi-temps. Plus qu&apos;un outil.
        </h2>
        <p className="mt-5 max-w-3xl text-[14.5px] leading-relaxed text-charcoal/70">
          KOVELA donne accès à une organisation post-opératoire structurée, sans créer un poste
          supplémentaire dans le cabinet.
        </p>

        {/* Card pricing — fixe + variable, hiérarchie forte, prix lisible */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy-900/[0.06]">
          <div className="flex flex-wrap items-center gap-2 border-b border-navy-900/[0.05] bg-bone/60 px-7 py-4">
            <span className="rounded-md bg-navy-900 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white">
              Offre pilote
            </span>
            {["Accès service", "Usage réel", "Facturation mensuelle", "Service opéré"].map((b) => (
              <span
                key={b}
                className="rounded-md bg-white px-2.5 py-1 text-[10.5px] font-medium tracking-tight text-navy-700 ring-1 ring-navy-100"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="grid items-stretch md:grid-cols-[1fr_auto_1fr]">
            {/* Bloc fixe */}
            <div className="px-7 py-10 md:py-12">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                Accès mensuel au service
              </p>
              <p className="mt-4 font-display text-[2.6rem] font-medium leading-none tracking-tight text-navy-900 md:text-[3rem]">
                690 €{" "}
                <span className="text-[14px] font-normal text-charcoal/55">HT / mois</span>
              </p>
              <ul className="mt-5 space-y-1.5 text-[13px] leading-relaxed text-charcoal/70">
                <li>Accès mensuel au service KOVELA</li>
                <li>Facturé le 1er du mois</li>
              </ul>
            </div>

            {/* Séparateur + */}
            <div className="flex items-center justify-center border-t border-navy-900/[0.05] md:border-l md:border-t-0 md:border-navy-900/[0.05] md:px-2">
              <span className="font-display text-[28px] font-light leading-none text-charcoal/35 md:text-[40px]">
                +
              </span>
            </div>

            {/* Bloc variable */}
            <div className="border-t border-navy-900/[0.05] px-7 py-10 md:border-l md:border-t-0 md:py-12">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                Part variable d&apos;usage
              </p>
              <p className="mt-4 font-display text-[2.6rem] font-medium leading-none tracking-tight text-navy-900 md:text-[3rem]">
                80 €{" "}
                <span className="text-[14px] font-normal text-charcoal/55">
                  HT / patient activé
                </span>
              </p>
              <ul className="mt-5 space-y-1.5 text-[13px] leading-relaxed text-charcoal/70">
                <li>Facturé en fin de mois selon les patients réellement suivis</li>
                <li>Patient activé : onboarding validé + suivi lancé</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-navy-900/[0.05] bg-ivory px-7 py-5">
            <p className="font-display text-[15.5px] italic leading-relaxed tracking-tight text-navy-900 md:text-[17px]">
              Le fixe donne accès au service. Le variable suit l&apos;usage réel.
            </p>
          </div>
        </div>

        {/* 2 colonnes bénéfices : Ce que le cabinet évite · Ce que KOVELA apporte */}
        <div className="mt-12 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-ivory p-7 ring-1 ring-navy-900/[0.05]">
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
          <div className="rounded-2xl bg-white p-7 shadow-card ring-1 ring-navy-900/[0.045]">
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
          Le cabinet conserve la main, sans porter seul la charge d&apos;organisation du suivi.
          Les conditions pilotes peuvent être ajustées selon le volume patient, le niveau
          d&apos;accompagnement et la configuration du cabinet.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <a
            href={DEMO}
            className="rounded-lg bg-navy-900 px-6 py-3 text-[13.5px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
          >
            Demander une démo
          </a>
          <a
            href={PILOT}
            className="rounded-lg bg-white px-6 py-3 text-[13.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-bone"
          >
            Discuter du pilote
          </a>
        </div>
      </section>

      {/* Section Ibis — Un projet construit sur le terrain · réassurance 4 piliers */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Un projet construit sur le terrain</Eyebrow>
        <h2 className="max-w-3xl font-sans text-[2rem] font-semibold leading-tight tracking-[-0.022em] text-navy-900 md:text-[2.4rem]">
          Qui porte KOVELA, et comment.
        </h2>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Fondateur */}
          <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]">
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
          <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]">
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

          {/* Doctrine */}
          <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Doctrine
            </p>
            <h3 className="mt-2.5 font-display text-[14px] font-semibold tracking-tight text-navy-900">
              IA assistive · validation humaine
            </h3>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-charcoal/65">
              IA assistive, validation humaine, chirurgien décisionnaire. KOVELA ne diagnostique
              pas, ne prescrit pas et ne décide pas médicalement.
            </p>
          </div>

          {/* Produit */}
          <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Produit
            </p>
            <h3 className="mt-2.5 font-display text-[14px] font-semibold tracking-tight text-navy-900">
              Prototype déjà démontrable
            </h3>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-charcoal/65">
              Prototype complet : activation cabinet, parcours chirurgien, espace superviseur,
              suivi patient, workflow CR et cockpit admin déjà démontrables.
            </p>
          </div>
        </div>

        {/* Preuve d'exécution sobre */}
        <p className="mt-10 max-w-3xl rounded-md bg-bone/70 px-3 py-2 text-[11.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
          <span className="font-medium text-navy-900">Preuve d&apos;exécution :</span> prototype
          produit fonctionnel · activation cabinet · parcours chirurgien · espace superviseur ·
          suivi patient · workflow CR · cockpit admin.
        </p>
      </section>

      {/* Section J — CTA final */}
      <section className="bg-navy-depth text-white">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
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
              Demander une démo
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

      {/* Footer */}
      <footer className="bg-navy-950 text-navy-100/45">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-9 text-center text-[11.5px] sm:flex-row sm:text-left">
          <Wordmark light />
          <p>
            Prototype de démonstration — données fictives, hors HDS. Aucune donnée réelle. ·
            kovela.care
          </p>
        </div>
      </footer>
    </div>
  );
}
