// ─────────────────────────────────────────────────────────────────────────────
// Page de PREVIEW temporaire — comparaison visuelle des 2 options pour la
// card "Avant KOVELA / Avec KOVELA" sur mobile.
// À supprimer après arbitrage utilisateur.
// ─────────────────────────────────────────────────────────────────────────────

const beforeKovela = [
  "Suivi dispersé (téléphone, emails)",
  "Perte d'informations et oublis",
  "Charge admin chronophage",
  "Satisfaction patient variable",
];

const withKovela = [
  "Parcours structuré et centralisé",
  "Traçabilité complète et sécurisée",
  "Temps médical recentré",
  "Expérience patient premium",
];

function IconCircleX({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M7.3 7.3 12.7 12.7 M12.7 7.3 7.3 12.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCircleCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6.5 10.2 9 12.6 13.7 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION A — Cartes contrastées (rouge léger / teal léger)
// ─────────────────────────────────────────────────────────────────────────────
function OptionA() {
  return (
    <div className="space-y-3">
      {/* Avant — bg rouge léger */}
      <div className="rounded-2xl bg-[#FDF4F2] p-5 ring-1 ring-[#D24B3E]/15">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[#D24B3E]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#D24B3E]">
            Avant
          </span>
          <h3 className="font-display text-[16.5px] font-semibold tracking-tight text-navy-900">
            KOVELA
          </h3>
        </div>
        <ul className="mt-4 space-y-2.5">
          {beforeKovela.map((t) => (
            <li
              key={t}
              className="flex items-start gap-2.5 text-[13px] leading-snug text-charcoal/80"
            >
              <IconCircleX className="mt-px h-[16px] w-[16px] shrink-0 text-[#D24B3E]" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 inline-flex rounded-md bg-[#D24B3E]/10 px-2.5 py-1 text-[12px] font-semibold tracking-tight text-[#D24B3E]">
          Coût caché élevé
        </p>
      </div>

      {/* Séparateur VS centré, visible sur mobile */}
      <div className="flex items-center justify-center">
        <span className="-my-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[10px] font-semibold uppercase tracking-wide text-teal-700 ring-4 ring-white shadow-card">
          VS
        </span>
      </div>

      {/* Avec — bg teal léger */}
      <div className="rounded-2xl bg-[#EAF7F4] p-5 ring-1 ring-teal-500/20">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-teal-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
            Avec
          </span>
          <h3 className="font-display text-[16.5px] font-semibold tracking-tight text-navy-900">
            KOVELA
          </h3>
        </div>
        <ul className="mt-4 space-y-2.5">
          {withKovela.map((t) => (
            <li
              key={t}
              className="flex items-start gap-2.5 text-[13px] leading-snug text-navy-900"
            >
              <IconCircleCheck className="mt-px h-[16px] w-[16px] shrink-0 text-teal-600" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 inline-flex rounded-md bg-teal-500/15 px-2.5 py-1 text-[12px] font-semibold tracking-tight text-teal-700">
          ROI rapide et mesurable
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION B — Toggle segmenté (mockup statique, 2 états visibles)
// ─────────────────────────────────────────────────────────────────────────────
function OptionB({ active }: { active: "before" | "after" }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-900/[0.05]">
      {/* Segmented control */}
      <div className="flex rounded-lg bg-ivory p-1 ring-1 ring-navy-900/[0.06]">
        <button
          type="button"
          className={`flex-1 rounded-md py-2 text-[12.5px] font-semibold tracking-tight transition-colors ${
            active === "before"
              ? "bg-white text-navy-900 shadow-soft ring-1 ring-navy-900/[0.06]"
              : "text-charcoal/50"
          }`}
        >
          Avant KOVELA
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md py-2 text-[12.5px] font-semibold tracking-tight transition-colors ${
            active === "after"
              ? "bg-white text-navy-900 shadow-soft ring-1 ring-navy-900/[0.06]"
              : "text-charcoal/50"
          }`}
        >
          Avec KOVELA
        </button>
      </div>

      {active === "before" ? (
        <>
          <ul className="mt-4 space-y-2.5">
            {beforeKovela.map((t) => (
              <li
                key={t}
                className="flex items-start gap-2.5 text-[13px] leading-snug text-charcoal/75"
              >
                <IconCircleX className="mt-px h-[16px] w-[16px] shrink-0 text-[#D24B3E]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] font-semibold tracking-tight text-[#D24B3E]">
            Coût caché élevé
          </p>
        </>
      ) : (
        <>
          <ul className="mt-4 space-y-2.5">
            {withKovela.map((t) => (
              <li
                key={t}
                className="flex items-start gap-2.5 text-[13px] leading-snug text-navy-900"
              >
                <IconCircleCheck className="mt-px h-[16px] w-[16px] shrink-0 text-teal-500" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] font-semibold tracking-tight text-teal-600">
            ROI rapide et mesurable
          </p>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page de preview
// ─────────────────────────────────────────────────────────────────────────────
export default function PreviewCardOptions() {
  return (
    <div className="bg-ivory min-h-screen pb-12">
      <div className="mx-auto max-w-[420px] px-5 py-8">
        <h1 className="font-display text-[22px] font-semibold text-navy-900">
          Preview — card Avant/Avec mobile
        </h1>
        <p className="mt-2 text-[12px] text-charcoal/60">
          Largeur ~ iPhone 14 Pro. Cards rendues comme elles apparaîtraient
          dans le hero.
        </p>

        {/* ====== OPTION A ====== */}
        <div className="mt-8 rounded-md bg-navy-900 px-3 py-1.5 inline-block">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
            Option A — Cartes contrastées
          </p>
        </div>
        <div className="mt-4">
          <OptionA />
        </div>

        <div className="my-10 h-px w-full bg-navy-900/10" />

        {/* ====== OPTION B ====== */}
        <div className="rounded-md bg-navy-900 px-3 py-1.5 inline-block">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
            Option B — Toggle segmenté
          </p>
        </div>
        <p className="mt-2 text-[11px] text-charcoal/55">
          Tap pour basculer entre Avant et Avec. État 1 (tab "Avant" actif) :
        </p>
        <div className="mt-3">
          <OptionB active="before" />
        </div>
        <p className="mt-4 text-[11px] text-charcoal/55">
          État 2 (tab "Avec" actif) :
        </p>
        <div className="mt-3">
          <OptionB active="after" />
        </div>
      </div>
    </div>
  );
}
