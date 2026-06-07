"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BOAT_ZONES } from "@/lib/content/modules";

interface Zone {
  id: string;
  // Position de la cible cliquable et du repère.
  cx: number;
  cy: number;
  r: number;
  labelSide: "left" | "right" | "top" | "bottom";
}

// Coordonnées sur un viewBox 0 0 220 420 (proue en haut, poupe en bas).
const ZONES: Zone[] = [
  { id: "proue", cx: 110, cy: 34, r: 17, labelSide: "top" },
  { id: "poupe", cx: 110, cy: 388, r: 17, labelSide: "bottom" },
  { id: "babord", cx: 58, cy: 210, r: 17, labelSide: "left" },
  { id: "tribord", cx: 162, cy: 210, r: 17, labelSide: "right" },
  { id: "mat", cx: 110, cy: 150, r: 15, labelSide: "left" },
  { id: "bome", cx: 110, cy: 232, r: 14, labelSide: "right" },
  { id: "cockpit", cx: 110, cy: 300, r: 18, labelSide: "left" },
  { id: "quille", cx: 110, cy: 196, r: 13, labelSide: "right" },
  { id: "safran", cx: 110, cy: 366, r: 12, labelSide: "left" },
  { id: "winch", cx: 142, cy: 296, r: 11, labelSide: "right" },
  { id: "taquet", cx: 80, cy: 110, r: 11, labelSide: "left" },
];

const LABEL: Record<string, string> = Object.fromEntries(
  BOAT_ZONES.map((z) => [z.id, z.label]),
);
const DESC: Record<string, string> = Object.fromEntries(
  BOAT_ZONES.map((z) => [z.id, z.desc]),
);

export function BoatTopView({
  mode = "explore",
  onPick,
  highlightId,
  feedback,
}: {
  mode?: "explore" | "quiz";
  /** En mode quiz : appelé avec l'id de la zone touchée. */
  onPick?: (id: string) => void;
  /** Zone à mettre en évidence (ex. bonne réponse). */
  highlightId?: string | null;
  /** "correct" | "wrong" pour colorer la zone choisie. */
  feedback?: { id: string; status: "correct" | "wrong" } | null;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handle = (id: string) => {
    if (mode === "quiz") {
      onPick?.(id);
    } else {
      setSelected((s) => (s === id ? null : id));
    }
  };

  const active = mode === "explore" ? selected : highlightId ?? null;

  return (
    <div className="select-none">
      <svg viewBox="0 0 220 420" className="mx-auto w-full max-w-[280px]" role="img" aria-label="Schéma du voilier vu de dessus">
        {/* eau */}
        <defs>
          <radialGradient id="hull" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#13405b" />
            <stop offset="100%" stopColor="#0a2434" />
          </radialGradient>
        </defs>

        {/* coque vue de dessus */}
        <path
          d="M110 14 C150 60 168 120 168 210 C168 300 156 360 130 398 L90 398 C64 360 52 300 52 210 C52 120 70 60 110 14 Z"
          fill="url(#hull)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={2}
        />
        {/* pont intérieur */}
        <path
          d="M110 40 C142 78 156 130 156 210 C156 290 146 344 124 380 L96 380 C74 344 64 290 64 210 C64 130 78 78 110 40 Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1.5}
        />

        {/* quille (sous la coque, en pointillés) */}
        <line x1="110" y1="150" x2="110" y2="250" stroke="rgba(47,226,197,0.35)" strokeWidth={6} strokeDasharray="3 5" strokeLinecap="round" />

        {/* mât */}
        <circle cx="110" cy="150" r="6" fill="#2FE2C5" />
        {/* bôme */}
        <line x1="110" y1="150" x2="110" y2="250" stroke="rgba(255,255,255,0.5)" strokeWidth={3} strokeLinecap="round" />

        {/* cockpit */}
        <rect x="92" y="284" width="36" height="44" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" />

        {/* safran / barre */}
        <line x1="110" y1="384" x2="110" y2="400" stroke="rgba(255,255,255,0.5)" strokeWidth={3} strokeLinecap="round" />

        {/* repères proue/poupe */}
        <text x="110" y="9" textAnchor="middle" className="fill-spray-400" fontSize="9" fontWeight="700">▲ AVANT</text>

        {/* zones interactives */}
        {ZONES.map((z) => {
          const isActive = active === z.id;
          const fb = feedback && feedback.id === z.id ? feedback.status : null;
          const ring =
            fb === "correct"
              ? "#2FE2C5"
              : fb === "wrong"
                ? "#FF6B5E"
                : isActive
                  ? "#FFB23E"
                  : "rgba(255,255,255,0.35)";
          const fill =
            fb === "correct"
              ? "rgba(47,226,197,0.30)"
              : fb === "wrong"
                ? "rgba(255,107,94,0.30)"
                : isActive
                  ? "rgba(255,178,62,0.25)"
                  : "rgba(255,255,255,0.06)";
          return (
            <g key={z.id} onClick={() => handle(z.id)} className="cursor-pointer">
              <circle cx={z.cx} cy={z.cy} r={z.r} fill={fill} stroke={ring} strokeWidth={2} />
              <circle cx={z.cx} cy={z.cy} r={2.5} fill={ring} />
            </g>
          );
        })}
      </svg>

      {/* panneau d'info en mode exploration */}
      {mode === "explore" && (
        <motion.div
          key={selected ?? "none"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl bg-white/5 p-3 text-center ring-1 ring-white/10"
        >
          {selected ? (
            <>
              <div className="font-display text-lg text-spray-400">{LABEL[selected]}</div>
              <div className="mt-0.5 text-sm text-abyss-100">{DESC[selected]}</div>
            </>
          ) : (
            <div className="text-sm text-abyss-100/80">
              Touche une zone du bateau pour la découvrir.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
