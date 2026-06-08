"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

export function Pill({
  children,
  tone = "spray",
  className = "",
}: {
  children: ReactNode;
  tone?: "spray" | "sun" | "coral" | "lagoon" | "muted";
  className?: string;
}) {
  const tones: Record<string, string> = {
    spray: "bg-spray-500/15 text-spray-400 ring-1 ring-spray-500/30",
    sun: "bg-sun-500/15 text-sun-400 ring-1 ring-sun-500/30",
    coral: "bg-coral-500/15 text-coral-400 ring-1 ring-coral-500/30",
    lagoon: "bg-lagoon-400/15 text-lagoon-300 ring-1 ring-lagoon-400/30",
    muted: "bg-white/5 text-abyss-100 ring-1 ring-white/10",
  };
  return <span className={`pill ${tones[tone]} ${className}`}>{children}</span>;
}

export function ProgressBar({
  value,
  className = "",
  tone = "spray",
}: {
  value: number; // 0..1
  className?: string;
  tone?: "spray" | "sun";
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const grad =
    tone === "sun"
      ? "from-sun-500 to-sun-400"
      : "from-spray-600 to-spray-400";
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${grad}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
      />
    </div>
  );
}

/** Anneau de score circulaire (SVG). value 0..1. */
export function ScoreRing({
  value,
  size = 64,
  stroke = 7,
  tone = "spray",
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: "spray" | "sun" | "coral" | "lagoon";
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  const colors: Record<string, string> = {
    spray: "#2FE2C5",
    sun: "#FFB23E",
    coral: "#FF6B5E",
    lagoon: "#36AECB",
  };
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colors[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v) }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-sail">
        {label ?? `${Math.round(v * 100)}`}
      </span>
    </div>
  );
}

export function Card({
  children,
  className = "",
  as = "div",
  href,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "button";
  href?: string;
  onClick?: () => void;
}) {
  const base = `card p-4 ${className}`;
  if (href) {
    return (
      <Link href={href} className={`${base} block focus-ring transition-transform active:scale-[0.99]`}>
        {children}
      </Link>
    );
  }
  if (as === "button") {
    return (
      <button onClick={onClick} className={`${base} text-left focus-ring transition-transform active:scale-[0.99]`}>
        {children}
      </button>
    );
  }
  return <div className={base}>{children}</div>;
}

/** Jauge horizontale (vitesse, stabilité…). value 0..1. */
export function Gauge({
  value,
  label,
  tone = "spray",
}: {
  value: number;
  label: string;
  tone?: "spray" | "sun" | "coral";
}) {
  const tones: Record<string, string> = {
    spray: "from-spray-600 to-spray-400",
    sun: "from-sun-600 to-sun-400",
    coral: "from-coral-600 to-coral-400",
  };
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-abyss-100">{label}</span>
        <span className="font-bold tabular-nums">{pct}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${tones[tone]}`}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

export function SectionTitle({
  kicker,
  title,
  action,
}: {
  kicker?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        {kicker && <div className="label-caps mb-1">{kicker}</div>}
        <h2 className="font-display text-xl text-sail">{title}</h2>
      </div>
      {action}
    </div>
  );
}
