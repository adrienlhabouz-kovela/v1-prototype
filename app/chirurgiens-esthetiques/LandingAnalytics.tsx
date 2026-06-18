"use client";

import { useEffect } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// LandingAnalytics — tracking conversion prototype pour
// /chirurgiens-esthetiques.
//
// Aucun analytics externe branché (pas de GA, pas de Meta Pixel, pas de
// LinkedIn Insight). Tous les événements partent sur
// console.info("[KOVELA_CONVERSION_EVENT]", payload) — la structure du
// payload est prête pour relier un endpoint réel en V1 production.
//
// Événements prévus :
//   landing_view · hero_cta_click · secondary_cta_click · flow_view ·
//   form_start · form_submit · lead_created.
//
// Funnel cible (étapes CRM ultérieures à documenter côté backend) :
//   visite → CTA click → form_start → form_submit → lead_created
//   → qualified → meeting_booked → meeting_done → pilot_proposed
//   → pilot_started → lost.
// ---------------------------------------------------------------------------

const LANDING_VERSION = "chirurgiens-esthetiques-v3.1";
const LEAD_SEGMENT = "chirurgien_esthetique";
const ROUTE = "/chirurgiens-esthetiques";

type EventPayload = Record<string, unknown>;

function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  return {
    utm_source: sp.get("utm_source") ?? "",
    utm_medium: sp.get("utm_medium") ?? "",
    utm_campaign: sp.get("utm_campaign") ?? "",
    utm_content: sp.get("utm_content") ?? "",
    utm_term: sp.get("utm_term") ?? "",
  };
}

function deviceHint(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.matchMedia("(max-width: 640px)").matches ? "mobile" : "desktop";
}

export function trackEvent(name: string, extra: EventPayload = {}) {
  const payload = {
    event: name,
    route: ROUTE,
    landing_version: LANDING_VERSION,
    lead_segment: LEAD_SEGMENT,
    timestamp: new Date().toISOString(),
    device_hint: deviceHint(),
    ...readUtm(),
    ...extra,
  };
  // Console only — pas de branchement analytics externe sans validation
  // cookies / RGPD. Filtrer par "[KOVELA_CONVERSION_EVENT]" en DevTools.
  console.info("[KOVELA_CONVERSION_EVENT]", payload);
}

// ---------------------------------------------------------------------------
// LandingViewTracker — tracking d'événement à l'arrivée sur la page.
// Composant invisible monté au plus haut du DOM de la page.
// ---------------------------------------------------------------------------
export function LandingViewTracker() {
  useEffect(() => {
    trackEvent("landing_view");
  }, []);
  return null;
}

// ---------------------------------------------------------------------------
// TrackedCtaLink — Link avec tracking de clic. Réutilise les classes du
// design system existant. Conserve le comportement Next.js Link (ancres
// internes scrollées proprement).
// ---------------------------------------------------------------------------
export function TrackedCtaLink({
  href,
  eventName,
  className,
  children,
  extraPayload,
}: {
  href: string;
  eventName: string;
  className?: string;
  children: React.ReactNode;
  extraPayload?: EventPayload;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent(eventName, extraPayload)}
    >
      {children}
    </Link>
  );
}
