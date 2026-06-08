"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WindCircle } from "@/components/svg/WindCircle";

/** Bloc rose des vents : visualise la zone interdite et le côté amures. */
export function WindRoseExplorer() {
  const [angle, setAngle] = useState(50);
  const abs = Math.abs(angle);
  const inNoGo = abs < 35;
  const tack = angle === 0 ? "—" : angle > 0 ? "Tribord amures" : "Bâbord amures";

  return (
    <div>
      <WindCircle angle={angle} onChange={setAngle} accentColor="#2FE2C5" />
      <div className="-mt-2 text-center text-xs text-abyss-100/70">
        Déplace le bateau et observe la zone interdite (rouge)
      </div>

      <motion.div
        key={inNoGo ? "no" : "ok"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`mt-3 rounded-xl p-3 text-sm ring-1 ${
          inNoGo
            ? "bg-coral-500/10 text-coral-400 ring-coral-500/25"
            : "bg-spray-500/10 text-spray-400 ring-spray-500/25"
        }`}
      >
        {inNoGo ? (
          <>
            <strong>Zone interdite.</strong> À {abs}° du vent, les voiles faseyent et le bateau cale. Abats pour reprendre de la vitesse.
          </>
        ) : (
          <>
            <strong>Ça avance.</strong> À {abs}° du vent ({tack}), les voiles portent. Le bateau navigue.
          </>
        )}
      </motion.div>
    </div>
  );
}
