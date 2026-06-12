// ─────────────────────────────────────────────────────────────────────────────
// Page de PREVIEW temporaire — 3 propositions pour le bloc "Founder" sur
// la home /. À supprimer après arbitrage utilisateur.
//
// Photo : placeholder circulaire teal/navy (à remplacer par une vraie
// photo une fois l'option choisie + le fichier déposé).
// ─────────────────────────────────────────────────────────────────────────────

function IconLinkedIn({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function IconArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Avatar placeholder — dégradé radial sobre, pour visualiser la zone
 * photo dans chaque option. Remplacer par <img src="/founder.jpg"/>. */
function AvatarPlaceholder({ size }: { size: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 overflow-hidden rounded-full"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 30% 25%, #BFE3DE 0%, #1FA7A0 45%, #0A1F2D 100%)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-[42px] font-medium text-white/85" style={{ fontSize: size * 0.35 }}>
          AL
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION F1 — Card étoffée dans §11 (col-span-2)
// La card "Fondateur" prend 2 colonnes sur 3, photo carrée à gauche, bio à
// droite. Les 2 autres cards (Chirurgiens, Produit) descendent en dessous.
// ─────────────────────────────────────────────────────────────────────────────
function OptionF1() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-900/[0.045]">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
        Fondateur
      </p>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <AvatarPlaceholder size={96} />
        <div>
          <h3 className="font-display text-[18px] font-semibold tracking-tight text-navy-900">
            Adrien Lhabouz
          </h3>
          <p className="mt-1 text-[12.5px] font-medium text-teal-700">
            Fondateur · Entrepreneur santé & finance
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">
            KOVELA est ma 2<sup>e</sup> société, après{" "}
            <span className="font-medium text-navy-900">Trecento Asset Management</span>{" "}
            (cofondateur), 10 ans dans la structuration et l&apos;analyse du risque.
            J&apos;ai construit KOVELA après 17 entretiens terrain avec des chirurgiens
            esthétiques privés.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="https://www.linkedin.com/"
              className="inline-flex items-center gap-1.5 rounded-md bg-navy-900/[0.05] px-2.5 py-1 text-[12px] font-semibold tracking-tight text-navy-900 ring-1 ring-navy-900/[0.06] transition-colors hover:bg-navy-900/[0.1]"
            >
              <IconLinkedIn className="h-3.5 w-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-[12px] font-medium tracking-tight text-teal-700 hover:text-teal-800"
            >
              Pourquoi KOVELA
              <IconArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION F2 — Section éditoriale pleine largeur, sobre, layout 2 cols
// (photo carrée + texte). Remplace ou s'ajoute à §11 cards.
// ─────────────────────────────────────────────────────────────────────────────
function OptionF2() {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-900/[0.06] bg-ivory">
      <div className="grid gap-6 p-6 sm:grid-cols-[180px_1fr] sm:gap-8 sm:p-8">
        <AvatarPlaceholder size={160} />
        <div className="self-center">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-teal-700">
            Qui porte KOVELA
          </p>
          <h2 className="mt-2 font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.025em] text-navy-900 sm:text-[1.9rem]">
            Adrien Lhabouz
          </h2>
          <p className="mt-2 text-[13.5px] font-medium text-charcoal/65">
            Fondateur · Cofondateur de Trecento Asset Management
          </p>
          <p className="mt-4 max-w-[44ch] text-[13.5px] leading-relaxed text-charcoal/75">
            10 ans dans la structuration et l&apos;analyse du risque côté finance.
            KOVELA est ma 2<sup>e</sup> société, construite après 17 entretiens
            terrain avec des chirurgiens esthétiques privés.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="https://www.linkedin.com/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3.5 py-2 text-[12.5px] font-semibold tracking-tight text-white shadow-soft transition-colors hover:bg-navy-800"
            >
              <IconLinkedIn className="h-3.5 w-3.5" />
              <span>Voir LinkedIn</span>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-[12.5px] font-medium tracking-tight text-teal-700 hover:text-teal-800"
            >
              Lire « Pourquoi KOVELA »
              <IconArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION F3 — Quote / manifesto style. Pattern Stripe / Linear founder
// pages : photo ronde grande + citation typographique + signature.
// ─────────────────────────────────────────────────────────────────────────────
function OptionF3() {
  return (
    <div className="overflow-hidden rounded-2xl bg-navy-depth p-8 text-white shadow-lift sm:p-12">
      <div className="mx-auto max-w-3xl text-center">
        <AvatarPlaceholder size={88} />
        <blockquote className="mt-7 font-display text-[1.4rem] italic leading-snug tracking-[-0.02em] text-white/90 sm:text-[1.7rem]">
          « J&apos;ai construit KOVELA après avoir vu, terrain par terrain, ce que
          le post-op coûte vraiment au cabinet. Pas en chiffres : en énergie,
          en temps médical, en attention détournée. »
        </blockquote>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300/80">
          Adrien Lhabouz · Fondateur
        </p>
        <p className="mt-2 text-[13px] text-navy-100/65">
          Cofondateur de Trecento Asset Management · 17 entretiens terrain avec
          chirurgiens esthétiques privés.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.linkedin.com/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.08] px-3.5 py-2 text-[12.5px] font-semibold tracking-tight text-white ring-1 ring-white/15 transition-colors hover:bg-white/[0.12]"
          >
            <IconLinkedIn className="h-3.5 w-3.5" />
            <span>Voir LinkedIn</span>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-[12.5px] font-medium tracking-tight text-teal-300 hover:text-teal-200"
          >
            Lire « Pourquoi KOVELA »
            <IconArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page de preview — empile les 3 options pour comparaison directe
// ─────────────────────────────────────────────────────────────────────────────
export default function PreviewFounder() {
  return (
    <div className="min-h-screen bg-ivory pb-16">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <h1 className="font-display text-[24px] font-semibold tracking-tight text-navy-900">
          Preview — bloc fondateur
        </h1>
        <p className="mt-2 text-[12.5px] text-charcoal/60">
          3 propositions pour mettre Adrien Lhabouz en évidence sur la home.
          Photo = placeholder dégradé teal/navy avec initiales AL (à remplacer
          par une vraie photo).
        </p>

        {/* ===== OPTION F1 ===== */}
        <div className="mt-10 inline-block rounded-md bg-navy-900 px-3 py-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
            Option F1 — Card étoffée dans §11
          </p>
        </div>
        <p className="mt-2 text-[11.5px] text-charcoal/55">
          La card Fondateur garde sa place dans §11 mais devient large (2 cols).
          Photo carrée + bio enrichie + LinkedIn + lien manifesto.
        </p>
        <div className="mt-4">
          <OptionF1 />
        </div>

        <div className="my-10 h-px w-full bg-navy-900/10" />

        {/* ===== OPTION F2 ===== */}
        <div className="inline-block rounded-md bg-navy-900 px-3 py-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
            Option F2 — Section éditoriale pleine largeur
          </p>
        </div>
        <p className="mt-2 text-[11.5px] text-charcoal/55">
          Section dédiée, photo carrée 160 px, layout 2 colonnes. Remplace
          ou s&apos;ajoute à §11. Registre éditorial sobre.
        </p>
        <div className="mt-4">
          <OptionF2 />
        </div>

        <div className="my-10 h-px w-full bg-navy-900/10" />

        {/* ===== OPTION F3 ===== */}
        <div className="inline-block rounded-md bg-navy-900 px-3 py-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
            Option F3 — Quote / manifesto navy
          </p>
        </div>
        <p className="mt-2 text-[11.5px] text-charcoal/55">
          Section navy, citation typographique centrée + signature.
          Pattern Stripe / Linear founder pages. Plus narratif.
        </p>
        <div className="mt-4">
          <OptionF3 />
        </div>
      </div>
    </div>
  );
}
