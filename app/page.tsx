import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/Brand";

const DEMO = "mailto:contact@kovela.care?subject=Demande%20de%20démo%20KOVELA";

// Graphisme « infrastructure » : flux Patient → Coordination → Chirurgien.
function HeroGraphic() {
  return (
    <svg viewBox="0 0 420 460" fill="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38B8B1" />
          <stop offset="100%" stopColor="#137C76" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="#1FA7A0" strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="2 7" strokeLinecap="round">
        <path d="M110 96 C 200 130, 230 180, 256 224" />
        <path d="M150 392 C 220 340, 240 300, 262 256" />
        <path d="M300 240 C 350 250, 380 210, 392 150" />
      </g>
      <circle cx="270" cy="240" r="74" stroke="#1FA7A0" strokeOpacity="0.18" />
      <circle cx="270" cy="240" r="54" stroke="#1FA7A0" strokeOpacity="0.28" />
      <circle cx="270" cy="240" r="34" fill="url(#core)" filter="url(#glow)" />
      <text x="270" y="245" textAnchor="middle" fontSize="13" fontWeight="700" fill="#06121B">K</text>
      <circle cx="100" cy="86" r="22" fill="#0E2835" stroke="#1FA7A0" strokeOpacity="0.7" />
      <circle cx="100" cy="86" r="4" fill="#BFE3DE" />
      <text x="100" y="46" textAnchor="middle" fontSize="11" fill="#9CB1BC" letterSpacing="1">PATIENT</text>
      <circle cx="138" cy="404" r="22" fill="#0E2835" stroke="#1FA7A0" strokeOpacity="0.7" />
      <circle cx="138" cy="404" r="4" fill="#BFE3DE" />
      <text x="138" y="444" textAnchor="middle" fontSize="11" fill="#9CB1BC" letterSpacing="1">CHIRURGIEN</text>
      <circle cx="392" cy="150" r="5" fill="#1FA7A0" />
      <circle cx="356" cy="320" r="3" fill="#BFE3DE" fillOpacity="0.6" />
    </svg>
  );
}

const heroBadges = [
  "Service opéré · pas un logiciel",
  "IA assistive · jamais autonome",
  "Construit avec des chirurgiens",
  "Architecture cible HDS / RGPD",
];

const pains = [
  { t: "Messages dispersés", d: "WhatsApp, appels, SMS, emails, secrétariat : les échanges patients arrivent partout, sans fil conducteur." },
  { t: "Charge cabinet", d: "Relances manuelles, photos à classer, doutes à apaiser. L'assistante absorbe le bruit." },
  { t: "Sollicitations désordonnées", d: "Le chirurgien est sollicité trop tôt, trop tard, ou sans dossier structuré." },
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
  "Pas de décision d'escalade",
  "Pas d'évaluation chiffrée du patient",
];

const supervisionPoints = [
  "Superviseurs assignés",
  "Charge suivie",
  "Messages non traités visibles",
  "CR à contrôler",
  "Usage de l'IA assistive tracé",
  "Qualité suivie par le Head of Care",
  "Formation des superviseurs",
  "Logs complets",
];

const doctrinePoints = [
  "KOVELA ne diagnostique pas",
  "KOVELA ne prescrit pas",
  "KOVELA ne décide pas médicalement",
  "KOVELA ne remplace pas le chirurgien",
  "KOVELA structure, trace, documente et transmet",
  "Architecture cible HDS / RGPD",
  "Accès par rôle · traçabilité · minimisation",
  "Aucune certification revendiquée à ce stade",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">{children}</p>;
}

export default function Landing() {
  return (
    <div className="bg-bone text-navy-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-navy-900/[0.06] bg-bone/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark />
          <nav className="hidden items-center gap-9 text-[13px] tracking-tight text-charcoal/70 md:flex">
            <a href="#probleme" className="transition-colors hover:text-navy-900">Le constat</a>
            <a href="#solution" className="transition-colors hover:text-navy-900">La solution</a>
            <a href="#etapes" className="transition-colors hover:text-navy-900">Comment ça marche</a>
            <a href="#ia" className="transition-colors hover:text-navy-900">IA assistive</a>
            <a href="#modele" className="transition-colors hover:text-navy-900">Modèle</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-lg px-3.5 py-2 text-[13px] font-medium text-navy-900 transition-colors hover:bg-navy-900/[0.05] sm:block"
            >
              Voir le prototype
            </Link>
            <a
              href={DEMO}
              className="rounded-lg bg-navy-900 px-4 py-2 text-[13px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
            >
              Demander une démo
            </a>
          </div>
        </div>
      </header>

      {/* Section A — Hero */}
      <section className="relative overflow-hidden bg-navy-depth text-white">
        <div className="pointer-events-none absolute inset-0 hero-lines opacity-90" />
        <div className="pointer-events-none absolute right-0 top-0 hidden h-[560px] w-[460px] opacity-90 lg:block">
          <HeroGraphic />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-20 md:pt-28">
          <span className="inline-flex items-center gap-2.5 rounded-md bg-white/[0.06] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-teal-200/90 ring-1 ring-white/10">
            <span className="h-1 w-1 rounded-full bg-teal-400" />
            Coordination post-opératoire · chirurgie esthétique privée
          </span>

          <h1 className="mt-8 max-w-3xl font-display text-[2.6rem] font-normal leading-[1.08] tracking-[-0.03em] md:text-[3.6rem]">
            Le suivi post-opératoire, opéré pour votre cabinet.
          </h1>

          <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-navy-100/80">
            Supervision humaine, référentiel cabinet, comptes-rendus factuels et IA assistive. Le
            chirurgien garde la main, KOVELA organise le flux.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {heroBadges.map((b) => (
              <span
                key={b}
                className="rounded-md bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium tracking-tight text-navy-100/85 ring-1 ring-white/10"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5">
            <a
              href={DEMO}
              className="rounded-lg bg-white px-6 py-3 text-[13.5px] font-medium tracking-tight text-navy-900 shadow-soft transition-colors hover:bg-ivory"
            >
              Demander une démo
            </a>
            <a
              href="#etapes"
              className="rounded-lg bg-white/[0.05] px-6 py-3 text-[13.5px] font-medium tracking-tight text-white ring-1 ring-white/15 transition-colors hover:bg-white/[0.1]"
            >
              Voir le fonctionnement
            </a>
          </div>

          <p className="mt-7 text-[12.5px] text-navy-100/50">
            Démarrage progressif sur 2 ou 3 interventions prioritaires, avec accompagnement KOVELA.
          </p>
        </div>
      </section>

      {/* Bande de positionnement « service opéré » */}
      <section className="border-y border-navy-900/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="font-display text-[19px] leading-relaxed tracking-tight text-navy-900 md:text-[22px]">
            <span className="font-semibold">KOVELA est un service opéré</span> de coordination
            post-opératoire, appuyé sur une plateforme métier, une supervision humaine
            spécialisée et une IA assistive interne.
          </p>
        </div>
      </section>

      {/* Section B — Problème cabinet */}
      <section id="probleme" className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Le constat</Eyebrow>
        <h2 className="max-w-2xl font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-navy-900 md:text-[2.4rem]">
          Après l&apos;intervention, tout repose encore trop souvent sur la disponibilité du cabinet.
        </h2>
        <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-charcoal/65">
          Le post-opératoire est un moment clé de l&apos;expérience patient. Il vit pourtant entre
          canaux dispersés, relances manuelles et historiques éclatés.
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
          <h2 className="max-w-3xl font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-navy-900 md:text-[2.4rem]">
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
            Le patient se sent accompagné. Le cabinet respire. Le chirurgien garde la main.
          </p>
        </div>
      </section>

      {/* Section D — Ce qui change pour votre cabinet */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow>Ce qui change pour votre cabinet</Eyebrow>
            <h2 className="font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-navy-900 md:text-[2.4rem]">
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
          <h2 className="max-w-3xl font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-navy-900 md:text-[2.4rem]">
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

      {/* Section F — Comment ça marche */}
      <section id="etapes" className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Comment ça marche</Eyebrow>
        <h2 className="font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-navy-900 md:text-[2.4rem]">
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
      </section>

      {/* Section G — IA assistive */}
      <section id="ia" className="bg-navy-depth text-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Eyebrow>
            <span className="text-teal-300/90">IA assistive · jamais autonome</span>
          </Eyebrow>
          <h2 className="max-w-2xl font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-white md:text-[2.4rem]">
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
            KOVELA ne décide pas médicalement. KOVELA structure, trace, priorise opérationnellement
            et transmet au cabinet selon les règles définies.
          </p>
        </div>
      </section>

      {/* Section bonus — Supervision & qualité (compact) */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Supervision &amp; qualité</Eyebrow>
        <h2 className="max-w-2xl font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-navy-900 md:text-[2.4rem]">
          Une supervision pilotée, formée et traçable.
        </h2>
        <div className="mt-12 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {supervisionPoints.map((p) => (
            <div
              key={p}
              className="rounded-xl bg-white p-4 text-[13px] tracking-tight text-navy-900 shadow-soft ring-1 ring-navy-900/[0.05]"
            >
              {p}
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl font-display text-[22px] italic leading-tight tracking-[-0.01em] text-navy-900">
          KOVELA scale par une supervision formée, assistée et contrôlée — pas seulement par la tech.
        </p>
      </section>

      {/* Section H — Sécurité / doctrine (cadre clair) */}
      <section className="border-y border-navy-900/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            <BrandMark size={44} className="shrink-0 text-navy-900" />
            <div>
              <Eyebrow>Un cadre clair</Eyebrow>
              <h2 className="max-w-2xl font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-navy-900 md:text-[2.4rem]">
                Conçu pour un cadre santé exigeant.
              </h2>
              <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-charcoal/70">
                KOVELA est conçu pour s&apos;inscrire dans un cadre HDS, RGPD et CNIL, avec une
                séparation claire entre site public et application métier, une logique de
                minimisation des données, des accès par rôle et une traçabilité des actions.
              </p>

              <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {doctrinePoints.map((p) => (
                  <div
                    key={p}
                    className="flex items-start gap-3 text-[13px] tracking-tight text-charcoal/75"
                  >
                    <span className="mt-1.5 h-1 w-3 shrink-0 bg-teal-500/70" />
                    {p}
                  </div>
                ))}
              </div>

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
                Architecture cible — éléments à valider juridiquement avant un déploiement en
                production. Ce site est un démonstrateur : aucune donnée patient n&apos;y est
                collectée. Aucune certification revendiquée à ce stade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section I — Modèle économique */}
      <section id="modele" className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Modèle économique</Eyebrow>
        <h2 className="max-w-3xl font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-navy-900 md:text-[2.4rem]">
          Un modèle simple, aligné sur l&apos;usage.
        </h2>
        <p className="mt-5 max-w-3xl text-[14.5px] leading-relaxed text-charcoal/70">
          Abonnement cabinet + patients activés. La tarification est calibrée selon le volume de
          suivi et le niveau d&apos;accompagnement. Détail présenté lors de la démo.
        </p>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            {
              t: "Abonnement cabinet",
              d: "Mise en place du service, supervision continue, référentiel maintenu avec votre cabinet.",
            },
            {
              t: "Variable patient",
              d: "Un volume aligné sur les patients réellement activés et suivis sur la période.",
            },
            {
              t: "Démarrage progressif",
              d: "Pilote sur 2 ou 3 interventions prioritaires. Extension co-construite ensuite.",
            },
          ].map((b) => (
            <div
              key={b.t}
              className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]"
            >
              <div className="mb-4 h-px w-7 bg-teal-500/70" />
              <h3 className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                {b.t}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-charcoal/60">{b.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[11.5px] leading-relaxed text-charcoal/45">
          Tarification calibrée selon le volume et la configuration. Aucune fourchette définitive
          publiée à ce stade — précisions lors de la démo.
        </p>
      </section>

      {/* Section J — CTA final */}
      <section className="bg-navy-depth text-white">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] md:text-[2.4rem]">
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
