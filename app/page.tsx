import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/Brand";

const pillars = [
  {
    title: "Présence 7/7",
    desc: "Suivi structuré tout au long de la période critique post-opératoire.",
  },
  {
    title: "Coordination experte",
    desc: "Des professionnels formés et encadrés assurent la continuité.",
  },
  {
    title: "Vigilance humaine",
    desc: "Classement opérationnel et escalade maîtrisée vers le chirurgien.",
  },
  {
    title: "Rapports clairs",
    desc: "Traçabilité complète et synthèses opérationnelles actionnables.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-depth text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Wordmark light />
        <nav className="hidden items-center gap-8 text-sm text-navy-100/70 md:flex">
          <span>Solutions</span>
          <span>Pour les chirurgiens</span>
          <span>Expertise</span>
          <span>À propos</span>
        </nav>
        <Link
          href="/login"
          className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
        >
          Entrer dans la démo
        </Link>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hero-lines opacity-90" />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-14 md:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-teal-200 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Prototype de démonstration — données fictives
          </span>

          <h1 className="mt-7 max-w-3xl font-display text-5xl font-normal leading-[1.05] tracking-tight md:text-6xl">
            L'infrastructure
            <br />
            du post-op moderne.
          </h1>
          <p className="mt-5 max-w-xl font-display text-2xl italic text-teal-200/90">
            La continuité clinique, enfin structurée.
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100/75">
            Une présence humaine experte, augmentée par la technologie, pour la coordination et la
            continuité post-opératoire des chirurgiens libéraux. Supervision humaine, IA assistive,
            traçabilité complète.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-600"
            >
              Demander une démo
            </Link>
            <Link
              href="/admin"
              className="rounded-xl bg-white/8 px-6 py-3 text-sm font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-white/15"
            >
              En savoir plus
            </Link>
          </div>

          {/* Piliers */}
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.title} className="bg-navy-900/40 p-5 backdrop-blur-sm">
                <div className="mb-3 h-px w-8 bg-teal-400/70" />
                <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-navy-100/65">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctrine */}
      <section className="border-t border-white/10 bg-navy-950/40">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <BrandMark size={44} className="text-white" />
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
                Doctrine
              </p>
              <p className="mt-3 text-lg leading-relaxed text-navy-100/80">
                KOVELA ne décide pas médicalement. L'IA est uniquement assistive, interne, loggée,
                désactivable et human-in-the-loop. Elle ne répond jamais seule au patient, ne
                diagnostique jamais, ne qualifie jamais un symptôme et n'analyse jamais médicalement
                les photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-navy-100/45">
        KOVELA — prototype non destiné à la production HDS. Aucune donnée réelle. · kovela.care
      </footer>
    </div>
  );
}
