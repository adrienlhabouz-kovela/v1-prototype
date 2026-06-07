"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

/**
 * Cercle vent/allures interactif.
 * Convention : le vent vient toujours du HAUT (souffle vers le bas).
 * `angle` = angle au vent signé (-180..180). 0 = nez au vent (zone interdite),
 * positif = tribord amures, négatif = bâbord amures. |angle| = allure.
 */
export function WindCircle({
  angle,
  onChange,
  size = 300,
  accentColor = "#2FE2C5",
  showNoGo = true,
  children,
}: {
  angle: number;
  onChange?: (angle: number) => void;
  size?: number;
  accentColor?: string;
  showNoGo?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 18;

  const interactive = !!onChange;

  const updateFromPointer = (clientX: number, clientY: number) => {
    const svg = ref.current;
    if (!svg || !onChange) return;
    const rect = svg.getBoundingClientRect();
    // Coordonnées dans le repère viewBox.
    const px = ((clientX - rect.left) / rect.width) * size;
    const py = ((clientY - rect.top) / rect.height) * size;
    const dx = px - cx;
    const dy = py - cy;
    // 0 = vers le haut, sens horaire positif.
    let a = (Math.atan2(dx, -dy) * 180) / Math.PI;
    a = Math.max(-180, Math.min(180, a));
    onChange(Math.round(a));
  };

  // Position du bateau / poignée sur le bord.
  const rad = (angle * Math.PI) / 180;
  const bx = cx + R * Math.sin(rad);
  const by = cy - R * Math.cos(rad);

  // Wedge zone interdite (±35° en haut).
  const noGo = 35;
  const wedge = (deg: number) => {
    const r = (deg * Math.PI) / 180;
    return { x: cx + (R + 6) * Math.sin(r), y: cy - (R + 6) * Math.cos(r) };
  };
  const w1 = wedge(-noGo);
  const w2 = wedge(noGo);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto w-full max-w-[340px] touch-none"
      onPointerDown={(e) => {
        if (!interactive) return;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        updateFromPointer(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (!interactive || e.buttons === 0) return;
        updateFromPointer(e.clientX, e.clientY);
      }}
      role="img"
      aria-label="Cercle des allures"
    >
      {/* cercle de fond */}
      <circle cx={cx} cy={cy} r={R} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={R * 0.62} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

      {/* zone interdite */}
      {showNoGo && (
        <path
          d={`M ${cx} ${cy} L ${w1.x} ${w1.y} A ${R + 6} ${R + 6} 0 0 1 ${w2.x} ${w2.y} Z`}
          fill="rgba(255,107,94,0.16)"
          stroke="rgba(255,107,94,0.35)"
          strokeWidth={1}
        />
      )}

      {/* repères d'allure (graduations) */}
      {[45, 90, 135].map((g) => {
        const draw = (sign: number) => {
          const r = ((g * sign) * Math.PI) / 180;
          const x1 = cx + (R - 10) * Math.sin(r);
          const y1 = cy - (R - 10) * Math.cos(r);
          const x2 = cx + R * Math.sin(r);
          const y2 = cy - R * Math.cos(r);
          return <line key={`${g}-${sign}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />;
        };
        return (
          <g key={g}>
            {draw(1)}
            {draw(-1)}
          </g>
        );
      })}

      {/* flèches de vent venant du haut */}
      {[-26, 0, 26].map((off) => (
        <g key={off} opacity={0.7}>
          <line x1={cx + off} y1={8} x2={cx + off} y2={34} stroke={accentColor} strokeWidth={2} strokeLinecap="round" />
          <path d={`M ${cx + off - 4} 28 L ${cx + off} 34 L ${cx + off + 4} 28`} fill="none" stroke={accentColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <text x={cx} y={size - 6} textAnchor="middle" fontSize="10" fontWeight="700" className="fill-white/40">
        VENT ↓
      </text>

      {/* bateau pivotant, posé sur le bord, proue vers l'extérieur */}
      <g transform={`translate(${cx} ${cy})`}>
        <motion.g
          animate={{ x: bx - cx, y: by - cy, rotate: angle }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className={interactive ? "cursor-grab active:cursor-grabbing" : ""}
        >
          {/* coque vue de dessus, proue vers le haut */}
          <path
            d="M0 -22 C9 -10 11 6 9 20 L-9 20 C-11 6 -9 -10 0 -22 Z"
            fill="#0E7C9B"
            stroke={accentColor}
            strokeWidth={2}
          />
          <line x1="0" y1="-8" x2="0" y2="16" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round" />
          <circle cx="0" cy="-8" r="2.5" fill={accentColor} />
        </motion.g>
      </g>

      {children}
    </svg>
  );
}
