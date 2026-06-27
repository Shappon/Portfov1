"use client";

import { useSpring, useSprings, animated } from "@react-spring/web";
import type { Project } from "@/types/project";
import { categoryLabel } from "@/types/project";

interface ProjectCaseStudyProps {
  project: Project;
  onBack: () => void;
  reduceMotion: boolean;
}

/**
 * Case study orientée recruteur.
 * Structure : Hero (contexte/preuve), Problème, Solution, GitHub,
 * Architecture, Challenges, Décisions, Impact, Améliorations futures.
 * Les sections optionnelles vides (challenges, décisions, impact, futur)
 * sont masquées plutôt que d'afficher "Non renseigné".
 */
export function ProjectCaseStudy({ project, onBack, reduceMotion }: ProjectCaseStudyProps) {
  const githubHref = project.githubUrl?.trim() || undefined;
  const problemCtx = project.problemContext;
  const hasProblemDetail =
    problemCtx && (problemCtx.contexte || problemCtx.situationInitiale || problemCtx.utilisateurCible);
  const solutionFeatures = project.solutionFeatures?.length ? project.solutionFeatures : null;
  const architecture = project.architecture;
  const challenges = project.challenges?.length ? project.challenges : null;
  const decisions = project.technicalDecisions?.length ? project.technicalDecisions : null;
  const impact = project.impact?.length ? project.impact : null;
  const future = project.futureImprovements?.length ? project.futureImprovements : null;

  const backSpring = useSpring({
    from: { opacity: 0, x: -8 },
    to: { opacity: 1, x: 0 },
    config: { duration: reduceMotion ? 0 : 200 },
  });
  const heroSpring = useSpring({
    from: { opacity: 0, y: 16 },
    to: { opacity: 1, y: 0 },
    config: { duration: reduceMotion ? 0 : 300 },
    delay: reduceMotion ? 0 : 60,
  });
  const sectionCount = 8;
  const sectionDelays = Array.from({ length: sectionCount }, (_, i) => 100 + (i + 1) * 70);
  const [sectionSprings] = useSprings(sectionCount, (i) => ({
    from: { opacity: 0, y: 12 },
    to: { opacity: 1, y: 0 },
    delay: reduceMotion ? 0 : sectionDelays[i],
    config: { duration: reduceMotion ? 0 : 280 },
  }));

  const stackItems = project.stackBreakdown
    ? [
        ...(project.stackBreakdown.frontend?.length ? [{ label: "Frontend", techs: project.stackBreakdown.frontend }] : []),
        ...(project.stackBreakdown.backend?.length ? [{ label: "Backend", techs: project.stackBreakdown.backend }] : []),
        ...(project.stackBreakdown.database?.length ? [{ label: "Database", techs: project.stackBreakdown.database }] : []),
        ...(project.stackBreakdown.orm?.length ? [{ label: "ORM", techs: project.stackBreakdown.orm }] : []),
        ...(project.stackBreakdown.auth?.length ? [{ label: "Auth", techs: project.stackBreakdown.auth }] : []),
        ...(project.stackBreakdown.hosting?.length ? [{ label: "Hosting", techs: project.stackBreakdown.hosting }] : []),
      ]
    : null;

  return (
    <div className={`project-case-study project-case-study--${project.category} d-flex flex-column h-100 overflow-auto`}>
      <animated.div
        style={{ opacity: backSpring.opacity, transform: backSpring.x.to((x) => `translateX(${x}px)`) }}
        className="project-case-study-nav"
      >
        <button
          type="button"
          className="project-case-study-back btn btn-link p-0 text-decoration-none"
          onClick={onBack}
          aria-label="Retour à la liste des projets"
        >
          ← Retour aux projets
        </button>
      </animated.div>

      {/* SECTION 1 — Présentation rapide (Hero) : zone Vidéo démo à gauche + infos à droite */}
      <animated.section
        style={{ opacity: heroSpring.opacity, transform: heroSpring.y.to((y) => `translateY(${y}px)`) }}
        className={`project-case-study-hero project-case-study-hero--${project.category}`}
      >
        <div className="project-case-study-hero-layout">
          <div className="project-case-study-hero-demo-zone">
            {project.demoVideo || project.demoUrl || project.demoLiveUrl ? (
              <a
                href={project.demoVideo ?? project.demoUrl ?? project.demoLiveUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="project-case-study-video-demo-btn"
                aria-label="Voir la vidéo démo du projet"
              >
                <span className="project-case-study-video-demo-icon" aria-hidden>▶</span>
                <span className="project-case-study-video-demo-label">Vidéo démo</span>
              </a>
            ) : (
              <div className="project-case-study-video-demo-btn project-case-study-video-demo-btn--disabled" aria-disabled>
                <span className="project-case-study-video-demo-icon" aria-hidden>▶</span>
                <span className="project-case-study-video-demo-label">Vidéo démo</span>
                <span className="project-case-study-video-demo-sublabel">Non disponible</span>
              </div>
            )}
          </div>
          <div className="project-case-study-hero-inner">
            <div className="project-case-study-hero-badges d-flex flex-wrap align-items-center gap-2">
              <span className={`projects-panel-cat-badge projects-panel-cat-badge--${project.category} project-case-study-hero-cat`}>
                {categoryLabel(project.category)}
              </span>
              {project.level && <span className="projects-panel-card-level">{project.level}</span>}
              {project.status && <span className="projects-panel-card-status">{project.status}</span>}
              {project.proofType && (
                <span className="projects-panel-card-status projects-panel-card-status--proof">
                  Preuve : {project.proofType}
                </span>
              )}
            </div>
            {project.appType && <p className="project-case-study-hero-type">{project.appType}</p>}
            <h1 className="project-case-study-hero-title">{project.title}</h1>
            {project.highlight && (
              <p className="project-case-study-hero-highlight">{project.highlight}</p>
            )}
            <p className="project-case-study-hero-desc">{project.description}</p>
            <div className="project-case-study-hero-stack">
              {stackItems ? (
                <div className="project-case-study-stack-grid">
                  {stackItems.map(({ label, techs }) => (
                    <div key={label} className="project-case-study-stack-row">
                      <span className="project-case-study-stack-label">{label}</span>
                      <div className="d-flex flex-wrap gap-1">
                        {techs.map((t) => (
                          <span key={t} className="project-case-study-stack-chip">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {project.stack.map((t) => (
                    <span key={t} className="project-case-study-stack-chip">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </animated.section>

      {/* SECTION 2 — Le problème */}
      <animated.section
        style={{ opacity: sectionSprings[0].opacity, transform: sectionSprings[0].y.to((y) => `translateY(${y}px)`) }}
        className="project-case-study-block"
      >
        <h2 className="project-case-study-block-title">Le problème</h2>
        <div className="project-case-study-card">
          {hasProblemDetail ? (
            <div className="project-case-study-problem-grid">
              {problemCtx!.contexte && (
                <div>
                  <span className="project-case-study-mini-label">Contexte</span>
                  <p className="project-case-study-card-text mb-0">{problemCtx.contexte}</p>
                </div>
              )}
              {problemCtx!.situationInitiale && (
                <div>
                  <span className="project-case-study-mini-label">Situation initiale</span>
                  <p className="project-case-study-card-text mb-0">{problemCtx.situationInitiale}</p>
                </div>
              )}
              {problemCtx!.utilisateurCible && (
                <div>
                  <span className="project-case-study-mini-label">Utilisateur cible</span>
                  <p className="project-case-study-card-text mb-0">{problemCtx.utilisateurCible}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="project-case-study-card-text mb-0">{project.problem}</p>
          )}
        </div>
      </animated.section>

      {/* SECTION 3 — La solution */}
      <animated.section
        style={{ opacity: sectionSprings[1].opacity, transform: sectionSprings[1].y.to((y) => `translateY(${y}px)`) }}
        className="project-case-study-block"
      >
        <h2 className="project-case-study-block-title">La solution</h2>
        {solutionFeatures ? (
          <div className="project-case-study-features">
            {solutionFeatures.map((f, i) => (
              <div key={i} className="project-case-study-feature-card">
                <span className="project-case-study-feature-dot" />
                <span className="project-case-study-feature-text">{f}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="project-case-study-card">
            <p className="project-case-study-card-text mb-0">{project.solution}</p>
          </div>
        )}
      </animated.section>

      {/* SECTION 4 — Lien GitHub (démo = bouton Vidéo démo dans la Hero) */}
      <animated.section
        style={{ opacity: sectionSprings[2].opacity, transform: sectionSprings[2].y.to((y) => `translateY(${y}px)`) }}
        className="project-case-study-block"
      >
        <div className="project-case-study-demo">
          {githubHref ? (
            <a
              href={githubHref}
              target="_blank"
              rel="noopener noreferrer"
              className="project-case-study-btn project-case-study-btn--outline"
            >
              Voir sur GitHub
            </a>
          ) : (
            <p className="text-muted small mb-0" role="note">
              Dépôt GitHub non public pour ce projet.
            </p>
          )}
        </div>
      </animated.section>

      {/* SECTION 5 — Architecture technique */}
      <animated.section
        style={{ opacity: sectionSprings[3].opacity, transform: sectionSprings[3].y.to((y) => `translateY(${y}px)`) }}
        className="project-case-study-block"
      >
        <h2 className="project-case-study-block-title">Architecture technique</h2>
        {architecture ? (
          <div className="project-case-study-arch-grid">
            {architecture.frontend && (
              <div className="project-case-study-arch-card">
                <span className="project-case-study-arch-label">Frontend</span>
                <p className="project-case-study-arch-text mb-0">{architecture.frontend}</p>
              </div>
            )}
            {architecture.backend && (
              <div className="project-case-study-arch-card">
                <span className="project-case-study-arch-label">Backend</span>
                <p className="project-case-study-arch-text mb-0">{architecture.backend}</p>
              </div>
            )}
            {architecture.database && (
              <div className="project-case-study-arch-card">
                <span className="project-case-study-arch-label">Database</span>
                <p className="project-case-study-arch-text mb-0">{architecture.database}</p>
              </div>
            )}
            {architecture.auth && (
              <div className="project-case-study-arch-card">
                <span className="project-case-study-arch-label">Auth</span>
                <p className="project-case-study-arch-text mb-0">{architecture.auth}</p>
              </div>
            )}
            {architecture.hosting && (
              <div className="project-case-study-arch-card">
                <span className="project-case-study-arch-label">Hosting</span>
                <p className="project-case-study-arch-text mb-0">{architecture.hosting}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <span key={t} className="project-case-study-stack-badge">{t}</span>
            ))}
          </div>
        )}
      </animated.section>

      {/* SECTION 6 — Challenges techniques (masqué si vide) */}
      {challenges && (
        <animated.section
          style={{ opacity: sectionSprings[4].opacity, transform: sectionSprings[4].y.to((y) => `translateY(${y}px)`) }}
          className="project-case-study-block"
        >
          <h2 className="project-case-study-block-title">Challenges techniques</h2>
          <div className="project-case-study-challenges">
            {challenges.map((c, i) => (
              <div key={i} className="project-case-study-challenge-card">
                <span className="project-case-study-challenge-num">{i + 1}</span>
                <p className="project-case-study-card-text mb-0">{c}</p>
              </div>
            ))}
          </div>
        </animated.section>
      )}

      {/* SECTION 7 — Décisions d'ingénierie (masqué si vide) */}
      {decisions && (
        <animated.section
          style={{ opacity: sectionSprings[5].opacity, transform: sectionSprings[5].y.to((y) => `translateY(${y}px)`) }}
          className="project-case-study-block"
        >
          <h2 className="project-case-study-block-title">Décisions techniques</h2>
          <ul className="project-case-study-decisions">
            {decisions.map((d, i) => (
              <li key={i} className="project-case-study-decision-item">{d}</li>
            ))}
          </ul>
        </animated.section>
      )}

      {/* SECTION 8 — Impact (masqué si vide) */}
      {impact && (
        <animated.section
          style={{ opacity: sectionSprings[6].opacity, transform: sectionSprings[6].y.to((y) => `translateY(${y}px)`) }}
          className="project-case-study-block"
        >
          <h2 className="project-case-study-block-title">Impact</h2>
          <div className="project-case-study-impact">
            {impact.map((item, i) => (
              <div key={i} className="project-case-study-impact-item">
                <span className="project-case-study-impact-icon">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </animated.section>
      )}

      {/* SECTION 9 — Améliorations futures (masqué si vide) */}
      {future && (
        <animated.section
          style={{ opacity: sectionSprings[7].opacity, transform: sectionSprings[7].y.to((y) => `translateY(${y}px)`) }}
          className="project-case-study-block"
        >
          <h2 className="project-case-study-block-title">Améliorations futures</h2>
          <div className="d-flex flex-wrap gap-2">
            {future.map((f, i) => (
              <span key={i} className="project-case-study-future-chip">{f}</span>
            ))}
          </div>
        </animated.section>
      )}
    </div>
  );
}
