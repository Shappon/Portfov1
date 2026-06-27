"use client";

import { useState, useMemo } from "react";
import { useSpring, useSprings, animated } from "@react-spring/web";
import { useMediaQueryMatch } from "@/hooks/useMediaQueryMatch";
import type { Project } from "@/types/project";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters, type ProjectFilter } from "@/components/projects/ProjectFilters";
import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";

// Types réexportés pour compatibilité avec d'éventuels imports existants.
export type {
  Project,
  ProjectCategory,
  ProjectStatus,
  ProjectLevel,
  ProofType,
  ProblemContext,
  StackBreakdown,
  Architecture,
} from "@/types/project";

interface ProjectsExplorerProps {
  filter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
  onSelectProject: (project: Project) => void;
  reduceMotion: boolean;
}

function ProjectsExplorer({
  filter,
  onFilterChange,
  onSelectProject,
  reduceMotion,
}: ProjectsExplorerProps) {
  const filtered = useMemo(() => {
    if (filter === null) return projects;
    if (filter === "featured") return projects.filter((p) => p.featured);
    return projects.filter((p) => p.category === filter);
  }, [filter]);

  const [cardSprings] = useSprings(filtered.length, (i) => ({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    delay: reduceMotion ? 0 : 80 + i * 60,
    config: { duration: reduceMotion ? 0 : 280 },
  }));

  return (
    <div className="projects-panel-explorer projects-panel-explorer--scrollable d-flex flex-column h-100 min-h-0">
      <header className="projects-panel-header mb-4 mb-md-5 text-center flex-shrink-0">
        <h1 className="projects-panel-title mb-0">Explorer mes projets</h1>
      </header>

      <ProjectFilters value={filter} onChange={onFilterChange} />

      <section className="projects-panel-grid mt-2 mb-4 flex-shrink-0">
        <div className="row g-3 g-md-3 mx-0">
          {filtered.map((project, i) => (
            <div key={project.id} className="col-12 col-sm-6 col-lg-4 projects-panel-grid-cell">
              <animated.div
                className="h-100"
                style={{
                  opacity: cardSprings[i]?.opacity,
                  transform: cardSprings[i]?.y.to((y) => `translateY(${y}px)`),
                }}
              >
                <ProjectCard project={project} onSelect={onSelectProject} />
              </animated.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Composant principal : état (filtre, sélection), transition et rendu. */
export function ProjectsPanel() {
  const [filter, setFilter] = useState<ProjectFilter>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reduceMotion = useMediaQueryMatch("(prefers-reduced-motion: reduce)");

  const transitionSpring = useSpring({
    from: { opacity: 0, y: 12 },
    to: { opacity: 1, y: 0 },
    config: { duration: reduceMotion ? 0 : 240 },
  });

  return (
    <div className="projects-panel-root d-flex flex-column w-100 h-100 min-h-0">
      <animated.div
        key={selectedProject ? "detail" : "explorer"}
        className="projects-panel-view w-100 h-100 min-h-0 d-flex flex-column"
        style={{
          opacity: transitionSpring.opacity,
          transform: transitionSpring.y.to((y) => `translateY(${y}px)`),
        }}
      >
        {selectedProject ? (
          <ProjectCaseStudy
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
            reduceMotion={reduceMotion}
          />
        ) : (
          <ProjectsExplorer
            filter={filter}
            onFilterChange={setFilter}
            onSelectProject={setSelectedProject}
            reduceMotion={reduceMotion}
          />
        )}
      </animated.div>
    </div>
  );
}
