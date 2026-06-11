// ───────────────────────────────────────────────────────────────────────────
// /styleguide-editorial — Showcase Phase 1 V4 Clinical Trust Premium.
//
// Page interne non liée depuis la nav, robots: noindex/nofollow.
// Sert UNIQUEMENT à la validation visuelle de la direction artistique
// « Clinical Trust Premium » avant Phase 2 (réécriture
// /chirurgiens-esthetiques).
//
// Différences vs V3 :
//   - Réassurance assumée beaucoup plus fortement.
//   - Bande inline sous le hero ET section dédiée « Sécurité & conformité »
//     avec 8 badges propriétaires (HDS, RGPD, Europe, Conformité CNIL,
//     Accès sécurisés, Journal d'action, Supervision humaine, IA interne).
//   - Bloc 03 utilise EditorialFeatureGrid avec icônes par fonctionnalité
//     (au lieu d'une liste label/valeur).
//   - Avant/Après upgradé : pictos ✓/✗ devant chaque item + divider VS au
//     centre.
//   - CTA final en bandeau ink-100 dédié.
//   - Structure passée à 6 sections (Hero / Avant-Après / Prise en charge /
//     Sécurité / Pas un logiciel / Échange).
//
// Formulations conformité — SAFE :
//   - « Hébergement HDS » (sous-libellé : « Hébergeur certifié »).
//     KOVELA s'appuie sur un hébergeur certifié HDS, KOVELA elle-même n'est
//     pas certifiée HDS en propre tant que la procédure n'est pas finalisée.
//   - « Cadre RGPD » documenté.
//   - « Données en Europe » localisation européenne.
//   - « Conformité CNIL » aux exigences (jamais « certifié CNIL »,
//     jamais logo officiel).
//   - « Accès sécurisés » · « Journal d'action ».
//   - « Supervision humaine » · « Assistance IA interne ».
//
// À supprimer ou rendre privé une fois la direction validée et appliquée.
// ───────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import {
  EditorialAvantApres,
  EditorialBody,
  EditorialCTAFinal,
  EditorialColumns,
  EditorialEyebrow,
  EditorialFeatureGrid,
  EditorialFootnote,
  EditorialHumanHero,
  EditorialInput,
  EditorialLead,
  EditorialList,
  EditorialMockupFrame,
  EditorialNumber,
  EditorialObservations,
  EditorialPrimaryButton,
  EditorialQuote,
  EditorialReassurance,
  EditorialRule,
  EditorialSecondaryButton,
  EditorialSection,
  EditorialSecurityPanel,
  EditorialSelect,
  EditorialTitle,
  IconArrow,
  IconCheck,
  IconClock,
  IconDiamond,
  IconDocument,
  IconGlobe,
  IconList,
  IconLock,
  IconPerson,
  IconShield,
  IconStar,
  SectionHeader,
} from "@/components/editorial";

// ───────────────────────────────────────────────────────────────────────────
// VISUEL HUMAIN PROVISOIRE
//
// Photo Unsplash utilisée uniquement pour valider la perception de la
// direction « Clinical Trust Premium ». À REMPLACER avant publication par
// une photographie commissionnée éthiquement : cabinet privé premium,
// chirurgien / patient / cabinet, sobre, sans visage trompeur pouvant
// laisser croire à un faux médecin de référence KOVELA.
//
// Critères pour la commande V1 :
//   - prise de vue calme, lumière naturelle ;
//   - cadrage cabinet réel (pas de studio fond blanc) ;
//   - pas de sourire publicitaire ;
//   - pas de pose marketing ;
//   - pas de blouse blanche stéréotypée ;
//   - droits cédés à KOVELA, modèle release signé.
// ───────────────────────────────────────────────────────────────────────────
const HERO_PHOTO_TEMP =
  "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=1200&h=1500&auto=format&fit=crop&q=80";

export const metadata: Metadata = {
  title: "KOVELA — Styleguide éditorial (interne)",
  description: "Showcase Phase 1 V4 du système visuel — Clinical Trust Premium.",
  robots: { index: false, follow: false },
};

// ─── Données ───────────────────────────────────────────────────────────────

const REASSURANCE_INLINE = [
  { label: "Hébergement HDS", sub: "Hébergeur certifié", icon: IconShield },
  { label: "Cadre RGPD", sub: "Documenté · conception", icon: IconDocument },
  { label: "Données en Europe", sub: "Localisation européenne", icon: IconGlobe },
  { label: "Supervision humaine", sub: "Équipe formée cabinet", icon: IconPerson },
  { label: "Assistance IA interne", sub: "Jamais autonome patient", icon: IconDiamond },
];

const AVANT_ITEMS = [
  "Appels, mails, SMS, photos arrivent par cinq canaux différents.",
  "Historique à reconstituer pour chaque question patient.",
  "Cabinet sollicité plusieurs fois par jour pour des sujets post-op.",
  "Le chirurgien est sollicité en dehors du bon cadre.",
  "Aucune trace consolidée du suivi en fin de parcours.",
];

const APRES_ITEMS = [
  "Le patient écrit dans un canal unique, encadré par le cabinet.",
  "L'historique est structuré et accessible en quelques secondes.",
  "Les échanges opérationnels courants sont pris en charge par KOVELA.",
  "Le chirurgien est sollicité lorsqu'un élément nécessite son attention.",
  "Un CR factuel et un journal d'action clôturent chaque suivi.",
];

const FEATURES = [
  {
    icon: IconPerson,
    label: "Suivi patient",
    description: "Parcours post-op structuré selon votre référentiel cabinet.",
  },
  {
    icon: IconClock,
    label: "Relances",
    description: "Messages programmés selon vos jalons (J+1, J+7, J+15…).",
  },
  {
    icon: IconList,
    label: "Éléments déclarés",
    description: "Documentés factuellement, sans interprétation médicale.",
  },
  {
    icon: IconArrow,
    label: "Transmissions cabinet",
    description: "Compilation factuelle envoyée sur votre canal validé.",
  },
  {
    icon: IconDocument,
    label: "Journal d'action",
    description: "Traçabilité opérationnelle horodatée, accessible à tout moment.",
  },
  {
    icon: IconShield,
    label: "CR factuel",
    description: "Synthèse courte de fin de suivi, à votre disposition.",
  },
  {
    icon: IconStar,
    label: "Avis Google",
    description: "Demande neutre en fin de parcours, validée avec le cabinet.",
  },
  {
    icon: IconLock,
    label: "Accès sécurisés",
    description: "Rôles et permissions distincts, journal d'audit complet.",
  },
];

const SECURITY_BADGES = [
  { label: "Hébergement HDS", sub: "Hébergeur certifié", icon: IconShield },
  { label: "Cadre RGPD", sub: "Documenté · conception", icon: IconDocument },
  { label: "Données en Europe", sub: "Localisation européenne", icon: IconGlobe },
  { label: "Conformité CNIL", sub: "Aux exigences", icon: IconCheck },
  { label: "Accès sécurisés", sub: "Rôles & permissions", icon: IconLock },
  { label: "Journal d'action", sub: "Audit trail complet", icon: IconList },
  { label: "Supervision humaine", sub: "Équipe formée cabinet", icon: IconPerson },
  { label: "Assistance IA interne", sub: "Jamais autonome patient", icon: IconDiamond },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function EditorialStyleguide() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ── Bandeau interne ─────────────────────────────────────────────── */}
      <div className="border-b border-rule bg-paper-shade px-6 py-3 sm:px-10 lg:px-20">
        <p className="mx-auto flex max-w-[1280px] items-baseline justify-between font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-60">
          <span>KOVELA · Styleguide V4 · Clinical Trust Premium</span>
          <span className="text-ink-30">Interne · non indexé</span>
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
            01. HERO HUMAIN
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSection className="!py-12 sm:!py-16 lg:!py-24">
        <p className="mb-12 font-editorial-mono text-[14px] uppercase tracking-[0.18em] text-ink lg:mb-20">
          KOVELA
        </p>

        <EditorialHumanHero
          number="01"
          total="06"
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
              libéraux. Supervision humaine. Assistance IA interne.
              Hébergement HDS. Cadre RGPD.
            </>
          }
          primaryCta={{ label: "Demander un échange opérationnel", href: "#contact" }}
          photoSrc={HERO_PHOTO_TEMP}
          photoAlt="Cabinet médical premium — visuel provisoire à remplacer par une photographie commissionnée"
          photoCaption="Visuel provisoire · photographie cabinet à commissionner pour V1"
        />
      </EditorialSection>

      {/* ── Bande de réassurance immédiate, juste sous le hero ─────────── */}
      <EditorialReassurance items={REASSURANCE_INLINE} surface="cream" />

      {/* ════════════════════════════════════════════════════════════════════
            02. AVANT / APRÈS KOVELA
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSection>
        <SectionHeader
          number="02"
          total="06"
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
            03. CE QUE KOVELA PREND EN CHARGE
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSection surface="shade" id="prise-en-charge">
        <SectionHeader
          number="03"
          total="06"
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

        {/* Grille de fonctionnalités avec icônes — plus visuel que la liste
            label/valeur. 8 items en grille 4 colonnes desktop. */}
        <div className="mt-14">
          <EditorialFeatureGrid items={FEATURES} />
        </div>

        <EditorialRule className="mt-16" />

        {/* Mockup cockpit — preuve du service opéré, secondaire après le
            texte. Sobre, sans chrome OS, sans dashboard SaaS générique. */}
        <div className="mt-12">
          <p className="mb-4 font-editorial-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-60">
            ─── Aperçu cockpit opérateur ───
          </p>
          <EditorialMockupFrame caption="Aperçu interface prototype superviseur · visuel à valider pour V1">
            <CockpitMockupV2 />
          </EditorialMockupFrame>
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
            04. SÉCURITÉ & CONFORMITÉ — panel dédié, présence forte
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSecurityPanel
        eyebrow="04 / 06    SÉCURITÉ & CONFORMITÉ"
        title={
          <>
            Pensé pour les données
            <br />
            de santé.
          </>
        }
        intro="KOVELA est conçu pour répondre aux exigences réglementaires applicables aux services de coordination de soins. L'architecture, l'hébergement et les protocoles sont alignés sur le cadre HDS, RGPD et les exigences CNIL applicables."
        badges={SECURITY_BADGES}
        footnote={
          <>
            KOVELA s&apos;appuie sur un hébergeur certifié HDS. La mention
            « Conformité CNIL » désigne le respect des exigences applicables
            (RGPD, recommandations CNIL), sans constituer un label officiel.
            Le cadre cabinet sera finalisé en V1.
          </>
        }
      />

      {/* ════════════════════════════════════════════════════════════════════
            05. PAS UN LOGICIEL — DIFFÉRENCIATION
          ════════════════════════════════════════════════════════════════════ */}
      <EditorialSection>
        <SectionHeader
          number="05"
          total="06"
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
            06. ÉCHANGE OPÉRATIONNEL — CTA banner + formulaire
          ════════════════════════════════════════════════════════════════════ */}

      {/* Banner CTA fort en fond ink — appel à l'action principale */}
      <EditorialCTAFinal
        eyebrow="06 / 06    ÉCHANGE OPÉRATIONNEL"
        title={
          <>
            Voyons si KOVELA convient
            <br />
            à votre cabinet.
          </>
        }
        lead="Vingt minutes pour comprendre votre volume, votre organisation actuelle et vos habitudes de suivi. Aucune préparation requise de votre côté."
        primaryCta={{ label: "Demander un échange opérationnel", href: "#contact" }}
        note="Aucune donnée patient demandée — réservé aux chirurgiens libéraux."
      />

      {/* Formulaire — accessible directement sous le banner CTA */}
      <EditorialSection surface="shade" id="contact">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Colonne gauche — garanties */}
          <div>
            <p className="font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-60">
              CE QUE NOUS GARANTISSONS
            </p>
            <ul className="mt-6 space-y-4 font-editorial text-[14.5px] leading-[1.55] text-ink">
              {[
                "Aucune donnée patient demandée dans ce formulaire.",
                "Échange opérationnel, pas une démo commerciale.",
                "Réponse sous 48 h ouvrées.",
                "Cadre cabinet présenté en clair : HDS · RGPD · Europe · Supervision humaine.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span aria-hidden className="mt-0.5 shrink-0 text-accent">
                    {IconCheck}
                  </span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne droite — formulaire */}
          <form className="bg-paper p-8 sm:p-10">
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
          </form>
        </div>
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
                KOVELA s&apos;appuie sur un hébergement HDS (hébergeur
                certifié), un cadre RGPD documenté, des données hébergées en
                Europe et respecte les exigences CNIL applicables. Le service
                ne remplace pas le chirurgien, ne pose pas de diagnostic, ne
                prescrit pas et ne prend aucune décision médicale.
              </EditorialFootnote>
              <EditorialFootnote className="mt-3">
                En cas de situation urgente ou de doute, le patient contacte le
                15 / 112, les urgences de la clinique ou suit les consignes
                remises par son chirurgien. Cadre cabinet à finaliser en V1.
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
              Règles d&apos;usage : <code>accent</code> max 3 fois par page
              (status, focus, accent vert). <code>warm-accent</code> pour les
              éléments humains. <code>alert</code> seulement quand
              l&apos;alerte est réelle. Tout le reste en niveaux d&apos;ink.
              ZÉRO gradient, ZÉRO glow.
            </EditorialFootnote>
          </div>

          <EditorialRule />

          {/* ── Icônes custom ───────────────────────────────────────────── */}
          <div>
            <EditorialEyebrow>ICÔNES CUSTOM 1PX STROKE</EditorialEyebrow>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {[
                ["IconShield", IconShield],
                ["IconDocument", IconDocument],
                ["IconGlobe", IconGlobe],
                ["IconPerson", IconPerson],
                ["IconDiamond", IconDiamond],
                ["IconLock", IconLock],
                ["IconClock", IconClock],
                ["IconList", IconList],
                ["IconArrow", IconArrow],
                ["IconStar", IconStar],
              ].map(([name, icon]) => (
                <div
                  key={name as string}
                  className="border border-rule p-4 text-center"
                >
                  <div className="flex justify-center text-ink">{icon as React.ReactNode}</div>
                  <p className="mt-3 font-editorial-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-60">
                    {name as string}
                  </p>
                </div>
              ))}
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

// ───────────────────────────────────────────────────────────────────────────
// Cockpit mockup V2 — composition typographique sobre.
//
// Sans chrome de fenêtre OS, sans dashboard SaaS générique. 3 zones :
//   01 File patients · 02 Conversation · 03 Actions cabinet.
// Un seul élément coloré : chip alert orange brûlé sur le SLA dépassé.
// Démontre le suivi opérationnel sans diagnostic, sans alerte médicale,
// sans détection de complication, sans réponse autonome au patient.
// ───────────────────────────────────────────────────────────────────────────
function CockpitMockupV2() {
  return (
    <div className="font-editorial-mono text-[10px] uppercase tracking-[0.12em] text-ink-60">
      <div className="flex items-baseline justify-between border-b border-rule pb-3">
        <span>Cockpit superviseur</span>
        <span className="text-ink-30">Service actif · 8 h – 20 h</span>
      </div>

      <div className="grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-rule">
        {/* ── Col 1 : File patients ─────────────────────────────────── */}
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
                Réponse selon référentiel cabinet, à valider avant envoi.
              </p>
            </div>
          </div>
        </div>

        {/* ── Col 3 : Actions cabinet ───────────────────────────────── */}
        <div className="border-t border-rule pt-6 sm:border-t-0 sm:pl-6">
          <p className="text-ink">03 · Actions cabinet</p>
          <p className="mt-1 text-ink-30">Transmission · CR · journal</p>

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
              <p className="font-editorial text-[12px] text-ink">Journal d&apos;action</p>
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
