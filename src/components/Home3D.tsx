"use client";

import { useCallback, useEffect, useState } from "react";
import { useMediaQueryMatch } from "@/hooks/useMediaQueryMatch";
import { Canvas } from "@react-three/fiber";
import { SceneCarousel } from "./SceneCarousel";
import { DetailPanel } from "./DetailPanel";
import { HeroIdentity } from "./HeroIdentity";

export interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
}

export type ViewMode = "carousel" | "detail";

const SECTIONS: SectionItem[] = [
  { id: "me", title: "Moi", subtitle: "Développeur autodidacte • Produits • IA (et pédagogie)" },
  { id: "projects", title: "Explorer mes projets", subtitle: "SaaS • Tools • Expérimentations" },
  { id: "ai", title: "IA", subtitle: "Pédagogie, IA, repères & ressources" },
];

export default function Home3D() {
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSections = SECTIONS.length;
  const goLeft = useCallback(() => {
    if (viewMode !== "carousel") return;
    setActiveIndex((i) => (i + totalSections - 1) % totalSections);
  }, [viewMode, totalSections]);

  const goRight = useCallback(() => {
    if (viewMode !== "carousel") return;
    setActiveIndex((i) => (i + 1) % totalSections);
  }, [viewMode, totalSections]);

  const enter = useCallback(() => setViewMode("detail"), []);
  const exit = useCallback(() => setViewMode("carousel"), []);

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
          enter();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewMode, goLeft, goRight, enter, exit]);

  const active = SECTIONS[activeIndex];
  const reduceMotion = useMediaQueryMatch("(prefers-reduced-motion: reduce)");

  return (
    <div className={`home3d-root ${viewMode === "detail" ? " detail" : ""}`}>
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
          sections={SECTIONS}
          viewMode={viewMode}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          onEnter={enter}
        />
      </Canvas>

      <div className="home3d-overlay">
        {viewMode === "carousel" && (
          <HeroIdentity
            isHighlight={active?.id === "me"}
            reduceMotion={reduceMotion}
          />
        )}
        {viewMode === "detail" && (
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
            />
          </>
        )}
      </div>
    </div>
  );
}
