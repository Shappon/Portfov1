"use client";

import { useCallback, useEffect, useState } from "react";
import { useMediaQueryMatch } from "@/hooks/useMediaQueryMatch";
import { Canvas } from "@react-three/fiber";
import {
  CAROUSEL_SECTIONS,
  isComingSoonSection,
  isExternalSection,
  openExternalSection,
  type CarouselSection,
} from "@/data/carousel-sections";
import { SceneCarousel } from "./SceneCarousel";
import { DetailPanel } from "./DetailPanel";
import { HeroIdentity } from "./HeroIdentity";
import { SceneMobileNav } from "./SceneMobileNav";

export type { CarouselSection as SectionItem };
export type ViewMode = "carousel" | "detail";

export default function Home3D() {
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [activeIndex, setActiveIndex] = useState(0);
  const [comingSoonPulse, setComingSoonPulse] = useState<{ id: string; key: number } | null>(null);

  const totalSections = CAROUSEL_SECTIONS.length;

  const triggerComingSoon = useCallback((sectionId: string) => {
    setComingSoonPulse({ id: sectionId, key: Date.now() });
  }, []);
  const goLeft = useCallback(() => {
    if (viewMode !== "carousel") return;
    setActiveIndex((i) => (i + totalSections - 1) % totalSections);
  }, [viewMode, totalSections]);

  const goRight = useCallback(() => {
    if (viewMode !== "carousel") return;
    setActiveIndex((i) => (i + 1) % totalSections);
  }, [viewMode, totalSections]);

  const exit = useCallback(() => setViewMode("carousel"), []);

  const openSection = useCallback((id: string) => {
    const index = CAROUSEL_SECTIONS.findIndex((s) => s.id === id);
    if (index < 0) return;
    const section = CAROUSEL_SECTIONS[index];
    setActiveIndex(index);
    if (isComingSoonSection(section)) {
      triggerComingSoon(section.id);
      return;
    }
    if (isExternalSection(section)) {
      openExternalSection(section);
      return;
    }
    setViewMode("detail");
  }, [triggerComingSoon]);

  const activateCenter = useCallback(() => {
    const section = CAROUSEL_SECTIONS[activeIndex];
    if (isComingSoonSection(section)) {
      triggerComingSoon(section.id);
      return;
    }
    if (isExternalSection(section)) {
      openExternalSection(section);
      return;
    }
    setViewMode("detail");
  }, [activeIndex, triggerComingSoon]);

  const onViewProjects = useCallback(() => openSection("projects"), [openSection]);

  useEffect(() => {
    document.body.classList.add("home-fullpage");
    return () => document.body.classList.remove("home-fullpage");
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (viewMode === "detail") exit();
        return;
      }
      if (viewMode === "carousel") {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goLeft();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goRight();
        } else if (e.key === "Enter") {
          const target = e.target as HTMLElement;
          if (target?.closest("button") || target?.closest("a")) return;
          e.preventDefault();
          activateCenter();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewMode, goLeft, goRight, activateCenter, exit]);

  const active = CAROUSEL_SECTIONS[activeIndex];
  const reduceMotion = useMediaQueryMatch("(prefers-reduced-motion: reduce)");
  const isNarrowViewport = useMediaQueryMatch("(max-width: 768px)");
  const detailNarrow = viewMode === "detail" && isNarrowViewport;
  const activeIsExternal = isExternalSection(active);
  const activeIsComingSoon = isComingSoonSection(active);
  const mobilePrimaryLabel = activeIsComingSoon ? "Bientôt" : activeIsExternal ? "Visiter" : "Ouvrir";

  return (
    <div
      className={`home3d-root${viewMode === "detail" ? " detail" : ""}${
        detailNarrow ? " home3d-root--detail-narrow" : ""
      }`}
    >
      <div className="home3d-bg" aria-hidden="true" />
      <div className="home3d-mask" aria-hidden="true" />
      <Canvas
        className="home3d-canvas"
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.6]}
        shadows
        gl={{ antialias: true }}
      >
        <SceneCarousel
          sections={CAROUSEL_SECTIONS}
          viewMode={viewMode}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          onEnter={activateCenter}
          comingSoonPulse={comingSoonPulse}
          onComingSoonAttempt={triggerComingSoon}
        />
      </Canvas>

      <div className="home3d-overlay">
        {viewMode === "carousel" && (
          <>
            <HeroIdentity isHighlight={active?.id === "me"} reduceMotion={reduceMotion} />
            {isNarrowViewport && (
              <SceneMobileNav
                activeIndex={activeIndex}
                total={totalSections}
                activeTitle={active.title}
                primaryActionLabel={mobilePrimaryLabel}
                onPrev={goLeft}
                onNext={goRight}
                onSelect={setActiveIndex}
                onEnter={activateCenter}
              />
            )}
          </>
        )}
        {viewMode === "detail" && !activeIsExternal && (
          <>
            <div
              className="home3d-overlay-backdrop"
              onClick={exit}
              onKeyDown={(e) => e.key === "Enter" && exit()}
              role="button"
              tabIndex={0}
              aria-label="Fermer le panneau et revenir au carousel"
            />
            <DetailPanel
              mode="detail"
              section={{ id: active.id, title: active.title, subtitle: active.subtitle }}
              onBack={exit}
              onViewProjects={onViewProjects}
            />
          </>
        )}
      </div>
    </div>
  );
}
