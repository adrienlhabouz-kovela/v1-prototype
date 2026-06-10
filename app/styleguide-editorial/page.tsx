// ───────────────────────────────────────────────────────────────────────────
// /styleguide-editorial — Showcase du système visuel V2.
//
// Page interne, non liée depuis la navigation Shell. Sert UNIQUEMENT à la
// validation visuelle de la direction artistique « Operating Room
// Discipline » avant Phase 2 (landing acquisition).
//
// Affiche chaque primitive de components/editorial.tsx dans son contexte
// d'usage canonique. Inclut un rendu V3 du Hero + bloc problème pour test
// composition réel.
//
// À supprimer ou rendre privé une fois la direction validée et appliquée.
// ───────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import {
  EditorialAlignedRows,
  EditorialBody,
  EditorialColumns,
  EditorialEyebrow,
  EditorialFootnote,
  EditorialInput,
  EditorialLead,
  EditorialList,
  EditorialMockupFrame,
  EditorialNumber,
  EditorialObservations,
  EditorialPrimaryButton,
  EditorialQuote,
  EditorialRule,
  EditorialSecondaryButton,
  EditorialSection,
  EditorialSelect,
  EditorialTitle,
  SectionHeader,
} from "@/components/editorial";

export const metadata: Metadata = {
  title: "KOVELA — Styleguide éditorial (interne)",
  description: "Showcase Phase 1 du système visuel V2.",
  robots: { index: false, follow: false },
};

export default function EditorialStyleguide() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ── Bandeau interne ─────────────────────────────────────────────── */}
      <div className="border-b border-rule bg-paper-shade px-6 py-3 sm:px-10 lg:px-20">
        <p className="mx-auto flex max-w-[1280px] items-baseline justify-between font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-60">
          <span>KOVELA · Styleguide éditorial</span>
          <span className="text-ink-30">Interne · Phase 1 · non indexé</span>
        </p>
      </div>

      {/* ── Section 1 : Hero V3 (composition réelle) ─────────────────────── */}
      <EditorialSection>
        <p className="mb-32 font-editorial-mono text-[14px] uppercase tracking-[0.18em] text-ink">
          KOVELA
        </p>

        <SectionHeader
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
        />

        <div className="mt-10">
          <EditorialPrimaryButton href="#contact">
            Demander un échange opérationnel
          </EditorialPrimaryButton>
        </div>
      </EditorialSection>

      {/* ── Section 2 : Bloc problème V3 ─────────────────────────────────── */}
      <EditorialSection surface="shade">
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
          lead="Après l'intervention, le quotidien du cabinet reçoit des sollicitations qui ne suivent pas un cadre : photos sans contexte, questions à J+1, relances entre canaux, historique à reconstituer. C'est ce bruit-là que KOVELA fait disparaître."
        />

        <div className="mt-10 max-w-[640px]">
          <EditorialObservations
            items={[
              "Photo envoyée sans contexte clinique.",
              "Question reformulée trois fois en deux jours.",
              "Cabinet sollicité pour vérifier une consigne déjà donnée.",
              "Historique reconstitué entre WhatsApp, mail et téléphone.",
            ]}
          />
        </div>

        <div className="mt-12 max-w-[640px]">
          <EditorialQuote>
            Le chirurgien reste maître du cadre médical. KOVELA prend en charge
            le bruit opérationnel.
          </EditorialQuote>
        </div>
      </EditorialSection>

      {/* ── Section 3 : Bloc solution V3 (avec corrections 1, 2, 3) ──────── */}
      <EditorialSection>
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

        <div className="mt-12">
          <EditorialMockupFrame caption="Aperçu cockpit — interface prototype superviseur KOVELA.">
            <CockpitMockupV2 />
          </EditorialMockupFrame>
        </div>

        <div className="mt-16 max-w-[760px]">
          <EditorialAlignedRows
            rows={[
              {
                label: "Le patient",
                value:
                  "sait où écrire, quoi attendre, et quand le cabinet sera sollicité.",
              },
              {
                label: "Le cabinet",
                value: "ne reconstitue plus l'historique.",
              },
              {
                label: "Le chirurgien",
                value:
                  "est sollicité lorsqu'un élément nécessite son attention ou une transmission cabinet.",
              },
              {
                label: "KOVELA",
                value: "fait disparaître le bruit opérationnel.",
              },
            ]}
          />
        </div>

        <EditorialRule className="mt-16" />
        <EditorialBody className="mt-8 max-w-[640px]">
          La supervision est assurée par une équipe humaine formée au
          référentiel de chaque cabinet. L&apos;assistance IA est interne : elle
          prépare, structure et documente, sans jamais répondre directement au
          patient.
        </EditorialBody>
      </EditorialSection>

      {/* ── Section 4 : Différenciation V3 (5 vs 5) ──────────────────────── */}
      <EditorialSection surface="shade">
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
      </EditorialSection>

      {/* ── Section 5 : CTA V3 + formulaire éditorial ────────────────────── */}
      <EditorialSection id="contact">
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

        <form className="mt-12 max-w-[560px] space-y-6">
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
          <EditorialInput label="Téléphone" type="tel" placeholder="06 ··" required />
          <EditorialInput label="Ville" placeholder="Paris, Lyon, Bordeaux…" required />
          <EditorialSelect label="Interventions / mois" required defaultValue="">
            <option value="" disabled>
              Sélectionner…
            </option>
            <option value="<10">Moins de 10</option>
            <option value="10-25">10 à 25</option>
            <option value="25-50">25 à 50</option>
            <option value="50+">50+</option>
          </EditorialSelect>
          <div>
            <EditorialPrimaryButton type="submit">
              Demander un échange opérationnel
            </EditorialPrimaryButton>
          </div>
          <EditorialFootnote>
            Réservé aux chirurgiens libéraux et cabinets avec activité
            opératoire régulière. Aucune donnée patient demandée.
          </EditorialFootnote>
        </form>
      </EditorialSection>

      {/* ── Pied de page V3 ─────────────────────────────────────────────── */}
      <footer className="bg-paper-shade px-6 py-12 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-[1280px]">
          <EditorialRule />
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink">
                KOVELA · France
              </p>
              <p className="mt-2 font-editorial text-[13px] leading-[1.55] text-ink-60">
                Service opéré de coordination post-opératoire pour chirurgiens
                libéraux.
              </p>
              <p className="mt-4 font-editorial text-[13px] text-ink">
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
                Architecture RGPD / HDS-ready pensée dès la conception. Cadre
                cabinet à valider en V1.
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
          <h1 className="mt-4 font-editorial text-[2rem] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[2.5rem]">
            Référence design system.
          </h1>
        </div>

        {/* ── Typographie ───────────────────────────────────────────────── */}
        <div className="space-y-10">
          <div>
            <EditorialEyebrow>TYPOGRAPHIE</EditorialEyebrow>
            <div className="mt-6 space-y-4">
              <EditorialTitle size="xl">Titre xl (hero potentiel)</EditorialTitle>
              <EditorialTitle size="lg">Titre lg (sections)</EditorialTitle>
              <EditorialTitle size="md">Titre md (sous-section)</EditorialTitle>
              <EditorialLead>
                EditorialLead — paragraphe d&apos;intro, body large 17px sur
                desktop. Letter-spacing -0.005em.
              </EditorialLead>
              <EditorialBody>
                EditorialBody — paragraphe standard 15px sur desktop. Le texte
                principal en lecture longue. Couleur ink-60 pour respiration.
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
          </div>

          <EditorialRule />

          {/* ── Inputs ──────────────────────────────────────────────────── */}
          <div>
            <EditorialEyebrow>FORMULAIRE</EditorialEyebrow>
            <div className="mt-6 max-w-[440px] space-y-6">
              <EditorialInput
                label="Nom complet"
                placeholder="Dr. C. Aragon"
                caption="Format libre."
              />
              <EditorialSelect label="Spécialité" defaultValue="">
                <option value="" disabled>
                  Sélectionner…
                </option>
                <option>Chirurgie esthétique</option>
                <option>Chirurgie plastique reconstructrice</option>
              </EditorialSelect>
            </div>
          </div>

          <EditorialRule />

          {/* ── Palette ─────────────────────────────────────────────────── */}
          <div>
            <EditorialEyebrow>PALETTE</EditorialEyebrow>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["paper", "#FAFAF7", "bg-paper border border-rule"],
                ["paper-shade", "#F1EFE8", "bg-paper-shade border border-rule"],
                ["ink", "#0F1419", "bg-ink"],
                ["ink-60", "#4A4F55", "bg-ink-60"],
                ["ink-30", "#8C9098", "bg-ink-30"],
                ["rule", "#D8D6D0", "bg-rule"],
                ["accent", "#2A6B5C", "bg-accent"],
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
          </div>

          <EditorialRule />

          {/* ── Numérotation ────────────────────────────────────────────── */}
          <div>
            <EditorialEyebrow>NUMÉROTATION + EYEBROW</EditorialEyebrow>
            <div className="mt-6 flex flex-wrap items-baseline gap-6">
              <EditorialNumber current="01" total="05" />
              <EditorialNumber current="02" total="05" />
              <EditorialNumber current="03" total="05" />
              <span className="text-ink-30">|</span>
              <EditorialEyebrow>LE QUOTIDIEN POST-OP</EditorialEyebrow>
              <EditorialEyebrow>PAS UN LOGICIEL</EditorialEyebrow>
            </div>
          </div>
        </div>
      </EditorialSection>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Cockpit mockup V2 — composition typographique disciplinée.
//
// Représente l'écran superviseur réel SANS chrome de fenêtre OS, SANS
// dots colorés cosmétiques. Une grille typographique sobre : 3 zones
// (File · Conversation · Actions cabinet) délimitées par des filets.
// Un seul accent couleur (alert orange brûlé) sur le chip SLA dépassé.
// ───────────────────────────────────────────────────────────────────────────

function CockpitMockupV2() {
  return (
    <div className="font-editorial-mono text-[10px] uppercase tracking-[0.12em] text-ink-60">
      <div className="flex items-baseline justify-between border-b border-rule pb-3">
        <span>Cockpit superviseur</span>
        <span className="text-ink-30">Service actif · 8h – 20h</span>
      </div>

      <div className="grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-rule">
        {/* ── Col 1 : File ──────────────────────────────────────────── */}
        <div className="pt-6 sm:pr-6">
          <p className="text-ink">01 · File patients</p>
          <p className="mt-1 text-ink-30">À traiter maintenant</p>

          <div className="mt-5 space-y-4 normal-case tracking-normal">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="font-editorial text-[14px] font-semibold text-ink">
                  A. D.
                </span>
                <span className="font-editorial-mono text-[10px] uppercase tracking-[0.1em] text-ink-30">
                  J+1
                </span>
              </div>
              <p className="font-editorial text-[12px] text-ink-60">
                Rhinoplastie
              </p>
              <p className="mt-2 inline-flex items-center gap-2 border border-alert px-2 py-0.5 font-editorial-mono text-[9.5px] uppercase tracking-[0.1em] text-alert">
                ⚠ SLA dépassé · 02 h
              </p>
            </div>

            <div className="border-t border-rule pt-3">
              <div className="flex items-baseline justify-between">
                <span className="font-editorial text-[13px] font-medium text-ink-60">
                  M. L.
                </span>
                <span className="font-editorial-mono text-[10px] uppercase tracking-[0.1em] text-ink-30">
                  J+3
                </span>
              </div>
              <p className="font-editorial text-[11.5px] text-ink-30">
                Blépharoplastie
              </p>
            </div>
          </div>
        </div>

        {/* ── Col 2 : Conversation ──────────────────────────────────── */}
        <div className="border-t border-rule pt-6 sm:border-t-0 sm:px-6">
          <p className="text-ink">02 · Conversation patient</p>
          <p className="mt-1 text-ink-30">Éléments déclarés</p>

          <div className="mt-5 space-y-3 normal-case tracking-normal">
            <div className="border-l-2 border-rule pl-3">
              <p className="font-editorial-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-60">
                Message patient · 14:02
              </p>
              <p className="mt-1 font-editorial text-[12.5px] leading-[1.5] text-ink">
                Léger œdème ce matin, photo jointe. Est-ce normal à J+1 ?
              </p>
            </div>
            <div className="border-l-2 border-accent pl-3">
              <p className="font-editorial-mono text-[9.5px] uppercase tracking-[0.1em] text-accent">
                Réponse préparée · à relire
              </p>
              <p className="mt-1 font-editorial text-[12.5px] leading-[1.5] text-ink">
                Bonjour, l&apos;œdème modéré à J+1 fait partie du suivi. Si
                évolution, nous restons disponibles.
              </p>
            </div>
          </div>
        </div>

        {/* ── Col 3 : Actions cabinet ───────────────────────────────── */}
        <div className="border-t border-rule pt-6 sm:border-t-0 sm:pl-6">
          <p className="text-ink">03 · Actions cabinet</p>
          <p className="mt-1 text-ink-30">Transmission · CR</p>

          <div className="mt-5 space-y-3 normal-case tracking-normal">
            <div>
              <p className="font-editorial text-[12px] text-ink">
                Transmission cabinet
              </p>
              <p className="font-editorial text-[11px] text-ink-30">
                Préparée · à valider
              </p>
            </div>
            <div className="border-t border-rule pt-2">
              <p className="font-editorial text-[12px] text-ink">
                CR factuel · J+15
              </p>
              <p className="font-editorial text-[11px] text-ink-30">
                À transmettre au chirurgien
              </p>
            </div>
            <div className="border-t border-rule pt-2">
              <p className="font-editorial text-[12px] text-ink">Journal</p>
              <p className="font-editorial text-[11px] text-ink-30">
                12 entrées · 48 h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
