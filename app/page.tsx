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

const pains = [
  { t: "Messages dispersés", d: "WhatsApp, appels, SMS, emails, secrétariat : les échanges patients arrivent partout, sans fil conducteur." },
  { t: "Charge cabinet", d: "Beaucoup de messages répétitifs, peu de visibilité structurée. L'assistante absorbe le bruit." },
  { t: "Patients en attente de réponse", d: "Ils veulent être entendus, rassurés dans le parcours et guidés vers le bon canal." },
  { t: "Historique difficile à reconstituer", d: "Le chirurgien garde la responsabilité, mais manque souvent d'un historique clair et exploitable." },
];

const pillars = [
  { t: "Onboarding patient structuré", d: "Le patient reçoit un lien, comprend les limites du service et active son suivi." },
  { t: "Messagerie sécurisée", d: "Texte, photo, audio, historique lisible et rappel urgence permanent." },
  { t: "Supervision humaine, augmentée par l'IA", d: "Les superviseurs traitent, documentent, relancent et préparent les comptes-rendus." },
  { t: "Compte-rendu factuel", d: "Le chirurgien ne reçoit pas du bruit : il reçoit un historique clair et exploitable." },
];

const steps = [
  { t: "KOVELA met en place le service avec le cabinet", d: "Le cabinet définit ses préférences avec l'équipe KOVELA : spécialité, préférences de fonctionnement, assistante, mandat de prélèvement (simulation)." },
  { t: "Le planning opératoire est déposé", d: "Ajout manuel ou import simple du planning des patients." },
  { t: "Le patient active son suivi", d: "Lien sécurisé, limites du service, messagerie." },
  { t: "KOVELA supervise et documente", d: "Messages, relances, IA assistive, traçabilité complète." },
  { t: "Le chirurgien consulte les CR", d: "Compte-rendu factuel, escalades transmises avec contexte, visibilité claire." },
];

const surgeonBenefits = [
  "Cabinet moins sollicité",
  "Patients mieux orientés dans le parcours",
  "Messages centralisés",
  "Comptes-rendus factuels disponibles",
  "Escalades transmises avec contexte",
  "Visibilité sans charge supplémentaire",
];

const patientBenefits = [
  "Un espace unique de suivi",
  "Message, photo, audio",
  "Historique lisible",
  "Confirmation après envoi",
  "Rappel urgence permanent",
  "Un suivi organisé avec le chirurgien",
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

const securityPoints = [
  "Architecture cible pensée pour un hébergement HDS",
  "Approche conçue avec les exigences RGPD en tête",
  "Principes CNIL : minimisation, traçabilité, information, droits des personnes, accès limités",
  "Séparation site public / application métier",
  "Données patient destinées à rester dans l'environnement applicatif sécurisé",
  "Accès par rôle et logs d'accès / actions en production cible",
  "IA assistive désactivable et loggée — jamais autonome",
  "Aucune donnée patient sur ce site public",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">{children}</p>;
}

export default function Landing() {
  return (
    <div className="bg-[#eef1f3] text-navy-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-navy-900/[0.06] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Wordmark />
          <nav className="hidden items-center gap-8 text-sm text-charcoal/70 md:flex">
            <a href="#probleme" className="hover:text-navy-900">Le problème</a>
            <a href="#solution" className="hover:text-navy-900">La solution</a>
            <a href="#etapes" className="hover:text-navy-900">Comment ça marche</a>
            <a href="#ia" className="hover:text-navy-900">IA assistive</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-xl px-3 py-2 text-sm font-medium text-navy-900 hover:bg-navy-50 sm:block">
              Voir le prototype
            </Link>
            <a href={DEMO} className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600">
              Demander une démo
            </a>
          </div>
        </div>
      </header>

      {/* Section 1 — Hero */}
      <section className="relative overflow-hidden bg-navy-depth text-white">
        <div className="pointer-events-none absolute inset-0 hero-lines opacity-90" />
        <div className="pointer-events-none absolute right-0 top-0 hidden h-[560px] w-[460px] opacity-90 lg:block">
          <HeroGraphic />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-teal-200 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Coordination post-opératoire pour chirurgiens libéraux
          </span>

          <h1 className="mt-7 max-w-3xl font-display text-4xl font-normal leading-[1.08] tracking-tight md:text-6xl">
            La continuité post-opératoire, enfin structurée.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-100/80">
            KOVELA est un service opéré de coordination post-opératoire pour chirurgiens libéraux :
            messagerie sécurisée, supervision humaine spécialisée, IA assistive interne,
            comptes-rendus factuels et traçabilité.
          </p>

          <p className="mt-3 font-display text-base italic text-teal-200/90">
            Un service opéré, pas un logiciel de plus.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href={DEMO} className="rounded-xl bg-teal-500 px-6 py-3 text-sm font-medium text-white hover:bg-teal-600">
              Demander une démo
            </a>
            <Link href="/login" className="rounded-xl bg-white/8 px-6 py-3 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15">
              Voir le prototype
            </Link>
          </div>

          <p className="mt-6 text-sm text-navy-100/55">Conçu avec des chirurgiens, pour des chirurgiens.</p>
        </div>
      </section>

      {/* Bande de positionnement « service opéré » — directement sous le hero */}
      <section className="border-y border-navy-900/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="font-display text-lg leading-relaxed text-navy-900 md:text-xl">
            <span className="font-semibold">KOVELA est un service opéré</span> de coordination
            post-opératoire, appuyé sur une plateforme métier, une supervision humaine
            spécialisée et une IA assistive interne.
          </p>
        </div>
      </section>

      {/* Section 2 — Le problème */}
      <section id="probleme" className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Le constat</Eyebrow>
        <h2 className="max-w-2xl font-display text-3xl tracking-tight text-navy-900 md:text-4xl">
          Le post-opératoire vit encore trop souvent dans le désordre.
        </h2>
        <p className="mt-4 max-w-2xl text-charcoal/65">
          Entre échanges dispersés et historique difficile à reconstituer, le désordre opérationnel
          pèse sur le cabinet — et sur l'expérience patient.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map((p) => (
            <div key={p.t} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-900/[0.05]">
              <div className="mb-3 h-px w-8 bg-teal-400" />
              <h3 className="text-sm font-semibold text-navy-900">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — La solution */}
      <section id="solution" className="border-y border-navy-900/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Eyebrow>La solution KOVELA</Eyebrow>
          <h2 className="max-w-3xl font-display text-3xl tracking-tight text-navy-900 md:text-4xl">
            KOVELA transforme le suivi post-op en flux clair, supervisé et traçable.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <div key={p.t} className="rounded-2xl bg-[#eef1f3] p-5 ring-1 ring-navy-900/[0.05]">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 font-display text-sm text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-navy-900">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{p.d}</p>
              </div>
            ))}
          </div>
          <blockquote className="mt-10 rounded-2xl border-l-4 border-teal-500 bg-[#eef1f3] p-6">
            <p className="text-base leading-relaxed text-navy-900 md:text-lg">
              KOVELA n'est pas un logiciel que le chirurgien doit gérer. C'est un{" "}
              <span className="font-semibold">service opéré</span> qui structure le suivi
              post-opératoire pour son cabinet, avec une équipe de supervision humaine spécialisée
              et une IA assistive interne.
            </p>
          </blockquote>
          <p className="mt-6 font-display text-2xl italic tracking-tight text-navy-900">
            Le patient se sent accompagné. Le cabinet respire. Le chirurgien garde la main.
          </p>
        </div>
      </section>

      {/* Section 4 — Comment ça marche */}
      <section id="etapes" className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Comment ça marche</Eyebrow>
        <h2 className="font-display text-3xl tracking-tight text-navy-900 md:text-4xl">
          Du planning opératoire au compte-rendu, en cinq étapes.
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.t} className="relative rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-900/[0.05]">
              <span className="font-display text-3xl text-teal-500/80">{i + 1}</span>
              <h3 className="mt-2 text-sm font-semibold text-navy-900">{s.t}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-charcoal/60">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Section 5 — IA assistive */}
      <section id="ia" className="bg-navy-depth text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Eyebrow>
            <span className="text-teal-300">IA assistive, jamais autonome</span>
          </Eyebrow>
          <h2 className="max-w-2xl font-display text-3xl tracking-tight text-white md:text-4xl">
            Une IA utile, encadrée, au service de l'équipe.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/[0.05] p-6 ring-1 ring-white/10">
              <h3 className="text-sm font-semibold text-teal-200">L'IA KOVELA aide à</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy-100/80">
                {["résumer les échanges", "préparer les comptes-rendus", "reformuler des réponses non médicales", "compiler factuellement une transmission", "signaler les tâches opérationnelles"].map((x) => (
                  <li key={x} className="flex gap-2"><span className="text-teal-400">+</span>{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/[0.05] p-6 ring-1 ring-white/10">
              <h3 className="text-sm font-semibold text-navy-100">L'IA KOVELA ne fait jamais</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy-100/70">
                {["de réponse autonome au patient", "d'avis médical", "d'interprétation des photos", "de décision d'escalade", "d'évaluation chiffrée du patient"].map((x) => (
                  <li key={x} className="flex gap-2"><span className="text-navy-100/40">—</span>{x}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 font-display text-2xl italic text-teal-200">
            L'IA prépare. L'humain valide. Le chirurgien décide.
          </p>
          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-navy-100/45">
            KOVELA ne décide pas médicalement. KOVELA structure, trace, priorise opérationnellement
            et escalade.
          </p>
        </div>
      </section>

      {/* Section 6 — Pour le chirurgien */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Pour le chirurgien</Eyebrow>
            <h2 className="font-display text-3xl tracking-tight text-navy-900 md:text-4xl">
              Moins de bruit. Plus de visibilité. Aucun transfert de responsabilité.
            </h2>
            <p className="mt-4 text-charcoal/65">
              Un service pensé pour les chirurgiens libéraux : le cabinet respire, le chirurgien
              garde la main.
            </p>
            <Link href="/chirurgien" className="mt-6 inline-block rounded-xl bg-navy-900 px-5 py-3 text-sm font-medium text-white hover:bg-navy-800">
              Voir l'espace chirurgien
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {surgeonBenefits.map((b) => (
              <div key={b} className="flex items-start gap-2 rounded-xl bg-white p-4 text-sm text-navy-900 shadow-soft ring-1 ring-navy-900/[0.05]">
                <span className="mt-0.5 text-teal-500">✓</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — Pour le patient */}
      <section className="border-y border-navy-900/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="grid gap-3 sm:grid-cols-2">
              {patientBenefits.map((b) => (
                <div key={b} className="flex items-start gap-2 rounded-xl bg-[#eef1f3] p-4 text-sm text-navy-900 ring-1 ring-navy-900/[0.05]">
                  <span className="mt-0.5 text-teal-500">✓</span>
                  {b}
                </div>
              ))}
            </div>
            <div>
              <Eyebrow>Pour le patient</Eyebrow>
              <h2 className="font-display text-3xl tracking-tight text-navy-900 md:text-4xl">
                Une expérience post-op plus claire et plus rassurante.
              </h2>
              <p className="mt-4 text-charcoal/65">
                KOVELA accompagne l'organisation du suivi. En cas d'urgence, le patient suit les
                consignes de son chirurgien ou contacte le 15 / 112.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7bis — Réputation & expérience patient */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Expérience patient & réputation cabinet</Eyebrow>
        <h2 className="max-w-3xl font-display text-3xl tracking-tight text-navy-900 md:text-4xl">
          Une meilleure expérience post-op, c'est aussi une réputation mieux maîtrisée.
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-charcoal/70">
          Le post-opératoire est souvent l'un des moments qui marque le plus l'expérience patient.
          En structurant les échanges, les relances, les comptes-rendus et la traçabilité, KOVELA
          aide le cabinet à offrir une expérience plus claire, plus rassurante et plus
          professionnelle — sans retirer la main au chirurgien.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Patient accompagné", d: "Un patient qui se sent accompagné, informé et entendu vit mieux son parcours." },
            { t: "Cabinet soulagé", d: "Le cabinet centralise les échanges et réduit la charge sur les assistantes." },
            { t: "Chirurgien serein", d: "Visibilité sans charge supplémentaire ; aucun transfert de responsabilité." },
            { t: "Historique exploitable", d: "Comptes-rendus factuels et logs : un dossier de coordination clair." },
            { t: "Image post-op maîtrisée", d: "Une organisation plus claire du post-op peut aider à préserver la qualité perçue." },
            { t: "Service opéré", d: "Une équipe humaine spécialisée prend en charge le flux, pas un logiciel à gérer." },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-900/[0.05]">
              <div className="mb-3 h-px w-8 bg-teal-400" />
              <h3 className="text-sm font-semibold text-navy-900">{b.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{b.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl font-display text-2xl italic tracking-tight text-navy-900">
          Une expérience post-op mieux structurée contribue à la satisfaction patient et à la
          réputation du cabinet.
        </p>
        <p className="mt-4 max-w-3xl text-[11px] leading-relaxed text-charcoal/45">
          KOVELA ne garantit pas la satisfaction patient ni la réputation du chirurgien. KOVELA
          organise et trace le suivi post-opératoire pour aider le cabinet à mieux maîtriser son
          image post-opératoire.
        </p>
      </section>

      {/* Section 8 — Supervision & qualité */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Supervision & qualité</Eyebrow>
        <h2 className="max-w-2xl font-display text-3xl tracking-tight text-navy-900 md:text-4xl">
          Une supervision pilotée, formée et traçable.
        </h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {supervisionPoints.map((p) => (
            <div key={p} className="rounded-xl bg-white p-4 text-sm text-navy-900 shadow-soft ring-1 ring-navy-900/[0.05]">
              {p}
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl font-display text-2xl italic tracking-tight text-navy-900">
          KOVELA ne scale pas seulement par la tech. KOVELA scale par une supervision formée,
          assistée et contrôlée.
        </p>
      </section>

      {/* Section 9 — Sécurité / données / cadre */}
      <section className="border-y border-navy-900/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            <BrandMark size={44} className="text-navy-900" />
            <div>
              <Eyebrow>Sécurité, données & cadre</Eyebrow>
              <h2 className="max-w-2xl font-display text-3xl tracking-tight text-navy-900 md:text-4xl">
                Conçu pour un cadre santé exigeant.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal/70">
                KOVELA est conçu pour s'inscrire dans un cadre HDS, RGPD et CNIL, avec une
                séparation claire entre site public et application métier, une logique de
                minimisation des données, des accès par rôle et une traçabilité des actions.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-[#eef1f3] p-5 ring-1 ring-navy-900/[0.05]">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/55">
                    Site public
                  </p>
                  <p className="mt-1 text-sm font-semibold text-navy-900">
                    Hors HDS — aucune donnée patient
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/65">
                    Présentation du service, contact démo. Aucun formulaire patient, aucune
                    collecte de donnée de santé.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#eef1f3] p-5 ring-1 ring-navy-900/[0.05]">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/55">
                    Application métier cible
                  </p>
                  <p className="mt-1 text-sm font-semibold text-navy-900">
                    Pensée pour HDS, RGPD, principes CNIL
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/65">
                    Accès par rôle, traçabilité, minimisation, droits des personnes. IA assistive
                    désactivable et loggée.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {securityPoints.map((p) => (
                  <div key={p} className="flex items-start gap-2 text-sm text-charcoal/75">
                    <span className="mt-0.5 text-teal-500">•</span>
                    {p}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-charcoal/45">
                Architecture cible — éléments à valider juridiquement avant un déploiement en
                production. Ce site est un démonstrateur : aucune donnée patient n'y est collectée.
                Aucune certification revendiquée à ce stade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10 — CTA final */}
      <section className="bg-navy-depth text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Structurer le post-op sans alourdir le cabinet.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-100/75">
            Découvrez comment KOVELA peut transformer le suivi post-opératoire en un flux clair,
            supervisé et exploitable.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={DEMO} className="rounded-xl bg-teal-500 px-6 py-3 text-sm font-medium text-white hover:bg-teal-600">
              Demander une démo
            </a>
            <Link href="/login" className="rounded-xl bg-white/8 px-6 py-3 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15">
              Accéder au prototype
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-navy-100/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-center text-xs sm:flex-row sm:text-left">
          <Wordmark light />
          <p>Prototype de démonstration — données fictives, hors HDS. Aucune donnée réelle. · kovela.care</p>
        </div>
      </footer>
    </div>
  );
}
