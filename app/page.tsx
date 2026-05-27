import Link from "next/link";
import { Logo } from "@/components/Shell";

const features = [
  {
    title: "Inbox opérationnelle",
    desc: "Classement par message non traité, patient silencieux, CR en attente, escalade ouverte. Jamais de tri médical.",
  },
  {
    title: "IA assistive, human-in-the-loop",
    desc: "Résumés, brouillons de CR et compilations factuelles. Chaque sortie est à valider par un humain et loggée.",
  },
  {
    title: "Compilation factuelle d'escalade",
    desc: "Chronologie factuelle transmise au chirurgien. Aucune interprétation médicale, aucune décision automatique.",
  },
  {
    title: "Traçabilité complète",
    desc: "Attribution, messages, CR, IA utilisée, escalades transmises : tout est journalisé.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo light />
        <Link
          href="/login"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Entrer dans la démo
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-teal-300 ring-1 ring-white/15">
          Prototype de démonstration — données fictives
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          L'infrastructure clinique de coordination post-opératoire
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-100/80">
          KOVELA structure, trace, priorise opérationnellement et escalade le suivi
          post-opératoire des chirurgiens libéraux. Une coordination humaine,
          assistée par une IA interne, supervisée et entièrement journalisée.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700"
          >
            Choisir un rôle de démonstration
          </Link>
          <Link
            href="/admin"
            className="rounded-lg bg-white/10 px-5 py-3 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
          >
            Voir le tableau de bord admin
          </Link>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <h3 className="text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-100/70">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm leading-relaxed text-navy-100/80">
            <span className="font-semibold text-white">Doctrine :</span> KOVELA ne décide
            pas médicalement. L'IA est uniquement assistive, interne, loggée, désactivable
            et human-in-the-loop. Elle ne répond jamais seule au patient, ne diagnostique
            jamais, ne qualifie jamais un symptôme et n'analyse jamais médicalement les photos.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-navy-100/50">
        KOVELA — prototype non destiné à la production HDS. Aucune donnée réelle.
      </footer>
    </div>
  );
}
