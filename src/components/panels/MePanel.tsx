"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const HERO = {
  name: "Shuan HUYNH",
  role: "Développeur full-stack autodidacte | SaaS, outils métiers & IA (pédagogie en bonus)",
};

const BLOCS = [
  {
    id: "qui",
    title: "Qui je suis",
    detail:
      "Développeur full-stack autodidacte, j’apprends surtout en construisant et en expérimentant. J’aime transformer une idée floue en produit utilisable : cadrage, UX simple, architecture claire, itérations rapides.\n\nMon passé autour de l’enseignement m’a donné un vrai avantage : expliquer, vulgariser, écrire de la doc, et concevoir des outils qui mettent l’utilisateur en confiance. La pédagogie est un atout, pas une étiquette : mon cœur reste le dev et la création de produits.",
  },
  {
    id: "construis",
    title: "Ce que je construis",
    detail:
      "Des apps web (SaaS), des outils métiers et des expérimentations IA. Je vise des produits qui vont à l’essentiel : interfaces propres, parcours fluides, performance, et robustesse.\n\nQuand le contexte s’y prête, j’applique aussi un prisme “apprentissage” (clarté, guidage, feedback). Mais je construis avant tout pour résoudre un problème réel, mesurable, et livrable.",
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
      "Je veux un numérique qui aide sans intimider : des produits simples, fiables, et utiles en situation réelle.\n\nMon fil conducteur, c’est la clarté : dans l’interface (UX), dans le code (architecture), dans la communication (doc). L’IA m’intéresse surtout quand elle augmente l’utilisateur (assistants, relecture, extraction), en restant transparente sur ses limites.",
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
          <p className="me-panel-hero-role">{HERO.role}</p>
          <div className="me-panel-hero-photo-wrap">
            <Image
              src="/me.png"
              alt="Shuan Huynh"
              className="me-panel-hero-photo"
              width={260}
              height={380}
              priority
              sizes="(max-width: 768px) 200px, 260px"
            />
          </div>
        </div>
      </header>

      <main className="me-panel-main" aria-label="Présentation">
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
