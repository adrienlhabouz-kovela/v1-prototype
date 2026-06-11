// ───────────────────────────────────────────────────────────────────────────
// /styleguide-editorial — Showcase Phase 1 (V2) Clinical Trust Premium.
//
// Page interne non liée depuis la nav, robots: noindex/nofollow.
// Sert UNIQUEMENT à la validation visuelle de la direction artistique
// « Clinical Trust Premium » avant Phase 2 (réécriture
// /chirurgiens-esthetiques).
//
// Différences vs V1 (Operating Room Discipline pur) :
//   - Hero avec PHOTO (placeholder si pas encore commissionnée).
//   - Bande de réassurance assumée : HDS · RGPD · Europe · Supervision · IA.
//   - Bloc avant/après KOVELA (sans aucune statistique inventée).
//   - Palette élargie : cream + warm-accent pour la chaleur humaine.
//   - Mêmes primitives typographiques de base, mais composition plus
//     généreuse et plus humaine.
//
// À supprimer ou rendre privé une fois la direction validée et appliquée.
// ───────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import {
  EditorialAlignedRows,
  EditorialAvantApres,
  EditorialBody,
  EditorialColumns,
  EditorialEyebrow,
  EditorialFootnote,
  EditorialHumanHero,
  EditorialInput,
  EditorialLead,
  EditorialList,
  EditorialMockupFrame,
  EditorialNumber,
  EditorialObservations,
  EditorialPhotoPlaceholder,
  EditorialPrimaryButton,
  EditorialQuote,
  EditorialReassurance,
  EditorialRule,
  EditorialSecondaryButton,
  EditorialSection,
  EditorialSelect,
  EditorialTitle,
  SectionHeader,
} from "@/components/editorial";

export const metadata: Metadata = {
  title: "KOVELA — Styleguide éditorial (interne)",
  description: "Showcase Phase 1 du système visuel V2 — Clinical Trust Premium.",
  robots: { index: false, follow: false },
};

const REASSURANCE: { label: string; sub?: string }[] = [
  { label: "Hébergement HDS", sub: "France · Europe" },
  { label: "Cadre RGPD", sub: "Conception" },
  { label: "Données en Europe", sub: "Localisation" },
  { label: "Supervision humaine", sub: "Équipe formée" },
  { label: "Assistance IA interne", sub: "Jamais autonome" },
];

const AVANT_ITEMS = [
  "Appels, mails, SMS, photos arrivent par cinq canaux différents.",
  "Historique à reconstituer pour chaque question patient.",
  "Cabinet sollicité plusieurs fois par jour pour des sujets post-op.",
  "Chirurgien interrompu entre deux consultations.",
  "Aucune trace consolidée du suivi en fin de parcours.",
];

const APRES_ITEMS = [
  "Le patient écrit dans un canal unique, encadré par le cabinet.",
  "L'historique est structuré et accessible en quelques secondes.",
  "Les échanges opérationnels courants sont pris en charge par KOVELA.",
  "Le chirurgien est sollicité lorsqu'un élément nécessite son attention.",
  "Un CR factuel et un journal d'action clôturent chaque suivi.",
];

const COVERAGE: { label: string; value: React.ReactNode }[] = [
  { label: "Suivi patient", value: "Parcours post-op structuré selon votre référentiel." },
  { label: "Relances", value: "Messages programmés selon vos jalons (J+1, J+7, J+15…)." },
  { label: "Éléments déclarés", value: "Documentés factuellement, sans interprétation médicale." },
  { label: "Transmissions cabinet", value: "Compilation factuelle envoyée sur votre canal validé." },
  { label: "Journal d'action", value: "Traçabilité opérationnelle horodatée." },
  { label: "CR factuel", value: "Synthèse courte de fin de suivi, à votre disposition." },
  { label: "Avis Google", value: "Demande neutre en fin de parcours, validée avec le cabinet." },
];

export default function EditorialStyleguide() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ── Bandeau interne ─────────────────────────────────────────────── */}
      <div className="border-b border-rule bg-paper-shade px-6 py-3 sm:px-10 lg:px-20">
        <p className="mx-auto flex max-w-[1280px] items-baseline justify-between font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-60">
          <span>KOVELA · Styleguide V2 · Clinical Trust Premium</span>
          <span className="text-ink-30">Interne · non indexé</span>
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
            1. HERO HUMAIN
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSection className="!py-12 sm:!py-16 lg:!py-24">
        <p className="mb-12 font-editorial-mono text-[14px] uppercase tracking-[0.18em] text-ink lg:mb-20">
          KOVELA
        </p>

        <EditorialHumanHero
          number="01"
          total="05"
          eyebrow="POUR CHIRURGIENS LIBÉRAUX"
          title={
            <>
              KOVELA fait disparaître
              <br />
              le bruit post-op
              <br />
              du quotidien du cabinet.
            </>
          }
          lead={
            <>
              Service opéré de coordination post-opératoire pour chirurgiens
              libéraux. Supervision humaine. Assistance IA interne. Cadre RGPD
              et hébergement HDS prévus pour la V1.
            </>
          }
          primaryCta={{ label: "Demander un échange opérationnel", href: "#contact" }}
          secondaryCta={{ label: "Voir le fonctionnement", href: "#prise-en-charge" }}
        />
      </EditorialSection>

      {/* ── Bande de réassurance directement sous le hero ─────────────── */}
      <EditorialReassurance items={REASSURANCE} surface="cream" />

      {/* ════════════════════════════════════════════════════════════════════
            2. AVANT / APRÈS KOVELA
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSection>
        <SectionHeader
          number="02"
          total="05"
          eyebrow="LE QUOTIDIEN POST-OP"
          title={
            <>
              Le geste est maîtrisé.
              <br />
              L&apos;après doit l&apos;être aussi.
            </>
          }
          lead="Après l'intervention, le quotidien du cabinet reçoit des sollicitations qui ne suivent pas un cadre. C'est ce bruit-là que KOVELA fait disparaître — sans toucher au cadre médical."
        />

        <div className="mt-14">
          <EditorialAvantApres
            avantItems={AVANT_ITEMS}
            apresItems={APRES_ITEMS}
          />
        </div>

        <p className="mx-auto mt-14 max-w-[640px] text-center font-editorial text-[18px] font-medium leading-[1.4] tracking-[-0.01em] text-ink">
          Le chirurgien reste maître du cadre médical.
          <br />
          <span className="text-accent">KOVELA prend en charge le bruit opérationnel.</span>
        </p>
      </EditorialSection>

      {/* ════════════════════════════════════════════════════════════════════
            3. CE QUE KOVELA PREND EN CHARGE
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSection surface="shade" id="prise-en-charge">
        <SectionHeader
          number="03"
          total="05"
          eyebrow="LE RELAIS OPÉRATIONNEL"
          title={
            <>
              KOVELA prend le quotidien.
              <br />
              Vous gardez la main.
            </>
          }
          lead="Votre cabinet partage une fois ses habitudes, ses consignes post-op et son référentiel de transmission. KOVELA structure le cadre, prend en charge les échanges opérationnels courants, documente les éléments déclarés par le patient, et remonte ce qui nécessite votre attention."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Photo détail cabinet — sobre, secondaire */}
          <div>
            <EditorialPhotoPlaceholder caption="Visuel détail cabinet · à commissionner" />
          </div>

          <div>
            <EditorialAlignedRows rows={COVERAGE} />
          </div>
        </div>

        <EditorialRule className="mt-16" />

        <EditorialBody className="mx-auto mt-8 max-w-[680px] text-center">
          La supervision est assurée par une équipe humaine formée au
          référentiel de chaque cabinet. L&apos;assistance IA est interne :
          elle prépare, structure et documente, sans jamais répondre
          directement au patient.
        </EditorialBody>
      </EditorialSection>

      {/* ════════════════════════════════════════════════════════════════════
            4. PAS UN LOGICIEL — DIFFÉRENCIATION
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSection>
        <SectionHeader
          number="04"
          total="05"
          eyebrow="PAS UN LOGICIEL"
          title={
            <>
              Rien à installer.
              <br />
              Rien à manager.
            </>
          }
        />

        <div className="mt-12">
          <EditorialColumns
            leftTitle="KOVELA n'est pas"
            leftItems={[
              "Un logiciel à paramétrer",
              "Un chatbot patient",
              "Une IA médicale",
              "Un secrétariat classique",
              "Un service d'urgence",
            ]}
            rightTitle="KOVELA est"
            rightItems={[
              "Un service opéré",
              "Une supervision humaine",
              "Une assistance IA interne",
              "Un cadre validé avec le cabinet",
              "Des transmissions factuelles et tracées",
            ]}
          />
        </div>

        <p className="mx-auto mt-14 max-w-[560px] text-center font-editorial text-[18px] italic leading-[1.4] text-ink-60">
          Le patient ne retient pas seulement le geste.
          <br />
          Il retient aussi la façon dont il a été accompagné après.
        </p>
      </EditorialSection>

      {/* ════════════════════════════════════════════════════════════════════
            5. CTA + FORMULAIRE
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSection surface="shade" id="contact">
        <SectionHeader
          number="05"
          total="05"
          eyebrow="ÉCHANGE OPÉRATIONNEL"
          title={
            <>
              Voyons si KOVELA convient
              <br />
              à votre cabinet.
            </>
          }
          lead="Vingt minutes pour comprendre votre volume, votre organisation actuelle et vos habitudes de suivi. Aucune préparation requise de votre côté."
        />

        <form className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Colonne gauche — rappels d'engagement KOVELA */}
          <div>
            <p className="font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-60">
              CE QUE NOUS GARANTISSONS
            </p>
            <ul className="mt-5 space-y-3 font-editorial text-[14.5px] leading-[1.55] text-ink">
              <li className="flex gap-3">
                <span aria-hidden className="text-warm-accent">—</span>
                <span>Aucune donnée patient demandée dans ce formulaire.</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-warm-accent">—</span>
                <span>Échange opérationnel, pas une démo commerciale.</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-warm-accent">—</span>
                <span>Réponse sous 48 h ouvrées.</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-warm-accent">—</span>
                <span>
                  Cadre cabinet présenté en clair :
                  <br />
                  HDS · RGPD · Europe · Supervision humaine.
                </span>
              </li>
            </ul>
          </div>

          {/* Colonne droite — formulaire */}
          <div className="bg-paper p-8 sm:p-10">
            <div className="space-y-6">
              <EditorialInput
                label="Nom complet"
                placeholder="Dr. Camille Aragon"
                required
              />
              <EditorialInput
                label="Email professionnel"
                type="email"
                placeholder="camille@cabinet-aragon.fr"
                required
              />
              <EditorialInput
                label="Téléphone"
                type="tel"
                placeholder="06 ··"
                required
              />
              <EditorialInput
                label="Ville"
                placeholder="Paris, Lyon, Bordeaux…"
                required
              />
              <EditorialSelect
                label="Interventions / mois"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Sélectionner…
                </option>
                <option value="<10">Moins de 10</option>
                <option value="10-25">10 à 25</option>
                <option value="25-50">25 à 50</option>
                <option value="50+">50+</option>
              </EditorialSelect>
              <div className="pt-2">
                <EditorialPrimaryButton type="submit" className="w-full sm:w-auto">
                  Demander un échange opérationnel
                </EditorialPrimaryButton>
              </div>
              <EditorialFootnote>
                Réservé aux chirurgiens libéraux et cabinets avec activité
                opératoire régulière.
              </EditorialFootnote>
            </div>
          </div>
        </form>
      </EditorialSection>

      {/* ════════════════════════════════════════════════════════════════════
            PIED DE PAGE
          ════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-cream px-6 py-12 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-[1280px]">
          <EditorialRule />
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink">
                KOVELA · France
              </p>
              <p className="mt-3 font-editorial text-[13.5px] leading-[1.55] text-ink-60">
                Service opéré de coordination post-opératoire pour chirurgiens
                libéraux. Supervision humaine. Assistance IA interne.
              </p>
              <p className="mt-5 font-editorial text-[13px] text-ink">
                Adrien Lhabouz · fondateur
              </p>
              <p className="mt-1 font-editorial text-[13px] text-ink-60">
                <a
                  href="mailto:contact@kovela.care"
                  className="underline-offset-2 hover:underline"
                >
                  contact@kovela.care
                </a>
              </p>
            </div>
            <div>
              <EditorialFootnote>
                KOVELA ne remplace pas le chirurgien, ne pose pas de diagnostic,
                ne prescrit pas et ne prend aucune décision médicale. En cas de
                situation urgente ou de doute, le patient contacte le 15 / 112,
                les urgences de la clinique ou suit les consignes remises par
                son chirurgien.
              </EditorialFootnote>
              <EditorialFootnote className="mt-3">
                Architecture RGPD / HDS-ready pensée dès la conception.
                Données hébergées en Europe. Cadre cabinet à valider en V1.
              </EditorialFootnote>
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════════════════
            INVENTAIRE PRIMITIVES — référence design system
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSection>
        <div className="mb-12 border-t-2 border-ink pt-6">
          <EditorialEyebrow>INVENTAIRE</EditorialEyebrow>
          <h2 className="mt-4 font-editorial text-[2rem] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[2.5rem]">
            Référence design system.
          </h2>
        </div>

        <div className="space-y-12">
          {/* ── Typographie ─────────────────────────────────────────────── */}
          <div>
            <EditorialEyebrow>TYPOGRAPHIE</EditorialEyebrow>
            <div className="mt-6 space-y-4">
              <EditorialTitle size="xl">Titre xl (hero potentiel)</EditorialTitle>
              <EditorialTitle size="lg">Titre lg (sections)</EditorialTitle>
              <EditorialTitle size="md">Titre md (sous-section)</EditorialTitle>
              <EditorialLead>
                EditorialLead — paragraphe d&apos;intro, body large 17px sur
                desktop.
              </EditorialLead>
              <EditorialBody>
                EditorialBody — paragraphe standard 15px sur desktop. Le texte
                principal en lecture longue.
              </EditorialBody>
              <EditorialFootnote>
                EditorialFootnote — 12px, ink-30. Pour mentions, captions,
                accompagnement discret.
              </EditorialFootnote>
            </div>
          </div>

          <EditorialRule />

          {/* ── Boutons ─────────────────────────────────────────────────── */}
          <div>
            <EditorialEyebrow>BOUTONS</EditorialEyebrow>
            <div className="mt-6 flex flex-wrap gap-3">
              <EditorialPrimaryButton>Primary action</EditorialPrimaryButton>
              <EditorialSecondaryButton>Secondary action</EditorialSecondaryButton>
              <EditorialPrimaryButton disabled>Disabled</EditorialPrimaryButton>
            </div>
          </div>

          <EditorialRule />

          {/* ── Palette élargie ─────────────────────────────────────────── */}
          <div>
            <EditorialEyebrow>PALETTE — CLINICAL TRUST PREMIUM</EditorialEyebrow>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {[
                ["paper", "#FAFAF7", "bg-paper border border-rule"],
                ["paper-shade", "#F1EFE8", "bg-paper-shade border border-rule"],
                ["cream", "#F1EBE0", "bg-cream border border-rule"],
                ["rule", "#D8D6D0", "bg-rule"],
                ["ink", "#0F1419", "bg-ink"],
                ["ink-60", "#4A4F55", "bg-ink-60"],
                ["ink-30", "#8C9098", "bg-ink-30"],
                ["accent", "#2A6B5C", "bg-accent"],
                ["warm-accent", "#A06B3F", "bg-warm-accent"],
                ["alert", "#B85F3A", "bg-alert"],
              ].map(([name, hex, cls]) => (
                <div key={name as string} className="border border-rule">
                  <div className={`h-16 ${cls as string}`} />
                  <div className="px-3 py-2">
                    <p className="font-editorial-mono text-[10.5px] uppercase tracking-[0.1em] text-ink">
                      {name}
                    </p>
                    <p className="font-editorial-mono text-[10.5px] text-ink-30">
                      {hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <EditorialFootnote className="mt-4">
              Règles d&apos;usage : <code>accent</code> max 3 fois par page (status,
              focus, accent vert). <code>warm-accent</code> pour les éléments
              humains / photo / réassurance. <code>alert</code> seulement quand
              l&apos;alerte est réelle. Tout le reste en niveaux d&apos;ink.
            </EditorialFootnote>
          </div>

          <EditorialRule />

          {/* ── Listes ──────────────────────────────────────────────────── */}
          <div>
            <EditorialEyebrow>LISTES</EditorialEyebrow>
            <div className="mt-6 grid gap-12 sm:grid-cols-2">
              <div>
                <EditorialBody className="mb-3 text-ink">
                  EditorialList — bullet « — » discret.
                </EditorialBody>
                <EditorialList
                  items={[
                    "Premier élément, factuel.",
                    "Deuxième élément, factuel.",
                    "Troisième élément, factuel.",
                  ]}
                />
              </div>
              <div>
                <EditorialBody className="mb-3 text-ink">
                  EditorialObservations — format « 01 ── ».
                </EditorialBody>
                <EditorialObservations
                  items={[
                    "Observation factuelle un.",
                    "Observation factuelle deux.",
                    "Observation factuelle trois.",
                  ]}
                />
              </div>
            </div>
          </div>

          <EditorialRule />

          {/* ── Citation ────────────────────────────────────────────────── */}
          <div>
            <EditorialEyebrow>CITATION</EditorialEyebrow>
            <div className="mt-6 max-w-[640px]">
              <EditorialQuote author="Dr. C. Aragon — chirurgie esthétique, Paris">
                Le geste compte autant que l&apos;après. KOVELA structure ce que
                le cabinet n&apos;a pas le temps de structurer.
              </EditorialQuote>
            </div>
            <EditorialFootnote className="mt-3">
              Citation à n&apos;utiliser qu&apos;avec accord écrit du
              chirurgien. Pas de faux témoignage en production.
            </EditorialFootnote>
          </div>
        </div>
      </EditorialSection>
    </div>
  );
}
