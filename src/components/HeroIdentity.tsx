"use client";

import { motion } from "framer-motion";

// ——— Contenu modifiable (identité) ———
export const HERO_IDENTITY = {
  firstName: "Shuan",
  lastName: "Huynh",
  role: "Développeur Full-Stack",
} as const;

const DURATION = 0.6;
const STAGGER = 0.12;
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface HeroIdentityProps {
  /** Afficher avec un accent visuel renforcé (ex: section "Moi" active) */
  isHighlight?: boolean;
  /** Réduire les animations (accessibilité) */
  reduceMotion?: boolean;
}

export function HeroIdentity({ isHighlight = false, reduceMotion = false }: HeroIdentityProps) {
  const duration = reduceMotion ? 0 : DURATION;
  const stagger = reduceMotion ? 0 : STAGGER;
  return (
    <motion.div
      className={`hero-identity ${isHighlight ? "hero-identity--highlight" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration * 0.5, ease: EASE }}
      aria-label={`${HERO_IDENTITY.firstName} ${HERO_IDENTITY.lastName}, ${HERO_IDENTITY.role}`}
    >
      <div className="hero-identity-inner">
        <motion.p
          className="hero-identity-name"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: 0.1, ease: EASE }}
        >
          <motion.span
            className="hero-identity-first"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: 0.15, ease: EASE }}
          >
            {HERO_IDENTITY.firstName}
          </motion.span>{" "}
          <motion.span
            className="hero-identity-last"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: 0.15 + stagger, ease: EASE }}
          >
            {HERO_IDENTITY.lastName}
          </motion.span>
        </motion.p>
        <motion.p
          className="hero-identity-role"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: 0.25 + stagger * 2, ease: EASE }}
        >
          {HERO_IDENTITY.role}
        </motion.p>
      </div>
      <span className="hero-identity-glow" aria-hidden />
    </motion.div>
  );
}
