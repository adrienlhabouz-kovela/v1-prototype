import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="text-6xl">🧭</div>
      <h1 className="mt-4 font-display text-2xl text-sail">Hors de la carte</h1>
      <p className="mt-2 max-w-xs text-sm text-abyss-100/70">
        Cette page n'existe pas — ou tu as dérivé hors de ta route. Reprends ton cap.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Retour au port
      </Link>
    </div>
  );
}
