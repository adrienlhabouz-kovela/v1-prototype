"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle";

const variants: Record<Variant, string> = {
  // Primary : surgical teal plein
  primary: "bg-teal-500 text-white hover:bg-teal-600 shadow-soft",
  // Secondary : outline navy
  secondary: "bg-transparent text-navy-900 ring-1 ring-navy-200 hover:bg-navy-50 hover:ring-navy-600/40",
  ghost: "bg-transparent text-charcoal hover:bg-navy-50",
  danger: "bg-transparent text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50",
  subtle: "bg-white text-navy-900 ring-1 ring-navy-100 hover:border-teal-200 hover:bg-teal-50/40",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.05] ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-navy-900/[0.06] px-6 py-4">
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-navy-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-charcoal/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-lift">
      <span
        className={`absolute left-0 top-5 h-7 w-[3px] rounded-full transition-colors ${
          accent ? "bg-teal-500" : "bg-navy-100 group-hover:bg-teal-300"
        }`}
      />
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-charcoal/50">{label}</p>
      <p
        className={`mt-2.5 font-display text-[2.25rem] leading-none tracking-tight ${
          accent ? "text-teal-600" : "text-navy-900"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-charcoal/45">{hint}</p>}
    </Card>
  );
}

export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h2 className="font-display text-xl tracking-tight text-navy-900">{children}</h2>
      {hint && <span className="text-xs text-charcoal/45">{hint}</span>}
    </div>
  );
}

// Bandeau doctrine — rappel du périmètre non médical (variante claire, premium).
export function DoctrineNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl bg-white px-5 py-3.5 text-xs leading-relaxed text-charcoal/75 shadow-soft ring-1 ring-navy-900/[0.05] ${className}`}
    >
      <span className="mt-0.5 flex h-5 shrink-0 items-center rounded-full bg-teal-50 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-teal-700 ring-1 ring-teal-100">
        Doctrine
      </span>
      <p>
        <span className="font-semibold text-navy-900">KOVELA ne décide pas médicalement.</span>{" "}
        KOVELA structure, trace, priorise opérationnellement et escalade. L'IA est assistive,
        interne, loggée et human-in-the-loop.
      </p>
    </div>
  );
}

// Header de page « ambiance KOVELA » — bandeau navy, titre éditorial, motif wave.
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-navy-depth wave-motif shadow-lift">
      <div className="absolute left-0 top-0 h-full w-1 bg-teal-500/80" />
      <div className="relative flex flex-col gap-4 px-7 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          {eyebrow && (
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-[1.85rem] leading-tight tracking-tight text-white md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-100/70">{subtitle}</p>
          )}
        </div>
        {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative z-10 w-full ${wide ? "max-w-2xl" : "max-w-lg"} rounded-3xl bg-white shadow-lift`}
      >
        <div className="flex items-center justify-between border-b border-navy-900/[0.06] px-6 py-4">
          <h3 className="text-sm font-semibold tracking-tight text-navy-900">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-charcoal/50 transition-colors hover:bg-navy-50 hover:text-navy-900"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// Encadré de sortie IA — disclaimer obligatoire + actions humaines.
export function AiSuggestion({
  output,
  onAccept,
  onModify,
  onRefuse,
}: {
  output: string;
  onAccept?: () => void;
  onModify?: () => void;
  onRefuse?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-teal-500 text-[10px] font-bold text-white">
          IA
        </span>
        <span className="text-xs font-semibold text-teal-700">
          Suggestion IA — à valider par un humain
        </span>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-navy-900">{output}</pre>
      {(onAccept || onModify || onRefuse) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {onAccept && (
            <Button variant="primary" onClick={onAccept}>
              Accepter
            </Button>
          )}
          {onModify && (
            <Button variant="secondary" onClick={onModify}>
              Modifier
            </Button>
          )}
          {onRefuse && (
            <Button variant="ghost" onClick={onRefuse}>
              Refuser
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
