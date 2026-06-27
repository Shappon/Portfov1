"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQueryMatch } from "@/hooks/useMediaQueryMatch";
import { HeroActions } from "@/components/HeroActions";
import { CvVideoPlayer } from "@/components/cv/CvVideoPlayer";
import { CvPersoPanel } from "@/components/cv/CvPersoPanel";
import {
  CV_CONTACT,
  CV_DEV_SKILLS,
  CV_EDUCATION,
  CV_EXPERIENCES,
  CV_FRAMEWORKS,
  CV_IDENTITY,
  CV_INTERESTS,
  CV_LANGUAGES,
  CV_NETWORK_SKILLS,
  CV_PROGRAMMING,
  type CvCompanyPart,
  type CvVideoKey,
} from "@/data/cv";

/**
 * Section « Moi » — bascule CV personnel (présentation éditoriale) / CV métier (reproduction papier).
 */

type CvId = "perso" | "metier";

const CV_TABS: readonly { id: CvId; label: string }[] = [
  { id: "perso", label: "CV personnel" },
  { id: "metier", label: "CV métier" },
];

const MAX_TILT_DEG = 7;
const EASE_OUT = [0.22, 0.61, 0.36, 1] as const;

interface MePanelProps {
  onViewProjects?: () => void;
}

interface VideoHoverHandlers {
  activeVideoKey: CvVideoKey | null;
  onVideoEnter: (key: CvVideoKey) => void;
}

function CvCompanyLine({
  parts,
  fallback,
  activeVideoKey,
  onVideoEnter,
}: {
  parts?: readonly CvCompanyPart[];
  fallback: string;
  activeVideoKey: CvVideoKey | null;
  onVideoEnter: (key: CvVideoKey) => void;
}) {
  if (!parts?.length) {
    return <span>{fallback}</span>;
  }

  return (
    <>
      {parts.map((part, index) => {
        if (!part.videoKey) {
          return <span key={`${part.text}-${index}`}>{part.text}</span>;
        }
        const isActive = activeVideoKey === part.videoKey;
        return (
          <span
            key={`${part.text}-${index}`}
            className={`cv-video-trigger${isActive ? " cv-video-trigger--active" : ""}`}
            role="button"
            tabIndex={0}
            onMouseEnter={() => onVideoEnter(part.videoKey!)}
            onFocus={() => onVideoEnter(part.videoKey!)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onVideoEnter(part.videoKey!);
              }
            }}
          >
            {part.text}
          </span>
        );
      })}
    </>
  );
}

function CvSidebar({ activeVideoKey, onVideoEnter }: VideoHoverHandlers) {
  return (
    <aside className="cv-sidebar" aria-label="Informations personnelles">
      <div className="cv-sidebar-deco" aria-hidden="true" />
      <p className="cv-sidebar-name">{CV_IDENTITY.name}</p>

      <section className="cv-sidebar-block cv-sidebar-coords">
        <h2 className="cv-sidebar-title">Coordonnées</h2>
        <ul className="cv-sidebar-list">
          <li>
            <a href={`tel:${CV_CONTACT.phone.replace(/\s/g, "")}`}>{CV_CONTACT.phone}</a>
          </li>
          <li>
            <a href={`mailto:${CV_CONTACT.email}`}>{CV_CONTACT.email}</a>
          </li>
          <li>{CV_CONTACT.address}</li>
        </ul>
      </section>

      <section className="cv-sidebar-block">
        <h2 className="cv-sidebar-title">Formation</h2>
        <ul className="cv-sidebar-edu">
          {CV_EDUCATION.map((edu) => (
            <li key={edu.diploma}>
              <strong>
                <CvCompanyLine
                  parts={edu.diplomaParts}
                  fallback={edu.diploma}
                  activeVideoKey={activeVideoKey}
                  onVideoEnter={onVideoEnter}
                />
              </strong>
              <span>{edu.school}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="cv-sidebar-block">
        <h2 className="cv-sidebar-title">Langues</h2>
        <ul className="cv-sidebar-list">
          {CV_LANGUAGES.map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
      </section>

      <section className="cv-sidebar-block">
        <h2 className="cv-sidebar-title">Langages</h2>
        <ul className="cv-sidebar-list cv-sidebar-list--bullets">
          {CV_PROGRAMMING.map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
      </section>

      <section className="cv-sidebar-block">
        <h2 className="cv-sidebar-title">Frameworks</h2>
        <ul className="cv-sidebar-list cv-sidebar-list--bullets">
          {CV_FRAMEWORKS.map((fw) => (
            <li key={fw}>{fw}</li>
          ))}
        </ul>
      </section>

      <section className="cv-sidebar-block">
        <h2 className="cv-sidebar-title">Centres d&apos;intérêt</h2>
        <ul className="cv-sidebar-list cv-sidebar-list--bullets">
          {CV_INTERESTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function CvPortfolioBlock() {
  return (
    <section className="cv-main-section">
      <h2 className="cv-main-title cv-main-title--accent">Portefolio</h2>
      <p className="cv-portfolio">
        <a href={CV_IDENTITY.portfolioUrl} target="_blank" rel="noopener noreferrer">
          {CV_IDENTITY.portfolioLabel}
        </a>
      </p>
      <ul className="cv-main-bullets cv-portfolio-skills">
        {CV_DEV_SKILLS.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

function CvSkillsGrid() {
  return (
    <div className="cv-skills-grid">
      <section className="cv-skills-col" aria-label="Compétences réseau">
        <h3 className="cv-main-title">Réseaux</h3>
        <ul className="cv-main-bullets">
          {CV_NETWORK_SKILLS.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>
      <section className="cv-skills-col" aria-label="Compétences développement">
        <h3 className="cv-main-title">Dev</h3>
        <ul className="cv-main-bullets">
          {CV_DEV_SKILLS.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CvMetierMain({ activeVideoKey, onVideoEnter }: VideoHoverHandlers) {
  return (
    <div className="cv-main">
      <section className="cv-main-section">
        <h2 className="cv-main-title cv-main-title--accent">Expérience professionnelle</h2>
        <ol className="cv-xp-real">
          {CV_EXPERIENCES.map((xp) => (
            <li key={`${xp.role}-${xp.company}`} className="cv-xp-real-item">
              <div className="cv-xp-real-head">
                <div>
                  <h3 className="cv-xp-real-role">{xp.role}</h3>
                  <p className="cv-xp-real-company">
                    <CvCompanyLine
                      parts={xp.companyParts}
                      fallback={xp.company}
                      activeVideoKey={activeVideoKey}
                      onVideoEnter={onVideoEnter}
                    />
                  </p>
                </div>
                <span className="cv-xp-real-period">{xp.period}</span>
              </div>
              {xp.summary ? <p className="cv-xp-real-summary">{xp.summary}</p> : null}
              {xp.bullets.length > 0 ? (
                <ul className="cv-main-bullets">
                  {xp.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <CvPortfolioBlock />

      <CvSkillsGrid />
    </div>
  );
}

export function MePanel({ onViewProjects }: MePanelProps = {}) {
  const reduceMotion = useMediaQueryMatch("(prefers-reduced-motion: reduce)");
  const isCoarsePointer = useMediaQueryMatch("(pointer: coarse)");
  const tiltDisabled = reduceMotion || isCoarsePointer;

  const tiltRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const [activeCv, setActiveCv] = useState<CvId>("metier");
  const [direction, setDirection] = useState(1);
  const [activeVideoKey, setActiveVideoKey] = useState<CvVideoKey | null>(null);

  const onVideoEnter = useCallback((key: CvVideoKey) => {
    setActiveVideoKey(key);
  }, []);

  const switchCv = useCallback((id: CvId) => {
    setActiveCv((current) => {
      if (current === id) return current;
      const currentIndex = CV_TABS.findIndex((t) => t.id === current);
      const nextIndex = CV_TABS.findIndex((t) => t.id === id);
      setDirection(nextIndex > currentIndex ? 1 : -1);
      if (id === "perso") {
        setActiveVideoKey(null);
      }
      return id;
    });
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (tiltDisabled) return;
      const container = tiltRef.current;
      const sheet = sheetRef.current;
      if (!container || !sheet) return;

      const rect = container.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const clampedX = Math.min(Math.max(px, 0), 1);
      const clampedY = Math.min(Math.max(py, 0), 1);

      sheet.style.setProperty("--cv-ry", `${((clampedX - 0.5) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
      sheet.style.setProperty("--cv-rx", `${((0.5 - clampedY) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
      sheet.style.setProperty("--cv-mx", `${(clampedX * 100).toFixed(1)}%`);
      sheet.style.setProperty("--cv-my", `${(clampedY * 100).toFixed(1)}%`);
    },
    [tiltDisabled]
  );

  const resetTilt = useCallback(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    sheet.style.setProperty("--cv-ry", "0deg");
    sheet.style.setProperty("--cv-rx", "0deg");
    sheet.style.setProperty("--cv-mx", "50%");
    sheet.style.setProperty("--cv-my", "30%");
  }, []);

  const slide = reduceMotion ? 0 : 36;

  const handleViewProjects = onViewProjects ?? (() => {
    window.location.assign("/projects");
  });

  return (
    <div className="cv-stage">
      <div className="cv-switcher" role="tablist" aria-label="Choisir un CV">
        {CV_TABS.map((tab) => {
          const isActive = activeCv === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`cv-switch-btn${isActive ? " cv-switch-btn--active" : ""}`}
              onClick={() => switchCv(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="cv-stage-main">
        <div
          className={`cv-tilt${tiltDisabled ? " cv-tilt--static" : ""}`}
          ref={tiltRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
        >
          <article
            className={`cv-sheet${activeCv === "metier" ? " cv-sheet--classic" : " cv-sheet--persona"}`}
            ref={sheetRef}
            aria-label={`CV de ${CV_IDENTITY.name} — ${activeCv === "perso" ? "personnel" : "métier"}`}
          >
            <div className="cv-glare" aria-hidden="true" />

            <div className="cv-swap">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={activeCv}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * slide }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -slide }}
                  transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE_OUT }}
                >
                  {activeCv === "perso" ? (
                    <CvPersoPanel />
                  ) : (
                    <div className="cv-layout">
                      <CvSidebar activeVideoKey={activeVideoKey} onVideoEnter={onVideoEnter} />
                      <CvMetierMain activeVideoKey={activeVideoKey} onVideoEnter={onVideoEnter} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </article>
        </div>

        <aside className="cv-stage-aside">
          <HeroActions
            variant="panel"
            reduceMotion={reduceMotion}
            onViewProjects={handleViewProjects}
          />
          {activeCv === "metier" ? <CvVideoPlayer videoKey={activeVideoKey} /> : null}
        </aside>
      </div>
    </div>
  );
}
