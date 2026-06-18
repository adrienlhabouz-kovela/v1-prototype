"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Logo } from "@/components/Shell";
import { useKovela } from "@/lib/store";

// Activation cabinet — écran d'arrivée premium pour un chirurgien ayant reçu
// un lien personnalisé après un appel de qualification KOVELA. Prototype : le
// token est un mapping en mémoire (cf. lib/store.tsx · prospectByToken).
// Aucune authentification réelle, aucun TTL signé. À reconstruire en V1 (JWT
// signé HS256, TTL 7j, redemption unique). Cf. docs/CABINET_ACTIVATION_FLOW.md.

export default function ActivationPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const k = useKovela();

  const token = params?.token ?? "";
  const prospect = k.prospectByToken(token);
  const [marked, setMarked] = useState(false);

  // Marquer l'ouverture du lien à l'arrivée (une seule fois).
  useEffect(() => {
    if (prospect && !marked) {
      k.markActivationLinkOpened(token);
      setMarked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, prospect?.id]);

  if (!prospect) {
    return (
      <main className="min-h-screen bg-bone text-navy-900">
        <header className="border-b border-navy-900/[0.06] bg-bone/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Logo />
            <Link
              href="/"
              className="text-[12.5px] tracking-tight text-charcoal/65 transition-colors hover:text-navy-900"
            >
              ← Retour au site
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-2xl px-6 py-20">
          <span className="inline-flex items-center gap-2 rounded-md bg-amber-50/70 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-800 ring-1 ring-amber-100">
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            Lien d&apos;activation introuvable
          </span>
          <h1 className="mt-6 font-display text-[2rem] font-medium leading-tight tracking-tight text-navy-900">
            Ce lien d&apos;activation est expiré ou invalide.
          </h1>
          <p className="mt-5 text-[14.5px] leading-relaxed text-charcoal/70">
            Le lien que vous venez d&apos;ouvrir ne permet pas d&apos;activer un espace cabinet
            KOVELA. Si vous avez reçu ce lien après un échange avec notre équipe, contactez
            votre interlocuteur KOVELA pour qu&apos;un nouveau lien vous soit transmis.
          </p>
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.06]">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
              Contact KOVELA
            </p>
            <p className="mt-2 text-[14px] tracking-tight text-navy-900">
              contact@kovela.care
            </p>
          </div>
          <p className="mt-6 text-[11.5px] leading-relaxed text-charcoal/55">
            Prototype de démonstration · token attendu : <span className="font-mono">{token}</span>.
            En V1, le lien est signé, son expiration est vérifiée côté serveur et il devient
            invalide après une utilisation.
          </p>
        </section>
      </main>
    );
  }

  const fullName = `Dr ${prospect.firstName} ${prospect.lastName}`;
  const cabinetLine = `${prospect.cabinet} · ${prospect.city}`;

  function startOnboarding() {
    k.launchProspectOnboarding(prospect!.id);
    router.push(`/chirurgien/onboarding?from=activation&prospect=${prospect!.id}`);
  }

  return (
    <main className="min-h-screen bg-bone text-navy-900">
      <header className="border-b border-navy-900/[0.06] bg-bone/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Logo />
          <span className="text-[11px] tracking-tight text-charcoal/55">
            Activation cabinet · prototype démo
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-16">
        <span className="inline-flex items-center gap-2.5 rounded-md bg-teal-50/60 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-teal-700 ring-1 ring-teal-100/70">
          <span className="h-1 w-1 rounded-full bg-teal-500" />
          Lien d&apos;activation cabinet
        </span>

        <h1 className="mt-6 font-display text-[2.4rem] font-medium leading-[1.08] tracking-tight text-navy-900">
          Bienvenue {fullName}.
        </h1>
        <p className="mt-3 font-display text-[15.5px] italic text-teal-700">
          Activer votre espace KOVELA.
        </p>

        <p className="mt-7 text-[14.5px] leading-relaxed text-charcoal/75">
          Votre cabinet a été qualifié après un échange avec l&apos;équipe KOVELA. Ce lien
          personnalisé vous permet de démarrer la <span className="font-medium text-navy-900">mise
          en place accompagnée</span> du service de coordination post-opératoire pour
          {" "}<span className="font-medium text-navy-900">{cabinetLine}</span>.
        </p>

        {/* Ce qui va se passer */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.06]">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
            Ce qui va se passer
          </p>
          <ol className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-navy-900">
            {[
              ["1", "Mise en place initiale", "≈ 15 min · identité cabinet, contacts, documents de service, prélèvement"],
              ["2", "Référentiel essentiel accompagné par KOVELA", "≈ 30–60 min · 2 ou 3 interventions prioritaires, co-construites avec notre équipe"],
              ["3", "Relecture KOVELA avant tout usage opérationnel", "le référentiel est relu avec vous avant d'être actif"],
              ["4", "Cabinet actif · premiers patients suivis", "votre planning opératoire est transmis, KOVELA opère le suivi"],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-navy-900 font-display text-[11px] font-medium text-white">
                  {n}
                </span>
                <span>
                  <span className="font-medium text-navy-900">{t}.</span>{" "}
                  <span className="text-charcoal/70">{d}.</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Doctrine */}
        <div className="mt-6 rounded-2xl bg-bone/70 px-5 py-4 text-[12.5px] leading-relaxed text-charcoal/70 ring-1 ring-navy-900/[0.05]">
          <p>
            <span className="font-semibold text-navy-900">Le chirurgien garde la main.</span>{" "}
            KOVELA organise le flux : supervision humaine, référentiel cabinet, comptes-rendus
            factuels et IA assistive. Aucune décision médicale n&apos;est prise par KOVELA.
          </p>
        </div>

        {/* Pricing rappel */}
        <div className="mt-6 rounded-2xl bg-white px-5 py-4 text-[12px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.05]">
          <p>
            <span className="font-medium text-navy-900">Offre pilote :</span>{" "}
            690 € HT / mois — accès mensuel au service, incluant les 5 premiers
            patients activés chaque mois (facturé le 1er du mois). Au-delà :
            80 € HT par patient activé supplémentaire, facturé en fin de mois
            selon l&apos;usage réel (patient activé = onboarding validé + suivi
            lancé). Les conditions pilotes ont été confirmées lors de votre
            échange avec l&apos;équipe KOVELA.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startOnboarding}
            className="rounded-lg bg-navy-900 px-6 py-3 text-[13.5px] font-medium tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
          >
            Activer mon espace cabinet
          </button>
          <a
            href="mailto:contact@kovela.care?subject=Question%20avant%20activation%20cabinet"
            className="rounded-lg bg-white px-6 py-3 text-[13.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-bone"
          >
            Une question avant d&apos;activer
          </a>
        </div>

        <p className="mt-8 text-[11px] leading-relaxed text-charcoal/45">
          Prototype de démonstration. Aucune signature électronique, aucun prélèvement réel,
          aucune donnée patient sur ce site. En V1, le lien d&apos;activation est signé,
          expirable et révocable, et le mandat GoCardless est réel avant que les premiers
          patients ne soient suivis.
        </p>
      </section>
    </main>
  );
}
