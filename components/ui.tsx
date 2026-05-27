"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle";

const variants: Record<Variant, string> = {
  primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-soft",
  secondary: "bg-navy-900 text-white hover:bg-navy-800",
  ghost: "bg-transparent text-navy-900 hover:bg-navy-50",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  subtle: "bg-white text-navy-900 ring-1 ring-slate-200 hover:bg-slate-50",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
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
    <div className={`rounded-2xl bg-white shadow-card ring-1 ring-slate-100 ${className}`}>
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
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
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
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
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
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${accent ? "text-teal-600" : "text-navy-900"}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </Card>
  );
}

export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-lg font-semibold tracking-tight text-navy-900">{children}</h2>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );
}

// Bandeau doctrine — visible pour rappeler le périmètre non médical.
export function DoctrineNote({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-navy-50 px-4 py-3 text-xs leading-relaxed text-navy-700 ring-1 ring-navy-100 ${className}`}>
      <span className="font-semibold">Doctrine KOVELA :</span> KOVELA ne décide pas
      médicalement. KOVELA structure, trace, priorise opérationnellement et escalade.
      L'IA est assistive, interne, loggée et human-in-the-loop.
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
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative z-10 w-full ${wide ? "max-w-2xl" : "max-w-lg"} rounded-2xl bg-white shadow-card`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-navy-900" aria-label="Fermer">
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

// Encadré de sortie IA, avec disclaimer obligatoire et actions humaines.
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
    <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-teal-600 text-[10px] font-bold text-white">
          IA
        </span>
        <span className="text-xs font-semibold text-teal-700">Suggestion IA — à valider par un humain</span>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-navy-900">{output}</pre>
      {(onAccept || onModify || onRefuse) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {onAccept && (
            <Button variant="primary" onClick={onAccept}>
              Accepter
            </Button>
          )}
          {onModify && (
            <Button variant="subtle" onClick={onModify}>
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
