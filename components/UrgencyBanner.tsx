export function UrgencyBanner() {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-800">
      <span className="font-semibold">KOVELA n'est pas un service d'urgence.</span> En cas
      d'urgence, contactez le <span className="font-semibold">15 / 112</span> ou suivez les
      consignes de votre chirurgien.
    </div>
  );
}
