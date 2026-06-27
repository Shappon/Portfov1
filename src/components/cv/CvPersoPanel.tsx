"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CV_IDENTITY } from "@/data/cv";
import {
  CV_PERSONAL,
  type CvPersonalBloc,
  type CvPersonalBlocId,
} from "@/data/cv-personal";

const EASE_OUT = [0.22, 0.61, 0.36, 1] as const;

function PersoDetail({ bloc }: { bloc: CvPersonalBloc }) {
  if ("detail" in bloc && bloc.detail) {
    return <p className="cv-persona-detail-text">{bloc.detail}</p>;
  }
  if ("detailSteps" in bloc && bloc.detailSteps) {
    return (
      <ul className="cv-persona-detail-list">
        {bloc.detailSteps.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return null;
}

export function CvPersoPanel() {
  const [activeId, setActiveId] = useState<CvPersonalBlocId | null>(null);
  const activeBloc = activeId
    ? (CV_PERSONAL.blocs.find((b) => b.id === activeId) ?? null)
    : null;

  const selectBloc = (id: CvPersonalBlocId) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="cv-persona">
      <header className="cv-persona-header">
        <p className="cv-persona-eyebrow">En quelques mots</p>
        <h2 className="cv-persona-name">{CV_IDENTITY.name}</h2>
        <p className="cv-persona-tagline">{CV_PERSONAL.tagline}</p>
      </header>

      <div className="cv-persona-body">
        <div className="cv-persona-photo-wrap">
          <Image
            src="/me.png"
            alt={CV_IDENTITY.name}
            className="cv-persona-photo"
            width={220}
            height={320}
            priority
            sizes="(max-width: 576px) 120px, 220px"
          />
        </div>

        <div className="cv-persona-nav-col">
          <p className="cv-persona-nav-hint">Choisir un thème</p>
          <div className="cv-persona-nav" role="tablist" aria-label="Thèmes personnels">
            {CV_PERSONAL.blocs.map((bloc) => {
              const isActive = activeId === bloc.id;
              return (
                <button
                  key={bloc.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="cv-persona-detail"
                  id={`cv-persona-tab-${bloc.id}`}
                  className={`cv-persona-pill${isActive ? " cv-persona-pill--active" : ""}`}
                  onClick={() => selectBloc(bloc.id)}
                >
                  {bloc.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section
        id="cv-persona-detail"
        className="cv-persona-detail"
        role="tabpanel"
        aria-labelledby={activeId ? `cv-persona-tab-${activeId}` : undefined}
      >
        <AnimatePresence mode="wait">
          {activeBloc ? (
            <motion.div
              key={activeBloc.id}
              className="cv-persona-detail-inner"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: EASE_OUT }}
            >
              <h3 className="cv-persona-detail-title">{activeBloc.title}</h3>
              <PersoDetail bloc={activeBloc} />
            </motion.div>
          ) : (
            <motion.p
              key="placeholder"
              className="cv-persona-detail-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              Sélectionnez un thème pour en savoir plus sur moi — en dehors du cadre professionnel.
            </motion.p>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
