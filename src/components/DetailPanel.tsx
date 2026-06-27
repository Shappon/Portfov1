"use client";

import { useSpring, animated } from "@react-spring/web";
import { useMediaQueryMatch } from "@/hooks/useMediaQueryMatch";
import { MePanel } from "./panels/MePanel";
import { ProjectsPanel } from "./panels/ProjectsPanel";
import { SectionMiniShape } from "./SectionMiniShape";

export interface SectionForPanel {
  id: string;
  title: string;
  subtitle: string;
}

interface DetailPanelProps {
  mode: "carousel" | "detail";
  section: SectionForPanel;
  onBack: () => void;
  onViewProjects?: () => void;
  onContact?: () => void;
}

export function DetailPanel({ mode, section, onBack, onViewProjects, onContact }: DetailPanelProps) {
  const isVisible = mode === "detail";
  const reduceMotion = useMediaQueryMatch("(prefers-reduced-motion: reduce)");

  const smoothConfig = { tension: 60, friction: 26 };
  const contentConfig = { tension: 50, friction: 28 };

  const panelStyle = useSpring({
    opacity: isVisible ? 1 : 0,
    y: isVisible ? 0 : 24,
    filter: isVisible ? "blur(0px)" : "blur(4px)",
    config: smoothConfig,
  });

  const headerStyle = useSpring({
    opacity: isVisible ? 1 : 0,
    y: isVisible ? 0 : 8,
    config: contentConfig,
    delay: isVisible ? 80 : 0,
  });

  const bodyStyle = useSpring({
    opacity: isVisible ? 1 : 0,
    y: isVisible ? 0 : 10,
    config: contentConfig,
    delay: isVisible ? 180 : 0,
  });

  const isMeSection = section.id === "me";
  const isProjectsSection = section.id === "projects";
  const isFullscreenSection = isMeSection || isProjectsSection;

  return (
    <animated.div
      className={`detail-panel-wrap position-absolute top-0 start-0 w-100 h-100 min-h-0 d-flex align-items-stretch overflow-hidden${isMeSection ? " detail-panel-me-active" : ""}${isProjectsSection ? " detail-panel-projects-active" : ""}`}
      style={{
        /* Plein écran : le contenu occupe toute la page */
        opacity: panelStyle.opacity,
        transform: panelStyle.y.to((y) => `translateY(${y}px)`),
        filter: panelStyle.filter,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label={section.title}
    >
      <div className="card detail-panel-card-shell shadow-lg border-0 rounded-3 w-100 h-100 d-flex flex-column overflow-hidden min-h-0">
        <div
          className={`card-body d-flex flex-column min-h-0 ${
            isFullscreenSection ? "p-0 overflow-hidden" : "p-4 overflow-auto"
          }`}
        >
          {isFullscreenSection && (
            <div className="detail-panel-fullscreen-topbar d-flex align-items-center gap-2 gap-sm-3 border-bottom border-secondary border-opacity-25 flex-shrink-0 px-3 py-2">
              <div className="detail-panel-topbar-shape flex-shrink-0" aria-hidden="true">
                <SectionMiniShape sectionId={section.id} reduceMotion={reduceMotion} />
              </div>
              <div className="min-w-0 flex-grow-1">
                <h2 className="h6 mb-0 text-white text-truncate">{section.title}</h2>
                {section.subtitle ? (
                  <p className="small mb-0 text-truncate d-none d-sm-block" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                    {section.subtitle}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-light flex-shrink-0 detail-panel-close-btn"
                onClick={onBack}
                aria-label="Fermer et revenir au carousel"
              >
                Fermer
              </button>
            </div>
          )}
          {!isFullscreenSection && (
            <>
              <animated.div
                className="d-flex justify-content-between align-items-start mb-3"
                style={{ opacity: headerStyle.opacity, transform: headerStyle.y.to((y) => `translateY(${y}px)`) }}
              >
                <div>
                  <h1 className="h4 mb-1">{section.title}</h1>
                  {section.subtitle && <p className="text-body-secondary small mb-0">{section.subtitle}</p>}
                </div>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onBack}>
                  Retour
                </button>
              </animated.div>
              <animated.p
                className="text-muted small mb-3"
                style={{ opacity: headerStyle.opacity, transform: headerStyle.y.to((y) => `translateY(${y}px)`) }}
              >
                Esc pour revenir
              </animated.p>
            </>
          )}

          <animated.div
            className={isFullscreenSection ? "detail-panel-fullscreen-content" : ""}
            style={{ opacity: bodyStyle.opacity, transform: bodyStyle.y.to((y) => `translateY(${y}px)`) }}
          >
            {section.id === "me" && (
              <MePanel onViewProjects={onViewProjects} onContact={onContact} />
            )}
            {section.id === "projects" && <ProjectsPanel />}
          </animated.div>
        </div>
      </div>
    </animated.div>
  );
}

