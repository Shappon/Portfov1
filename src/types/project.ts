/**
 * Types du domaine "Projets".
 *
 * Le contenu reste hardcodé dans `src/data/projects.ts`.
 * Ce fichier ne contient que les types, pour pouvoir les réutiliser
 * dans les composants (`ProjectCard`, `ProjectFilters`, `ProjectCaseStudy`, ...).
 */

export type ProjectCategory = "saas" | "dev" | "reseau";

/** Niveau de maturité du projet (affiché en badge sur les cartes). */
export type ProjectStatus =
  | "Prototype"
  | "En cours"
  | "Démo locale"
  | "Projet personnel"
  | "Production-like";

/** Axe principal démontré par le projet (badge "niveau"). */
export type ProjectLevel =
  | "SaaS"
  | "IA"
  | "Outil métier"
  | "Frontend avancé"
  | "Full-stack";

/** Type de preuve disponible pour appuyer le projet. */
export type ProofType =
  | "Capture"
  | "Vidéo"
  | "GitHub"
  | "Démo"
  | "Code local"
  | "Non publié";

/** Contexte détaillé du problème (case study). */
export interface ProblemContext {
  contexte?: string;
  situationInitiale?: string;
  utilisateurCible?: string;
}

/** Stack détaillée par couche (case study). */
export interface StackBreakdown {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  orm?: string[];
  auth?: string[];
  hosting?: string[];
}

/** Architecture technique (case study). */
export interface Architecture {
  frontend?: string;
  backend?: string;
  database?: string;
  auth?: string;
  hosting?: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  subCategory?: string;
  description: string;
  problem: string;
  solution: string;
  stack: string[];
  proof: [string, string, string];
  demoUrl?: string;
  githubUrl?: string;

  // ——— Champs de valorisation (carte projet) ———
  /** Maturité du projet (badge). */
  status?: ProjectStatus;
  /** Axe principal démontré (badge). */
  level?: ProjectLevel;
  /** Phrase courte expliquant ce que le projet démontre techniquement. */
  highlight?: string;
  /** Type de preuve disponible. */
  proofType?: ProofType;
  /** Projet mis en avant (prioritaire) dans la grille. */
  featured?: boolean;

  // ——— Champs case study (optionnels) ———
  /** Type d'application (ex: Dashboard, Web App, API). */
  appType?: string;
  /** Stack par couche pour la section Présentation. */
  stackBreakdown?: StackBreakdown;
  /** Contexte métier détaillé pour "Le problème". */
  problemContext?: ProblemContext;
  /** Liste de fonctionnalités pour "La solution". */
  solutionFeatures?: string[];
  /** URLs d'images pour la démo. */
  demoScreenshots?: string[];
  /** URL vidéo démo. */
  demoVideo?: string;
  /** Lien démo live (alias ou complément de demoUrl). */
  demoLiveUrl?: string;
  /** Architecture technique (Frontend, Backend, etc.). */
  architecture?: Architecture;
  /** Challenges techniques rencontrés. */
  challenges?: string[];
  /** Décisions d'ingénierie. */
  technicalDecisions?: string[];
  /** Impact / résultats. */
  impact?: string[];
  /** Améliorations futures. */
  futureImprovements?: string[];
}

/** Catégories principales utilisées par les filtres. */
export const MAIN_CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "saas", label: "SaaS" },
  { id: "dev", label: "Dev" },
  { id: "reseau", label: "Réseau/Cyber" },
];

export function categoryLabel(cat: ProjectCategory): string {
  return MAIN_CATEGORIES.find((c) => c.id === cat)?.label ?? cat;
}

/** Titre court pour la grille (sans sous-titre après « — »). */
export function projectCardTitle(title: string): string {
  const dash = title.indexOf(" — ");
  return dash === -1 ? title : title.slice(0, dash);
}
