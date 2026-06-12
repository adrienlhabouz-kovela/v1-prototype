"use client";

import { useEffect, useRef } from "react";

/**
 * RevealObserver — observe globalement tous les `.reveal-target` du DOM
 * et leur ajoute la classe `.revealed` quand ils entrent dans le
 * viewport. Une seule instance par page (à placer en haut).
 *
 * Plus efficace qu'une instance Reveal par section : un seul
 * IntersectionObserver pour toute la page.
 */
export function RevealObserver() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-target"),
    );
    if (reduce) {
      els.forEach((el) => el.classList.add("revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}

/**
 * Reveal — petit composant client qui anime son enfant à l'apparition
 * dans le viewport (IntersectionObserver).
 *
 * Usage :
 *   <Reveal><MySection /></Reveal>
 *
 * Démarre invisible + légèrement décalé vers le bas, fade-in + slide-up
 * de 600ms à 30% de visibilité. Pas d'animation si l'utilisateur a
 * `prefers-reduced-motion: reduce`.
 */
export function Reveal({
  children,
  delay = 0,
  threshold = 0.15,
}: {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect des préférences utilisateur
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revealed");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("revealed");
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className="reveal-target"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
