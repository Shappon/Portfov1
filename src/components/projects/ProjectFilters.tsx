"use client";

import type { ProjectCategory } from "@/types/project";
import { MAIN_CATEGORIES } from "@/types/project";

/** Valeur de filtre : une catégorie, "featured" (mis en avant) ou null (tous). */
export type ProjectFilter = ProjectCategory | "featured" | null;

interface ProjectFiltersProps {
  value: ProjectFilter;
  onChange: (value: ProjectFilter) => void;
}

/**
 * Barre de filtres de la grille projets : Tous, Mis en avant, puis catégories.
 * Conserve les classes `btn-pill-main` existantes pour ne pas casser le style.
 */
export function ProjectFilters({ value, onChange }: ProjectFiltersProps) {
  return (
    <div className="projects-panel-filters mb-4 mb-md-5 d-flex justify-content-center flex-shrink-0">
      <div
        className="d-flex flex-wrap gap-2 overflow-x-auto overflow-y-hidden pb-1 justify-content-center"
        role="group"
        aria-label="Filtrer les projets"
      >
        <button
          type="button"
          className={`btn btn-pill btn-pill-main ${value === null ? "btn-pill-main--active" : "btn-pill-main--inactive"}`}
          aria-pressed={value === null}
          onClick={() => onChange(null)}
        >
          Tous
        </button>
        <button
          type="button"
          className={`btn btn-pill btn-pill-main btn-pill-main--featured ${value === "featured" ? "btn-pill-main--active" : "btn-pill-main--inactive"}`}
          aria-pressed={value === "featured"}
          onClick={() => onChange("featured")}
        >
          ★ Mis en avant
        </button>
        {MAIN_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`btn btn-pill btn-pill-main btn-pill-main--${c.id} ${value === c.id ? "btn-pill-main--active" : "btn-pill-main--inactive"}`}
            aria-pressed={value === c.id}
            onClick={() => onChange(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
