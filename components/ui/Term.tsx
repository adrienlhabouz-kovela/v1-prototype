import { glossFor } from "@/lib/content/glossary";

/**
 * Affiche un terme anglais/technique suivi d'une glose courte entre parenthèses.
 * Ex. <Term term="Streak" /> → « Streak (série de jours) ».
 * La glose vient du glossaire, ou peut être fournie via `gloss`.
 */
export function Term({
  term,
  gloss,
  className = "",
}: {
  term: string;
  gloss?: string;
  className?: string;
}) {
  const g = gloss ?? glossFor(term);
  return (
    <span className={className}>
      {term}
      {g ? <span className="font-normal text-abyss-100/50"> ({g})</span> : null}
    </span>
  );
}
