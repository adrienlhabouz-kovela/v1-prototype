import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Composants partagés entre les landings KOVELA :
//   - /                            (landing institutionnelle)
//   - /chirurgiens-esthetiques     (landing acquisition esthétique)
//
// Garder ici uniquement ce qui doit rester rigoureusement identique sur
// les deux pages : iconographie hero, compliance pills, et SVG des logos
// de réassurance (HDS / RGPD / eIDAS / CNIL).
// ─────────────────────────────────────────────────────────────────────────────

export function IconCircleX({ className = "" }: { className?: string }) {
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

export function IconCircleCheck({ className = "" }: { className?: string }) {
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

export function IconTarget({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function IconSilence({ className = "" }: { className?: string }) {
  // Bulle de conversation barrée — promesse « plus de bruit côté patient ».
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5.2L8 18.5V15H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M4 20 20 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconTrend({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 15.5 9.5 10l3.2 3.2L20 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconShield({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5 5.5 6v5c0 4.2 2.8 7.2 6.5 8.5 3.7-1.3 6.5-4.3 6.5-8.5V6L12 3.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9.2 12.1 11 14l4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Compliance row — pills typographiques (hero) ─────────────────────────
// Conformité affirmée dès le 1er écran, registre Stripe/Linear.
// Ligne 1 : conformité réglementaire stricte (HDS + RGPD/CNIL).
// Ligne 2 : marqueurs souveraineté & opération (FR, EU, supervision,
// IA interne, journal d'action) en texte fin séparé de bullets.

const complianceCore = ["HDS certifié", "RGPD + CNIL conforme"];

const complianceSupport: { icon: string; label: string }[] = [
  { icon: "🇫🇷", label: "Société française" },
  { icon: "🇪🇺", label: "Données hébergées en Europe" },
  { icon: "👥", label: "Supervision humaine" },
  { icon: "🤖", label: "IA interne" },
  { icon: "📋", label: "Journal d'action" },
];

export function CompliancePills() {
  return (
    <div className="space-y-2">
      {/* Ligne 1 — pills lourdes, marqueur réglementaire */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] tracking-tight text-charcoal/65">
        <span className="flex items-center gap-1.5">
          <IconShield className="h-3.5 w-3.5 text-teal-600/85" />
          <span className="font-medium">Conformité réglementaire</span>
        </span>
        <span className="flex flex-wrap items-center gap-1.5">
          {complianceCore.map((label) => (
            <span
              key={label}
              className="rounded-md bg-navy-900/[0.05] px-2 py-0.5 text-[10.5px] font-semibold tracking-[0.02em] text-navy-900/90 ring-1 ring-navy-900/[0.07]"
            >
              {label}
            </span>
          ))}
        </span>
      </div>

      {/* Ligne 2 — marqueurs souveraineté & opération, texte fin */}
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] tracking-tight text-charcoal/55">
        {complianceSupport.map((c, i) => (
          <span key={c.label} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-charcoal/25">·</span>}
            <span aria-hidden="true">{c.icon}</span>
            <span>{c.label}</span>
          </span>
        ))}
      </p>
    </div>
  );
}

// ─── Trust logos — section Cadre KOVELA ───────────────────────────────────
// Visuels SVG inline 80×80 px. Quand les vrais logos officiels seront
// déposés dans public/trust/ (eidas.svg, hds.svg, rgpd.svg, cnil.svg),
// remplacer chaque <Logo*/> par <Image src="/trust/X.svg" ... />.

export function LogoHds() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" aria-label="HDS — Hébergeur de Données de Santé" role="img">
      <defs>
        <path id="hdsl-top" d="M 10 40 A 30 30 0 0 1 70 40" fill="none" />
        <path id="hdsl-bot" d="M 70 40 A 30 30 0 0 1 10 40" fill="none" />
      </defs>
      <circle cx="40" cy="40" r="38" fill="#ffffff" stroke="#3b6fb5" strokeWidth="1.6" />
      <text fontSize="6" fontWeight="700" fill="#1e40af" letterSpacing="1">
        <textPath href="#hdsl-top" startOffset="50%" textAnchor="middle">
          CERTIFIED
        </textPath>
      </text>
      <text fontSize="6" fontWeight="700" fill="#1e40af" letterSpacing="1">
        <textPath href="#hdsl-bot" startOffset="50%" textAnchor="middle">
          COMPANY
        </textPath>
      </text>
      <circle cx="40" cy="40" r="24" fill="#3b6fb5" />
      <text x="40" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" letterSpacing="0.5">
        HDS
      </text>
      <text x="40" y="48" textAnchor="middle" fontSize="3.7" fill="white" opacity="0.95">
        Hébergeur de données
      </text>
      <text x="40" y="53" textAnchor="middle" fontSize="3.7" fill="white" opacity="0.95">
        de santé
      </text>
    </svg>
  );
}

export function LogoRgpd() {
  const stars = Array.from({ length: 12 }).map((_, i) => {
    const angle = ((i * 30 - 90) * Math.PI) / 180;
    const r = 28;
    return { x: 40 + r * Math.cos(angle), y: 40 + r * Math.sin(angle) };
  });
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" aria-label="RGPD — Règlement Général sur la Protection des Données" role="img">
      <circle cx="40" cy="40" r="38" fill="#003399" />
      {stars.map((s, i) => (
        <text key={i} x={s.x} y={s.y + 2.5} textAnchor="middle" fontSize="6" fill="#FFCC00">
          ★
        </text>
      ))}
      {/* petit cadenas */}
      <rect x="33" y="29" width="14" height="11" rx="1.5" fill="none" stroke="white" strokeWidth="1.5" />
      <path d="M35 29 v-3.5 a5 5 0 0 1 10 0 v3.5" fill="none" stroke="white" strokeWidth="1.5" />
      <text x="40" y="50" textAnchor="middle" fontSize="11" fontWeight="700" fill="white" letterSpacing="0.5">
        RGPD
      </text>
    </svg>
  );
}

export function LogoEidas() {
  // Reproduction fidèle au visuel utilisateur :
  // anneau gris fin, cadenas bleu central, 8 étoiles UE jaunes sur le
  // corps du cadenas, coche jaune au milieu du cadenas, eIDAS en bleu
  // dans la zone basse du cercle (sous le cadenas).
  const lockStars = [
    { x: 31, y: 38 }, { x: 38, y: 36 }, { x: 45, y: 36 }, { x: 52, y: 38 },
    { x: 31, y: 55 }, { x: 38, y: 56 }, { x: 45, y: 56 }, { x: 52, y: 55 },
  ];
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" aria-label="eIDAS — Identification électronique européenne" role="img">
      {/* anneau gris */}
      <circle cx="40" cy="40" r="38" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.2" />
      {/* arceau du cadenas */}
      <path d="M30 32 v-7 a10 10 0 0 1 20 0 v7" fill="none" stroke="#1e3a8a" strokeWidth="3.2" strokeLinecap="round" />
      {/* corps du cadenas */}
      <rect x="24" y="32" width="32" height="28" rx="3" fill="#1e3a8a" />
      {/* étoiles UE jaunes sur le corps */}
      {lockStars.map((s, i) => (
        <text key={i} x={s.x} y={s.y} textAnchor="middle" fontSize="4.5" fill="#FFCC00">
          ★
        </text>
      ))}
      {/* coche jaune au centre du cadenas */}
      <path
        d="M30 46 l5 5 l11 -11"
        stroke="#FFCC00"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* eIDAS */}
      <text x="40" y="73" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#1e3a8a" letterSpacing="0.4">
        eIDAS
      </text>
    </svg>
  );
}

export function LogoCnil() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" aria-label="CNIL — Commission Nationale de l'Informatique et des Libertés" role="img">
      <circle cx="40" cy="40" r="38" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.6" />
      <text x="40" y="46" textAnchor="middle" fontSize="17" fontWeight="700" fill="#1e40af" letterSpacing="0.4">
        CNIL.
      </text>
    </svg>
  );
}

export const trustLogos: { Logo: () => React.ReactElement; label: string }[] = [
  { Logo: LogoHds, label: "Hébergement santé" },
  { Logo: LogoRgpd, label: "Conformité européenne" },
  { Logo: LogoEidas, label: "Identité électronique" },
  { Logo: LogoCnil, label: "Autorité française" },
];
