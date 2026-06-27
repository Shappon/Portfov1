"use client";

import { motion } from "framer-motion";

/**
 * Phrase de positionnement + CTA affichés en mode carousel.
 *
 * Pour activer le bouton "Télécharger mon CV", déposer le fichier dans `public`
 * (ex : `public/cv.pdf`) puis renseigner `CV_URL` ci-dessous.
 */
const CV_URL: string | null = null;

const PITCH = {
  title:
    "Développeur full-stack autodidacte, je conçois des applications web utiles : SaaS, outils métiers, dashboards et assistants IA.",
  subtitle:
    "Je transforme des besoins concrets en interfaces propres, structurées et exploitables.",
} as const;

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface HeroActionsProps {
  /** Réduire les animations (accessibilité). */
  reduceMotion?: boolean;
  /** `panel` : à droite du CV (section Moi). `carousel` : overlay accueil (déprécié). */
  variant?: "carousel" | "panel";
  /** Layout compact (mobile) : pitch seul, sans boutons — carousel uniquement. */
  compact?: boolean;
  /** Ouvrir la section Projets. */
  onViewProjects: () => void;
}

export function HeroActions({
  reduceMotion = false,
  variant = "panel",
  compact = false,
  onViewProjects,
}: HeroActionsProps) {
  const duration = reduceMotion ? 0 : 0.6;
  const isPanel = variant === "panel";

  return (
    <motion.aside
      className={`hero-actions${isPanel ? " hero-actions--panel" : ""}${compact ? " hero-actions--compact" : ""}`}
      aria-label="Positionnement et actions"
      initial={{ opacity: 0, y: reduceMotion ? 0 : isPanel ? 10 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay: reduceMotion ? 0 : isPanel ? 0.15 : 0.4, ease: EASE }}
    >
      {!isPanel && (
        <div className="hero-actions-pitch">
          <p className="hero-actions-title">{PITCH.title}</p>
          <p className="hero-actions-subtitle">{PITCH.subtitle}</p>
        </div>
      )}

      {(!compact || isPanel) && (
        <div className="hero-actions-cta">
          <button
            type="button"
            className="hero-actions-btn hero-actions-btn--primary"
            onClick={onViewProjects}
            aria-label="Voir mes projets"
          >
            Voir mes projets
          </button>
          {CV_URL && (
            <a
              className="hero-actions-btn hero-actions-btn--ghost"
              href={CV_URL}
              download
              aria-label="Télécharger mon CV"
            >
              Télécharger mon CV
            </a>
          )}
        </div>
      )}
    </motion.aside>
  );
}
