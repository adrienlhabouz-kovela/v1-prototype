"use client";

import { useEffect, useState } from "react";

/**
 * ScrollProgress — fine barre teal fixe en haut de page qui se remplit
 * proportionnellement à la position du scroll vertical.
 *
 * Pattern Linear / GitHub docs. Visible uniquement sur les pages longues.
 * z-50 → au-dessus du header sticky (z-30).
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setProgress(max > 0 ? Math.min(100, (current / max) * 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-teal-500 transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
