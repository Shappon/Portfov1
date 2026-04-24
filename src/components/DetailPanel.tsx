"use client";

import { useSpring, animated } from "@react-spring/web";
import { MePanel } from "./panels/MePanel";
import { ProjectsPanel } from "./panels/ProjectsPanel";
import { AIPanel } from "./panels/AIPanel";

export interface SectionForPanel {
  id: string;
  title: string;
  subtitle: string;
}

interface DetailPanelProps {
  mode: "carousel" | "detail";
  section: SectionForPanel;
  onBack: () => void;
}

export function DetailPanel({ mode, section, onBack }: DetailPanelProps) {
  const isVisible = mode === "detail";

  const smoothConfig = { tension: 60, friction: 26 };
  const contentConfig = { tension: 50, friction: 28 };

  const panelStyle = useSpring({
    opacity: isVisible ? 1 : 0,
    x: isVisible ? 0 : 50,
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
  const isAISection = section.id === "ai";
  const isFullscreenSection = isMeSection || isProjectsSection || isAISection;

  return (
    <animated.div
      className={`detail-panel-wrap position-absolute top-0 end-0 h-100 d-flex align-items-stretch overflow-hidden${isMeSection ? " detail-panel-me-active" : ""}${isProjectsSection ? " detail-panel-projects-active" : ""}${isAISection ? " detail-panel-ai-active" : ""}`}
      style={{
        /* Réserver ~35% à gauche pour la forme 3D, max 1500px, fluide */
        width: "min(65vw, 1500px)",
        maxWidth: "min(65vw, 100%)",
        minWidth: "min(100%, 280px)",
        opacity: panelStyle.opacity,
        transform: panelStyle.x.to((x) => `translateX(${x}px)`),
        filter: panelStyle.filter,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-label={section.title}
    >
      <div className="card shadow-lg border-0 rounded-3 w-100 h-100 d-flex flex-column overflow-hidden">
        <div
          className={`card-body d-flex flex-column ${
            isFullscreenSection ? "p-0 overflow-hidden" : "p-4 overflow-auto"
          }`}
        >
          {isFullscreenSection && (
            <div className="detail-panel-fullscreen-topbar d-flex align-items-center justify-content-between gap-2 border-bottom border-secondary border-opacity-25 flex-shrink-0 px-3 py-2">
              <div className="min-w-0">
                <h2 className="h6 mb-0 text-white text-truncate">{section.title}</h2>
                {section.subtitle ? (
                  <p className="small mb-0 text-truncate d-none d-sm-block" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                    {section.subtitle}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-light flex-shrink-0"
                onClick={onBack}
                aria-label="Fermer le panneau et revenir au carousel"
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
            {section.id === "me" && <MePanel />}
            {section.id === "projects" && <ProjectsPanel />}
            {section.id === "ai" && <AIPanel />}
          </animated.div>
        </div>
      </div>
    </animated.div>
  );
}

