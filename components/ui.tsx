"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle";

const variants: Record<Variant, string> = {
  // Primary — navy plein avec accent teal subtil au focus
  primary:
    "bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 shadow-soft ring-1 ring-inset ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60",
  // Secondary — outline neutre posé
  secondary:
    "bg-white/70 text-navy-900 ring-1 ring-navy-900/10 hover:bg-white hover:ring-navy-900/20",
  ghost: "bg-transparent text-charcoal/80 hover:bg-navy-900/[0.04] hover:text-navy-900",
  danger:
    "bg-white text-rose-700 ring-1 ring-rose-200/70 hover:bg-rose-50/60 hover:ring-rose-300",
  subtle:
    "bg-white text-navy-900 ring-1 ring-navy-900/[0.06] hover:ring-navy-900/15 hover:bg-bone/40",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium tracking-tight transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${className}`}
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
    <div className={`rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045] ${className}`}>
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
    <div className="flex items-start justify-between gap-4 border-b border-navy-900/[0.05] px-6 py-5">
      <div>
        <h3 className="font-display text-[15px] font-semibold tracking-tight text-navy-900">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-xs leading-relaxed text-charcoal/55">{subtitle}</p>
        )}
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
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-medium tracking-tight ring-1 ring-inset ${className}`}
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
    <Card className="group relative overflow-hidden px-5 py-5">
      <span
        className={`absolute left-0 top-5 h-6 w-[2px] rounded-full transition-colors ${
          accent ? "bg-teal-500" : "bg-navy-900/[0.08]"
        }`}
      />
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-charcoal/50">
        {label}
      </p>
      <p
        className={`mt-3 font-display text-[2rem] font-medium leading-none tracking-tight ${
          accent ? "text-teal-700" : "text-navy-900"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-2.5 text-[11px] leading-relaxed text-charcoal/50">{hint}</p>}
    </Card>
  );
}

export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-navy-900/[0.06] pb-3">
      <h2 className="font-display text-[1.4rem] font-medium leading-tight tracking-tight text-navy-900">
        {children}
      </h2>
      {hint && <span className="text-[11px] tracking-tight text-charcoal/50">{hint}</span>}
    </div>
  );
}

// Bandeau doctrine — rappel du périmètre non médical (variante claire, posée).
export function DoctrineNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl bg-white px-5 py-4 text-[12.5px] leading-relaxed text-charcoal/75 shadow-card ring-1 ring-navy-900/[0.045] ${className}`}
    >
      <span className="mt-0.5 flex h-[18px] shrink-0 items-center rounded-md bg-teal-50 px-2 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-teal-700 ring-1 ring-teal-100">
        Doctrine
      </span>
      <p className="leading-relaxed">
        <span className="font-semibold text-navy-900">KOVELA ne décide pas médicalement.</span>{" "}
        KOVELA structure, trace, priorise opérationnellement et transmet au cabinet selon le
        référentiel. L'IA est assistive, interne, loggée et human-in-the-loop.
      </p>
    </div>
  );
}

// Header de page — bandeau navy posé, titre éditorial. Plus institutionnel, moins dramatique.
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
    <div className="relative mb-7 overflow-hidden rounded-2xl bg-navy-depth shadow-card">
      <div className="absolute inset-y-0 left-0 w-[2px] bg-teal-400/70" />
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-500/[0.06] blur-3xl" />
      <div className="relative flex flex-col gap-5 px-8 py-7 md:flex-row md:items-end md:justify-between md:py-8">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-teal-300/90">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-[1.75rem] font-medium leading-[1.15] tracking-tight text-white md:text-[2.1rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-navy-100/65">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>
        )}
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
      <div className="absolute inset-0 bg-navy-950/55 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative z-10 w-full ${wide ? "max-w-2xl" : "max-w-lg"} rounded-2xl bg-white shadow-lift ring-1 ring-navy-900/10`}
      >
        <div className="flex items-center justify-between border-b border-navy-900/[0.06] px-6 py-4">
          <h3 className="font-display text-[15px] font-semibold tracking-tight text-navy-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-charcoal/50 transition-colors hover:bg-navy-900/[0.05] hover:text-navy-900"
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
  estimatedMinutesLabel,
  onAccept,
  onModify,
  onRefuse,
}: {
  output: string;
  estimatedMinutesLabel?: string;
  onAccept?: () => void;
  onModify?: () => void;
  onRefuse?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-teal-100/80 bg-white p-5 shadow-card ring-1 ring-teal-100/40">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-teal-100/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-md bg-teal-600 text-[9.5px] font-bold tracking-tight text-white">
            IA
          </span>
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-teal-700">
            Suggestion IA — à valider par un humain
          </span>
        </div>
        {estimatedMinutesLabel && (
          <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10.5px] text-teal-700 ring-1 ring-teal-100">
            Estimation prototype — {estimatedMinutesLabel}
          </span>
        )}
      </div>
      <pre className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed text-navy-900">
        {output}
      </pre>
      {(onAccept || onModify || onRefuse) && (
        <div className="mt-5 flex flex-wrap gap-2">
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
