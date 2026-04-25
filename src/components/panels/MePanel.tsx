"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const HERO = {
  name: "Shuan HUYNH",
  roleLine1: "Développeur full-stack autodidacte",
  roleLine2: "SaaS, outils métiers & IA — pédagogie en bonus",
};

const BLOCS = [
  {
    id: "qui",
    title: "Qui je suis",
    detail:
      "Développeur full-stack autodidacte, j’apprends surtout en construisant et en expérimentant. J’aime transformer une idée floue en produit utilisable : cadrage, UX simple, architecture claire, itérations rapides.",
  },
  {
    id: "construis",
    title: "Ce que je construis",
    detail:
      "Des apps web (SaaS), des outils métiers et des expérimentations IA. Je vise des produits qui vont à l’essentiel : interfaces propres, parcours fluides, performance, et robustesse. Quand le contexte s’y prête, j’y intègre aussi de la clarté, du guidage et du feedback côté usage, mais l’horizon reste chaque fois un problème concret, mesurable et livrable.",
  },
  {
    id: "methode",
    title: "Ma méthode",
    detailSteps: [
      "Clarifier le besoin (objectif, contraintes, utilisateurs, succès mesurable).",
      "Structurer : découper, nommer, rendre le chemin visible (MVP → itérations).",
      "Construire un premier jet simple et testable, puis durcir (qualité, edge cases).",
      "Soigner l’expérience : messages, erreurs, états vides, accessibilité, rythme.",
      "Repartir des retours concrets (utilisateurs, collègues, clients) et ajuster.",
    ],
  },
  {
    id: "vision",
    title: "Ma vision",
    detail:
      "J’ai surtout envie d’outils qui aident pour de vrai, sans surprendre ni surcharger : simples, fiables, utiles au quotidien. La clarté me semble le bon fil — dans l’interface, dans le code, dans ce qu’on documente — et l’IA, seulement là où elle sert vraiment (accompagner, relire, structurer), en restant honnête sur ce qu’elle ne sait pas.",
  },
] as const;

type BlocId = (typeof BLOCS)[number]["id"];
type Bloc = (typeof BLOCS)[number];

const fadeTransition = { duration: 0.25, ease: [0.32, 0.72, 0, 1] as const };

function DetailContent({ bloc }: { bloc: Bloc }) {
  if ("detail" in bloc && bloc.detail) {
    const paragraphs = bloc.detail.split(/\n\n+/);
    return (
      <>
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </>
    );
  }
  if ("detailSteps" in bloc && bloc.detailSteps) {
    return (
      <ul className="me-panel-detail-steps">
        {bloc.detailSteps.map((title, i) => (
          <li key={i}>{title}</li>
        ))}
      </ul>
    );
  }
  return null;
}

export function MePanel() {
  const [activeId, setActiveId] = useState<BlocId | null>(null);
  const activeBloc = activeId
    ? (BLOCS.find((b) => b.id === activeId) ?? null)
    : null;

  const selectBloc = (id: BlocId) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="me-panel-root">
      <header className="me-panel-hero">
        <div className="me-panel-hero-inner">
          <h1 className="me-panel-hero-name">{HERO.name}</h1>
          <p className="me-panel-hero-role">
            <span className="me-panel-hero-role-line me-panel-hero-role-line--primary">
              {HERO.roleLine1}
            </span>
            <span className="me-panel-hero-role-line me-panel-hero-role-line--secondary">
              {HERO.roleLine2}
            </span>
          </p>
        </div>
      </header>

      <main className="me-panel-main" aria-label="Présentation">
        {/* Bloc photo + boutons : column desktop, row mobile (photo gauche / boutons droite) */}
        <section className="me-panel-actions" aria-label="Photo et thèmes">
          <div className="me-panel-actions-photo-wrap">
            <Image
              src="/me.png"
              alt="Shuan Huynh"
              className="me-panel-hero-photo"
              width={260}
              height={380}
              priority
              sizes="(max-width: 576px) 140px, (max-width: 768px) 200px, 260px"
            />
          </div>

          <div className="me-panel-nav-blocs" role="tablist" aria-label="Thèmes de présentation">
            {BLOCS.map((bloc) => {
              const isActive = activeId === bloc.id;
              return (
                <button
                  key={bloc.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="me-panel-detail-zone"
                  id={`me-panel-tab-${bloc.id}`}
                  className={`me-panel-nav-card ${isActive ? "me-panel-nav-card--active" : ""}`}
                  onClick={() => selectBloc(bloc.id)}
                >
                  <span className="me-panel-nav-card-title">{bloc.title}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          id="me-panel-detail-zone"
          className="me-panel-detail-zone"
          role="tabpanel"
          aria-labelledby={activeId ? `me-panel-tab-${activeId}` : undefined}
        >
          <AnimatePresence mode="wait">
            {activeBloc ? (
              <motion.div
                key={activeBloc.id}
                className="me-panel-detail-content"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={fadeTransition}
              >
                <DetailContent bloc={activeBloc} />
              </motion.div>
            ) : (
              <motion.p
                key="placeholder"
                className="me-panel-detail-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Sélectionnez un thème pour afficher le contenu.
              </motion.p>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
