"use client";

import type { Project } from "@/types/project";
import { categoryLabel, projectCardTitle } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

/** Carte projet minimale : titre, tags, description courte. */
export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <div
      className={`projects-panel-card card border-0 rounded-3 p-3 h-100 projects-panel-card--${project.category}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(project);
        }
      }}
      aria-label={`Voir le projet ${project.title}`}
    >
      <h3 className="projects-panel-card-title mb-2">{projectCardTitle(project.title)}</h3>

      <div className="projects-panel-card-meta d-flex flex-wrap gap-1 mb-2">
        <span
          className={`projects-panel-card-category projects-panel-cat-badge projects-panel-cat-badge--${project.category} small`}
        >
          {categoryLabel(project.category)}
        </span>
        {project.level && (
          <span className="projects-panel-card-level">{project.level}</span>
        )}
        {project.status && (
          <span className="projects-panel-card-status">{project.status}</span>
        )}
      </div>

      <p className="projects-panel-card-desc small mb-0">{project.description}</p>
    </div>
  );
}
