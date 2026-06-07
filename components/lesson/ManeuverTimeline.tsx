"use client";

import { motion } from "framer-motion";

/** Timeline verticale d'une manœuvre, étape par étape. */
export function ManeuverTimeline({ steps }: { steps: string[] }) {
  return (
    <ol className="relative ml-2 space-y-4 border-l border-white/15 pl-5">
      {steps.map((step, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="relative"
        >
          <span className="absolute -left-[27px] flex h-6 w-6 items-center justify-center rounded-full bg-spray-500 text-xs font-bold text-abyss-950">
            {i + 1}
          </span>
          <p className="text-sm text-abyss-100">{step}</p>
        </motion.li>
      ))}
    </ol>
  );
}
