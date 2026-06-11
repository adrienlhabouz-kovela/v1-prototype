// ───────────────────────────────────────────────────────────────────────────
// Primitives éditoriales KOVELA — Operating Room Discipline.
//
// Direction artistique validée (voir docs/strategy/KOVELA-direction-
// artistique-v2.pdf). Ce module expose les blocs primitifs nécessaires
// pour composer chaque page éditoriale du site :
//
//   <EditorialSection>     — section principale, accueille les autres primitives.
//   <SectionHeader>        — entête numéroté ([NN / TT] EYEBROW + H2).
//   <EditorialNumber>      — numérotation mono « 01 / 05 ».
//   <EditorialEyebrow>     — eyebrow uppercase mono.
//   <EditorialTitle>       — H2 discipliné, large, letter-spacing négatif.
//   <EditorialLead>        — paragraphe d'intro, body large.
//   <EditorialBody>        — paragraphe de body standard.
//   <EditorialList>        — liste verticale à filet (— bullet).
//   <EditorialNumberedList>— liste numérotée mono à filet.
//   <EditorialObservations>— observations « 01 ── ... » format problème.
//   <EditorialColumns>     — 2 colonnes typographiques (Pas un logiciel / Est).
//   <EditorialAlignedRows> — lignes label / valeur alignées (bénéfices).
//   <EditorialQuote>       — citation attribuée, bordure gauche accent.
//   <EditorialRule>        — filet horizontal séparateur.
//   <EditorialFootnote>    — paragraphe pied de page discret.
//   <EditorialPrimaryButton> + <EditorialSecondaryButton>
//                          — boutons strictement disciplinés.
//   <EditorialInput>       — input formulaire underline + label flottant.
//   <EditorialMockupFrame> — wrapper pour le cockpit mockup typographique.
//
// Règles strictes — voir docs/strategy/ pour la doctrine complète :
//   - Aucun gradient, aucun glow, aucune shadow colorée.
//   - <accent> max 3 fois par page. <alert> seulement quand l'alerte est réelle.
//   - Tous les boutons rectangulaires (radius 4px max).
//   - Baseline 8px. Largeur conteneur max 1280px (max-w-[80rem]).
//   - Mobile-first : marges latérales 24px, montent à 80px sur desktop.
// ───────────────────────────────────────────────────────────────────────────

import React from "react";

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Section principale + entête numéroté                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

interface EditorialSectionProps {
  id?: string;
  /** Couleur de fond — `paper` par défaut, `paper-shade` pour contraste doux. */
  surface?: "paper" | "shade";
  className?: string;
  children: React.ReactNode;
}

/**
 * Section éditoriale. Pose le rythme vertical et la grille horizontale.
 * Espacement entre sections géré par la propriété `surface` (background)
 * et par la propre composition interne. Ne contient pas de cards.
 */
export function EditorialSection({
  id,
  surface = "paper",
  className = "",
  children,
}: EditorialSectionProps) {
  const bg = surface === "shade" ? "bg-paper-shade" : "bg-paper";
  return (
    <section
      id={id}
      className={`${bg} px-6 py-16 sm:px-10 sm:py-24 lg:px-20 lg:py-40 ${className}`}
    >
      <div className="mx-auto max-w-[1280px]">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  /** Numéro de section, ex: "01" */
  number: string;
  /** Total de sections, ex: "05". Affichage final "01 / 05". */
  total: string;
  eyebrow: string;
  title: React.ReactNode;
  /** Optionnel — paragraphe de cadrage juste sous le titre. */
  lead?: React.ReactNode;
}

/**
 * Entête de section éditoriale.
 *   ───────────────────  (filet rule)
 *   [01 / 05]   EYEBROW
 *
 *   Titre sur 1 à 3 lignes
 *
 *   Lead paragraph optionnel.
 */
export function SectionHeader({
  number,
  total,
  eyebrow,
  title,
  lead,
}: SectionHeaderProps) {
  return (
    <header>
      <div className="border-t border-rule pt-3">
        <div className="flex items-baseline gap-x-6 font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-60">
          <span className="text-ink-30">
            {number} <span className="text-ink-30/60">/</span> {total}
          </span>
          <span>{eyebrow}</span>
        </div>
      </div>
      <h2 className="mt-6 font-editorial text-[2.25rem] font-extrabold leading-[1.02] tracking-[-0.025em] text-ink sm:mt-8 sm:text-[3rem] lg:text-[3.5rem]">
        {title}
      </h2>
      {lead && (
        <p className="mt-6 max-w-[44ch] font-editorial text-[16px] leading-[1.55] tracking-[-0.005em] text-ink-60 sm:text-[17px] sm:mt-8">
          {lead}
        </p>
      )}
    </header>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Numérotation + eyebrow + titres + paragraphes                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

export function EditorialNumber({
  current,
  total,
  className = "",
}: {
  current: string;
  total: string;
  className?: string;
}) {
  return (
    <span
      className={`font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-30 ${className}`}
    >
      {current} <span className="text-ink-30/60">/</span> {total}
    </span>
  );
}

export function EditorialEyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-60 ${className}`}
    >
      {children}
    </p>
  );
}

export function EditorialTitle({
  as: Tag = "h2",
  size = "lg",
  className = "",
  children,
}: {
  as?: "h1" | "h2" | "h3";
  size?: "xl" | "lg" | "md";
  className?: string;
  children: React.ReactNode;
}) {
  const sizes: Record<typeof size, string> = {
    xl: "text-[2.5rem] sm:text-[3.75rem] lg:text-[4.75rem] tracking-[-0.035em] leading-[0.98] font-extrabold",
    lg: "text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] tracking-[-0.025em] leading-[1.02] font-extrabold",
    md: "text-[1.5rem] sm:text-[1.75rem] tracking-[-0.015em] leading-[1.15] font-bold",
  };
  return (
    <Tag className={`font-editorial text-ink ${sizes[size]} ${className}`}>
      {children}
    </Tag>
  );
}

export function EditorialLead({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`font-editorial text-[16px] leading-[1.55] tracking-[-0.005em] text-ink-60 sm:text-[17px] ${className}`}
    >
      {children}
    </p>
  );
}

export function EditorialBody({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`font-editorial text-[14.5px] leading-[1.6] text-ink-60 sm:text-[15px] ${className}`}
    >
      {children}
    </p>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Listes éditoriales                                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

export function EditorialList({
  items,
  className = "",
}: {
  items: React.ReactNode[];
  className?: string;
}) {
  return (
    <ul className={`space-y-2 font-editorial text-[14.5px] leading-[1.55] text-ink ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="select-none text-ink-30">—</span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Observations format problème : « 01 ── description ».
 * Une seule ligne par observation, pas de wrap brutal.
 */
export function EditorialObservations({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ol className={`space-y-3 font-editorial text-[14.5px] leading-[1.55] text-ink ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span
            aria-hidden
            className="select-none font-editorial-mono text-[11px] uppercase tracking-[0.1em] text-ink-30"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="select-none text-ink-30">──</span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ol>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Deux colonnes typographiques (Pas un logiciel / Est)                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

interface EditorialColumnsProps {
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
}

export function EditorialColumns({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
}: EditorialColumnsProps) {
  return (
    <div className="grid gap-12 sm:grid-cols-2 sm:gap-16">
      {[
        { title: leftTitle, items: leftItems },
        { title: rightTitle, items: rightItems },
      ].map((col, idx) => (
        <div key={idx}>
          <p className="border-b border-rule pb-3 font-editorial text-[12.5px] font-medium uppercase tracking-[0.1em] text-ink-60">
            {col.title}
          </p>
          <ul className="mt-4 space-y-2.5 font-editorial text-[15.5px] leading-[1.55] text-ink">
            {col.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Lignes label / valeur alignées (bénéfices section solution)           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

export function EditorialAlignedRows({
  rows,
  className = "",
}: {
  rows: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={`divide-y divide-rule ${className}`}>
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-1 gap-y-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-x-8"
        >
          <dt className="font-editorial-mono text-[11px] uppercase tracking-[0.12em] text-ink-60">
            {row.label}
          </dt>
          <dd className="font-editorial text-[15.5px] leading-[1.5] text-ink">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Citation éditoriale                                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

export function EditorialQuote({
  children,
  author,
  className = "",
}: {
  children: React.ReactNode;
  author?: string;
  className?: string;
}) {
  return (
    <blockquote className={`border-l-2 border-accent pl-5 ${className}`}>
      <p className="font-editorial text-[1.25rem] font-semibold leading-[1.35] tracking-[-0.015em] text-ink sm:text-[1.4rem]">
        {children}
      </p>
      {author && (
        <footer className="mt-3 font-editorial-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-60">
          — {author}
        </footer>
      )}
    </blockquote>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Filets, footnotes                                                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝

export function EditorialRule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-rule ${className}`} />;
}

export function EditorialFootnote({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`font-editorial text-[12px] leading-[1.55] text-ink-30 ${className}`}
    >
      {children}
    </p>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Boutons stricts — 2 variants uniquement                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

const PRIMARY_CLS =
  "inline-flex h-12 items-center justify-center rounded-[4px] bg-ink px-6 font-editorial text-[14px] font-medium tracking-[-0.005em] text-paper transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-40";

const SECONDARY_CLS =
  "inline-flex h-12 items-center justify-center rounded-[4px] border border-rule bg-transparent px-6 font-editorial text-[14px] font-medium tracking-[-0.005em] text-ink transition-colors hover:bg-paper-shade focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-40";

export function EditorialPrimaryButton(props: ButtonProps | AnchorProps) {
  if ("href" in props && props.href) {
    const { href, className = "", children, ...rest } = props as AnchorProps;
    return (
      <a href={href} className={`${PRIMARY_CLS} ${className}`} {...rest}>
        {children}
      </a>
    );
  }
  const { className = "", children, ...rest } = props as ButtonProps;
  return (
    <button type="button" className={`${PRIMARY_CLS} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function EditorialSecondaryButton(props: ButtonProps | AnchorProps) {
  if ("href" in props && props.href) {
    const { href, className = "", children, ...rest } = props as AnchorProps;
    return (
      <a href={href} className={`${SECONDARY_CLS} ${className}`} {...rest}>
        {children}
      </a>
    );
  }
  const { className = "", children, ...rest } = props as ButtonProps;
  return (
    <button type="button" className={`${SECONDARY_CLS} ${className}`} {...rest}>
      {children}
    </button>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Formulaire éditorial — input underline + label flottant               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

interface EditorialInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Affiche une caption d'aide sous l'input. */
  caption?: string;
}

export function EditorialInput({
  label,
  caption,
  className = "",
  id,
  ...rest
}: EditorialInputProps) {
  const inputId = id ?? `editorial-input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="group">
      <label
        htmlFor={inputId}
        className="block font-editorial-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-60"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`block w-full border-0 border-b border-rule bg-transparent py-2 font-editorial text-[15px] leading-tight text-ink placeholder:text-ink-30 focus:border-ink focus:outline-none focus:ring-0 ${className}`}
        {...rest}
      />
      {caption && (
        <p className="mt-1.5 font-editorial text-[11.5px] leading-[1.45] text-ink-30">
          {caption}
        </p>
      )}
    </div>
  );
}

interface EditorialSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  caption?: string;
  children: React.ReactNode;
}

export function EditorialSelect({
  label,
  caption,
  className = "",
  id,
  children,
  ...rest
}: EditorialSelectProps) {
  const inputId = id ?? `editorial-select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label
        htmlFor={inputId}
        className="block font-editorial-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-60"
      >
        {label}
      </label>
      <select
        id={inputId}
        className={`block w-full appearance-none border-0 border-b border-rule bg-transparent py-2 font-editorial text-[15px] leading-tight text-ink focus:border-ink focus:outline-none focus:ring-0 ${className}`}
        {...rest}
      >
        {children}
      </select>
      {caption && (
        <p className="mt-1.5 font-editorial text-[11.5px] leading-[1.45] text-ink-30">
          {caption}
        </p>
      )}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Hero humain — Clinical Trust Premium                                  ║
// ║                                                                        ║
// ║  Layout 2 colonnes (text gauche · photo droite) sur desktop, empilé    ║
// ║  sur mobile. Le visuel à droite est soit une vraie photo (à            ║
// ║  commissionner pour V1), soit un placeholder typographique sobre.      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

interface EditorialHumanHeroProps {
  number: string;
  total: string;
  eyebrow: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  /** URL de la photo. Laisser undefined pour afficher le placeholder. */
  photoSrc?: string;
  /** Alt de la photo. */
  photoAlt?: string;
  /** Bouton primary (texte + href). */
  primaryCta: { label: string; href: string };
  /** Optionnel — bouton secondary. */
  secondaryCta?: { label: string; href: string };
  /** Optionnel — caption sous la photo (placeholder ou crédit). */
  photoCaption?: string;
}

export function EditorialHumanHero({
  number,
  total,
  eyebrow,
  title,
  lead,
  photoSrc,
  photoAlt = "",
  primaryCta,
  secondaryCta,
  photoCaption,
}: EditorialHumanHeroProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
      {/* Colonne gauche — texte */}
      <div className="flex flex-col justify-center">
        <div className="border-t border-rule pt-3">
          <div className="flex items-baseline gap-x-6 font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-60">
            <span className="text-ink-30">
              {number} <span className="text-ink-30/60">/</span> {total}
            </span>
            <span>{eyebrow}</span>
          </div>
        </div>
        <h1 className="mt-6 font-editorial text-[2.25rem] font-extrabold leading-[1.02] tracking-[-0.025em] text-ink sm:text-[2.75rem] sm:mt-8 lg:text-[3.5rem]">
          {title}
        </h1>
        <p className="mt-6 max-w-[48ch] font-editorial text-[16px] leading-[1.55] tracking-[-0.005em] text-ink-60 sm:text-[17px] sm:mt-8">
          {lead}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
          <EditorialPrimaryButton href={primaryCta.href}>
            {primaryCta.label}
          </EditorialPrimaryButton>
          {secondaryCta && (
            <EditorialSecondaryButton href={secondaryCta.href}>
              {secondaryCta.label}
            </EditorialSecondaryButton>
          )}
        </div>
      </div>

      {/* Colonne droite — photo ou placeholder */}
      <div className="relative">
        {photoSrc ? (
          <figure className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoSrc}
              alt={photoAlt}
              className="aspect-[4/5] w-full object-cover"
            />
            {/* Filet d'enrobage discret pour ancrer la photo dans le système */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 border border-rule"
            />
            {photoCaption && (
              <figcaption className="mt-3 font-editorial-mono text-[10px] uppercase tracking-[0.14em] text-ink-30">
                {photoCaption}
              </figcaption>
            )}
          </figure>
        ) : (
          <EditorialPhotoPlaceholder caption={photoCaption} />
        )}
      </div>
    </div>
  );
}

/**
 * Placeholder photo — utilisé quand aucune photo réelle n'est encore
 * commissionnée. Crème + warm-accent, sobre, demonstre la zone du visuel
 * sans tricher.
 */
export function EditorialPhotoPlaceholder({
  caption = "Photographie cabinet à commissionner pour V1",
}: {
  caption?: string;
}) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream">
      {/* Composition typographique discrète au centre */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        {/* Petite forme géométrique sobre suggérant la présence */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="mb-8 text-warm-accent opacity-40"
        >
          <circle cx="32" cy="22" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
          <path
            d="M14 56 C 14 42, 50 42, 50 56"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <p className="font-editorial-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-60">
          {caption}
        </p>
      </div>
      {/* Filet d'enrobage sobre */}
      <div className="pointer-events-none absolute inset-0 border border-rule" />
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Réassurance — bande de badges propriétaires KOVELA                    ║
// ║                                                                        ║
// ║  HDS · RGPD · Europe · Supervision humaine · Assistance IA interne.    ║
// ║  PAS de logo institutionnel (CNIL, drapeau EU, etc.). PAS de claim     ║
// ║  « certifié ». Badges KOVELA propriétaires : icône custom 1px stroke   ║
// ║  + label éditorial + sub-label mono. Style premium, sobre, assumé.     ║
// ║  Couleurs à plat seulement, AUCUN gradient.                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

export interface ReassuranceItem {
  label: string;
  /** Sous-libellé optionnel (caption mono). */
  sub?: string;
  /** Icône SVG custom — 1px stroke ink-100, 24×24 viewBox. */
  icon: React.ReactNode;
}

// ─── Icônes custom 1px stroke (Müller-Brockmann school) ─────────────────
// 24×24 viewBox, currentColor, stroke-width 1.25. Géométrie stricte, pas
// de pictogramme cheap. Style cohérent entre les 5 badges.

const STROKE = {
  width: 1.25,
  linecap: "round" as const,
  linejoin: "round" as const,
  fill: "none" as const,
};

export const IconShield = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 3 L20 6 V12 C20 16.5 16.5 19.5 12 21 C7.5 19.5 4 16.5 4 12 V6 Z"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
      strokeLinejoin={STROKE.linejoin}
      fill={STROKE.fill}
    />
    <path
      d="M9 12 L11 14 L15.5 9.5"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
      strokeLinejoin={STROKE.linejoin}
      fill={STROKE.fill}
    />
  </svg>
);

export const IconDocument = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M6 3 H15 L18 6 V21 H6 Z"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinejoin={STROKE.linejoin}
      fill={STROKE.fill}
    />
    <path
      d="M15 3 V6 H18"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinejoin={STROKE.linejoin}
      fill={STROKE.fill}
    />
    <line
      x1="9"
      y1="11"
      x2="15"
      y2="11"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
    />
    <line
      x1="9"
      y1="14"
      x2="15"
      y2="14"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
    />
    <line
      x1="9"
      y1="17"
      x2="13"
      y2="17"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
    />
  </svg>
);

export const IconGlobe = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      fill={STROKE.fill}
    />
    <ellipse
      cx="12"
      cy="12"
      rx="4"
      ry="9"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      fill={STROKE.fill}
    />
    <line
      x1="3"
      y1="12"
      x2="21"
      y2="12"
      stroke="currentColor"
      strokeWidth={STROKE.width}
    />
    <line
      x1="3.5"
      y1="8"
      x2="20.5"
      y2="8"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
    />
    <line
      x1="3.5"
      y1="16"
      x2="20.5"
      y2="16"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
    />
  </svg>
);

export const IconPerson = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <circle
      cx="12"
      cy="8.5"
      r="3.75"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      fill={STROKE.fill}
    />
    <path
      d="M5 21 C 5 16.5, 8 14, 12 14 C 16 14, 19 16.5, 19 21"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
      fill={STROKE.fill}
    />
  </svg>
);

export const IconDiamond = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 3 L21 12 L12 21 L3 12 Z"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinejoin={STROKE.linejoin}
      fill={STROKE.fill}
    />
    <path
      d="M7.5 12 L12 7.5 L16.5 12 L12 16.5 Z"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinejoin={STROKE.linejoin}
      fill={STROKE.fill}
    />
  </svg>
);

export const IconLock = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <rect
      x="5"
      y="11"
      width="14"
      height="9"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      fill={STROKE.fill}
    />
    <path
      d="M8 11 V8 C 8 5.5 9.8 4 12 4 C 14.2 4 16 5.5 16 8 V11"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
      fill={STROKE.fill}
    />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
  </svg>
);

export const IconClock = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <circle
      cx="12"
      cy="12"
      r="8.5"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      fill={STROKE.fill}
    />
    <path
      d="M12 7 V12 L15 14.5"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
      strokeLinejoin={STROKE.linejoin}
      fill={STROKE.fill}
    />
  </svg>
);

export const IconList = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <line x1="9" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth={STROKE.width} strokeLinecap={STROKE.linecap} />
    <line x1="9" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth={STROKE.width} strokeLinecap={STROKE.linecap} />
    <line x1="9" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth={STROKE.width} strokeLinecap={STROKE.linecap} />
    <circle cx="5" cy="6" r="1" fill="currentColor" />
    <circle cx="5" cy="12" r="1" fill="currentColor" />
    <circle cx="5" cy="18" r="1" fill="currentColor" />
  </svg>
);

export const IconArrow = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M5 12 H19"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
    />
    <path
      d="M13 6 L19 12 L13 18"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
      strokeLinejoin={STROKE.linejoin}
      fill={STROKE.fill}
    />
  </svg>
);

export const IconLink = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M10 14 L14 10"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
    />
    <path
      d="M13.5 7.5 L15 6 C 17 4 20 4 21.5 6 C 23 7.5 23 10 21.5 12 L20 13.5"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
      fill={STROKE.fill}
    />
    <path
      d="M10.5 16.5 L9 18 C 7 20 4 20 2.5 18 C 1 16.5 1 14 2.5 12 L4 10.5"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.linecap}
      fill={STROKE.fill}
    />
  </svg>
);

export const IconStar = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 3.5 L14.4 9 L20.5 9.6 L15.8 13.6 L17.3 19.5 L12 16.4 L6.7 19.5 L8.2 13.6 L3.5 9.6 L9.6 9 Z"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinejoin={STROKE.linejoin}
      fill={STROKE.fill}
    />
  </svg>
);

export const IconCheck = (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth={STROKE.width} fill={STROKE.fill} />
    <path d="M6.5 10 L9 12.5 L13.5 8" stroke="currentColor" strokeWidth={STROKE.width} strokeLinecap={STROKE.linecap} strokeLinejoin={STROKE.linejoin} fill={STROKE.fill} />
  </svg>
);

export const IconCross = (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth={STROKE.width} fill={STROKE.fill} />
    <path d="M7 7 L13 13 M13 7 L7 13" stroke="currentColor" strokeWidth={STROKE.width} strokeLinecap={STROKE.linecap} fill={STROKE.fill} />
  </svg>
);

export function EditorialReassurance({
  items,
  surface = "cream",
}: {
  items: ReassuranceItem[];
  /** Couleur de fond : cream (par défaut) ou paper. */
  surface?: "cream" | "paper" | "shade";
}) {
  const bg =
    surface === "cream" ? "bg-cream" : surface === "shade" ? "bg-paper-shade" : "bg-paper";
  return (
    <div className={`${bg} border-y border-rule`}>
      <div className="mx-auto max-w-[1280px] px-6 py-8 sm:px-10 sm:py-10 lg:px-20 lg:py-12">
        {/* Légende discrète au-dessus de la bande */}
        <p className="mb-6 font-editorial-mono text-[10px] uppercase tracking-[0.18em] text-ink-60">
          ─── Cadre opérationnel & garanties ───
        </p>
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 border-t border-rule pt-5 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0 sm:first:border-l-0 sm:first:pl-0 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-5"
            >
              <span aria-hidden className="text-ink">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="font-editorial text-[14.5px] font-semibold leading-tight tracking-[-0.005em] text-ink">
                  {item.label}
                </p>
                {item.sub && (
                  <p className="mt-1.5 font-editorial-mono text-[10px] uppercase tracking-[0.12em] text-ink-60">
                    {item.sub}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Avant / Après KOVELA — 2 colonnes avec divider central                ║
// ║                                                                        ║
// ║  Aucun chiffre inventé. Faits opérationnels seulement.                 ║
// ║  Petit pictogramme ✗ / ✓ devant chaque item pour donner la présence    ║
// ║  visuelle d'une comparaison premium.                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

export function EditorialAvantApres({
  avantTitle = "Avant KOVELA",
  apresTitle = "Avec KOVELA",
  avantItems,
  apresItems,
}: {
  avantTitle?: string;
  apresTitle?: string;
  avantItems: string[];
  apresItems: string[];
}) {
  return (
    <div className="relative grid items-stretch gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
      {/* Colonne Avant — neutre, fond paper-shade */}
      <div className="bg-paper-shade p-8 sm:p-10 lg:p-12">
        <p className="font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-60">
          {avantTitle}
        </p>
        <ul className="mt-7 space-y-4 font-editorial text-[15px] leading-[1.55] text-ink-60">
          {avantItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span aria-hidden className="mt-0.5 shrink-0 text-ink-30">{IconCross}</span>
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider central « VS » — uniquement desktop */}
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-4">
        <div className="h-12 w-px bg-rule" />
        <div className="my-3 flex h-10 w-10 items-center justify-center border border-rule bg-paper font-editorial-mono text-[10px] uppercase tracking-[0.16em] text-ink-60">
          VS
        </div>
        <div className="h-12 w-px bg-rule" />
      </div>

      {/* Colonne Avec KOVELA — fond paper, bordure accent gauche */}
      <div className="border-l-2 border-accent bg-paper p-8 sm:p-10 lg:p-12">
        <p className="font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">
          {apresTitle}
        </p>
        <ul className="mt-7 space-y-4 font-editorial text-[15px] leading-[1.55] text-ink">
          {apresItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span aria-hidden className="mt-0.5 shrink-0 text-accent">{IconCheck}</span>
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Grille fonctionnalités — Ce que KOVELA prend en charge                ║
// ║                                                                        ║
// ║  Grid 2 / 3 / 4 cols selon viewport. Chaque item : icône custom 1px    ║
// ║  stroke en haut + label éditorial + description courte.                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

export interface FeatureItem {
  icon: React.ReactNode;
  label: string;
  description: string;
}

export function EditorialFeatureGrid({ items }: { items: FeatureItem[] }) {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <div key={i} className="border-t border-rule pt-6">
          <span aria-hidden className="block text-ink">
            {item.icon}
          </span>
          <p className="mt-5 font-editorial text-[16px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            {item.label}
          </p>
          <p className="mt-2 font-editorial text-[13.5px] leading-[1.55] text-ink-60">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Sécurité & conformité — panel dédié, présence forte                   ║
// ║                                                                        ║
// ║  Section autonome avec en-tête + grille de badges propriétaires KOVELA.║
// ║  PAS de logo institutionnel CNIL ou EU. Formulations safe :            ║
// ║    « Hébergement HDS » (chez hébergeur certifié)                       ║
// ║    « Cadre RGPD » documenté                                            ║
// ║    « Données en Europe »                                               ║
// ║    « Conformité CNIL » aux exigences (pas un faux label officiel)      ║
// ║    « Accès sécurisés » · « Journal d'action »                          ║
// ║    « Supervision humaine » · « Assistance IA interne »                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

export interface SecurityBadge {
  icon: React.ReactNode;
  label: string;
  sub: string;
}

export function EditorialSecurityPanel({
  eyebrow = "SÉCURITÉ & CONFORMITÉ",
  title,
  intro,
  badges,
  footnote,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  badges: SecurityBadge[];
  footnote?: React.ReactNode;
}) {
  return (
    <div className="bg-paper-shade">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-24">
        {/* En-tête */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="font-editorial-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-60">
              {eyebrow}
            </p>
            <h2 className="mt-4 font-editorial text-[1.875rem] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[2.25rem] lg:text-[2.75rem]">
              {title}
            </h2>
          </div>
          {intro && (
            <p className="font-editorial text-[15.5px] leading-[1.6] text-ink-60 lg:pt-2">
              {intro}
            </p>
          )}
        </div>

        {/* Grille de badges propriétaires — 4 cols desktop, 2 mobile */}
        <div className="mt-12 grid gap-px bg-rule sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {badges.map((badge, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 bg-paper p-6 sm:p-7"
            >
              <span aria-hidden className="text-accent">
                {badge.icon}
              </span>
              <div className="min-w-0">
                <p className="font-editorial text-[14.5px] font-semibold leading-tight tracking-[-0.005em] text-ink">
                  {badge.label}
                </p>
                <p className="mt-1.5 font-editorial-mono text-[10px] uppercase tracking-[0.12em] text-ink-60">
                  {badge.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note légale en pied du panel */}
        {footnote && (
          <p className="mt-8 max-w-[760px] font-editorial text-[12px] leading-[1.55] text-ink-30">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  CTA final banner — section dédiée fond ink                            ║
// ║                                                                        ║
// ║  Bandeau CTA fort en fin de page. Fond ink, texte paper, bouton        ║
// ║  primary inversé. Pas de gradient. Pas de glow.                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

export function EditorialCTAFinal({
  eyebrow = "ÉCHANGE OPÉRATIONNEL",
  title,
  lead,
  primaryCta,
  note,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  primaryCta: { label: string; href: string };
  note?: React.ReactNode;
}) {
  return (
    <div className="bg-ink text-paper">
      <div className="mx-auto max-w-[1280px] px-6 py-16 text-center sm:px-10 sm:py-20 lg:px-20 lg:py-24">
        <p className="font-editorial-mono text-[10.5px] uppercase tracking-[0.16em] text-paper/60">
          {eyebrow}
        </p>
        <h2 className="mx-auto mt-5 max-w-[760px] font-editorial text-[2rem] font-extrabold leading-[1.05] tracking-[-0.025em] text-paper sm:text-[2.5rem] lg:text-[3rem]">
          {title}
        </h2>
        {lead && (
          <p className="mx-auto mt-6 max-w-[560px] font-editorial text-[16px] leading-[1.55] text-paper/75">
            {lead}
          </p>
        )}
        <div className="mt-10">
          <a
            href={primaryCta.href}
            className="inline-flex h-12 items-center justify-center rounded-[4px] bg-paper px-7 font-editorial text-[14px] font-medium tracking-[-0.005em] text-ink transition-opacity hover:opacity-85"
          >
            {primaryCta.label}
          </a>
        </div>
        {note && (
          <p className="mx-auto mt-6 max-w-[480px] font-editorial-mono text-[10px] uppercase tracking-[0.12em] text-paper/50">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  Frame mockup — wrapper neutre pour le cockpit typographique           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

/**
 * Wrapper pour intégrer un mockup composé typographiquement dans une
 * section éditoriale. Pas de chrome OS, pas de fausse fenêtre.
 * L'intérieur reste en composition typo + filets.
 */
export function EditorialMockupFrame({
  caption,
  children,
}: {
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure>
      <div className="border border-rule bg-paper p-6 sm:p-8">{children}</div>
      {caption && (
        <figcaption className="mt-3 text-center font-editorial-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-30">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
