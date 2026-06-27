/**
 * Sections du carrousel 3D (accueil).
 *
 * - kind "panel"   → ouvre le contenu plein écran (Moi, Projets).
 * - kind "external"   → ouvre une URL externe au clic (cubes 3D).
 * - kind "coming-soon" → cube informatif, clic sans navigation (retour visuel).
 *
 * Modifie externalUrl, title et subtitle pour personnaliser les liens.
 */
export type CarouselSectionKind = "panel" | "external" | "coming-soon";

export interface CarouselSection {
  id: string;
  title: string;
  subtitle: string;
  kind: CarouselSectionKind;
  /** Libellé sous la forme 3D (Label3D) */
  label: string;
  /** Sous-titre affiché sous le libellé (ex. cubes externes). */
  sublabel?: string;
  /** URL cible si kind === "external" */
  externalUrl?: string;
  /** Couleurs du cube 3D (sections externes) */
  cubeColor?: string;
  cubeEmissive?: string;
}

export const CAROUSEL_SECTIONS: readonly CarouselSection[] = [
  {
    id: "me",
    title: "Moi",
    subtitle: "Développeur autodidacte • Produits • IA (et pédagogie)",
    kind: "panel",
    label: "MOI",
  },
  {
    id: "projects",
    title: "Explorer mes projets",
    subtitle: "SaaS • Tools • Expérimentations",
    kind: "panel",
    label: "PROJETS",
  },
  {
    id: "link-tbk",
    title: "TBK",
    subtitle: "Projet à venir",
    kind: "coming-soon",
    label: "TBK",
    sublabel: "arrive bientôt",
    cubeColor: "#7a8fbf",
    cubeEmissive: "#2a3555",
  },
  {
    id: "link-hyh-solution",
    title: "HYH solution",
    subtitle: "Projet à venir",
    kind: "coming-soon",
    label: "HYH solution",
    sublabel: "arrive bientôt",
    cubeColor: "#6c7bd8",
    cubeEmissive: "#2a2a4a",
  },
];

export function isComingSoonSection(section: CarouselSection): boolean {
  return section.kind === "coming-soon";
}

export function isExternalSection(section: CarouselSection): boolean {
  return section.kind === "external" && Boolean(section.externalUrl);
}

export function isCubeSection(section: CarouselSection): boolean {
  return section.kind === "external" || section.kind === "coming-soon";
}

export function openExternalSection(section: CarouselSection): void {
  if (!section.externalUrl) return;
  window.open(section.externalUrl, "_blank", "noopener,noreferrer");
}
