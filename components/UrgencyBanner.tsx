export function UrgencyBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-soft ring-1 ring-amber-100">
      <span className="mt-0.5 flex h-6 shrink-0 items-center rounded-full bg-amber-50 px-2 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
        Urgence
      </span>
      <p className="text-[13px] leading-relaxed text-charcoal/80">
        <span className="font-semibold text-navy-900">KOVELA n'est pas un service d'urgence.</span>{" "}
        En cas d'urgence, contactez le{" "}
        <span className="font-semibold text-navy-900">15 / 112</span> ou suivez les consignes de
        votre chirurgien.
      </p>
    </div>
  );
}
