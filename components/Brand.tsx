import React from "react";

// Monogramme KOVELA : arc « surgical teal » + lettre K.
// La lettre utilise currentColor (s'adapte au fond clair/sombre).
export function BrandMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M21 4 C 10 6.5, 4.5 15.5, 6.5 25 C 8 32, 14 36.5, 21.5 36.5"
        stroke="#1FA7A0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M15.5 9 V 31" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M27.5 9 L 16.5 20 L 28.5 31"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark({
  light,
  tagline,
  compact,
  className = "",
}: {
  light?: boolean;
  tagline?: boolean;
  /** Version plus fine pour headers serrés. */
  compact?: boolean;
  className?: string;
}) {
  const markSize = compact ? 28 : 32;
  const labelClass = compact ? "text-base" : "text-lg";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BrandMark size={markSize} className={light ? "text-white" : "text-navy-900"} />
      <div className="leading-none">
        <span
          className={`font-display ${labelClass} tracking-brand ${light ? "text-white" : "text-navy-900"}`}
        >
          KOVELA
        </span>
        {tagline && (
          <div
            className={`mt-1 text-[9px] uppercase tracking-[0.2em] ${
              light ? "text-navy-100/60" : "text-charcoal/50"
            }`}
          >
            Suivi post-opératoire
          </div>
        )}
      </div>
    </div>
  );
}
