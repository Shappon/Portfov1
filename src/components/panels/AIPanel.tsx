"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ——— Roadmap : 6 étapes de ma relation avec l'IA ———

const HERO = {
  title: "IA",
  subtitle: "Récit et repères : comment j’aborde l’IA — utile en classe, pas seulement “tech”.",
};

const ROADMAP_STEPS = [
  {
    id: "declic",
    order: 1,
    shortLabel: "Déclic",
    label: "Mon déclic pour l’IA",
  },
  {
    id: "comprendre",
    order: 2,
    shortLabel: "Comprendre",
    label: "Ce que j’ai commencé à comprendre",
  },
  {
    id: "fonctionnement",
    order: 3,
    shortLabel: "Fonctionnement",
    label: "Ma découverte de son fonctionnement",
  },
  {
    id: "inspire",
    order: 4,
    shortLabel: "Projets",
    label: "Ce que cela m’inspire",
  },
  {
    id: "outils",
    order: 5,
    shortLabel: "Outils",
    label: "Outils et ressources qui m’aident",
  },
  {
    id: "ensuite",
    order: 6,
    shortLabel: "Suite",
    label: "Ce que je veux explorer ensuite",
  },
] as const;

export type RoadmapStepId = (typeof ROADMAP_STEPS)[number]["id"];

// ——— Contenu par étape (existant + nouveau, à personnaliser) ———

const STEP_DECLIC = {
  intro:
    "Au début, surtout du bruit : copilotes, “révolution”. Ce qui m’a retenu, c’est l’idée d’aider à formuler, structurer, débrouillarder — à condition de laisser la place au raisonnement (et de travailler la relecture).",
  personal:
    "Avec un pied dans le concret, je la vois comme un plus pour accompagner : indices, brouillons, reformulations. L’enjeu, en contexte pédagogique, c’est de savoir cadrer : ce que c’est, ce que ce n’est pas, quand c’est fiable (ou non).",
};

const STEP_COMPRENDRE = {
  intro: "Idées stables pour en parler clairement (NSI, SNT) :",
  points: [
    {
      title: "Modèles & APIs",
      text: "Gros modèles accessibles par des interfaces : on envoie un texte, on reçoit des propositions — ce n’est pas de la connaissance, c’est de la génération statistique, avec des limites.",
    },
    {
      title: "Prompts & contexte",
      text: "Bien cadrer la consigne et le contexte, c’est le cœur du sujet. En classe, c’est l’équivalent de : savoir expliciter ce qu’on cherche (et vérifier).",
    },
    {
      title: "Outils intégrés",
      text: "Utile quand c’est scénarisé (travail, fiche) avec règles, traçabilité et relecture — pas en magie sans cadre.",
    },
    {
      title: "Automatisation légère",
      text: "Résumer, classer, trier : gagner du temps sur le répétitif pour s’intéresser au vrai travail — et se poser des questions d’éthique et d’évaluation.",
    },
  ],
};

const STEP_FONCTIONNEMENT = {
  intro: "Briques simples pour expliquer sans se perdre :",
  blocks: [
    {
      title: "Modèle",
      text: "Il prédit une suite de texte plausible à partir d’un entraînement, pas un “savoir” sûr — d’où des erreurs possibles.",
    },
    {
      title: "Contexte & prompt",
      text: "Le message qu’on envoie cadrer la tâche : plus c’est explicite, plus on a de chances d’avoir un résultat exploitable (comme une bonne consigne).",
    },
    {
      title: "Données & RAG",
      text: "Fournir des documents pour s’en inspirer (RAG) : piste riche en classe pour citer, vérifier, parler d’info et de sources.",
    },
    {
      title: "Limites",
      text: "Hallucinations, biais, coût, confidentialité : c’est l’endroit idéal pour parler littératie numérique, pas de fantasmes sur l’infaillibilité.",
    },
  ],
};

const PROJETS_IDEES = [
  {
    id: "1",
    title: "Aide en contexte",
    description: "Dans un espace de travail, proposer des indices et reformulations calés sur le niveau — aider à comprendre, pas rendre l’exercice tout fait.",
    tags: ["RAG", "API LLM", "UX"],
  },
  {
    id: "2",
    title: "Synthèses & restitutions",
    description: "A partir d’info structurée, des plans ou brouillons avec contraintes (zones à compléter, relecture obligatoire) pour garder l’effort d’écriture.",
    tags: ["LLM", "Templates", "Export"],
  },
  {
    id: "3",
    title: "Tri de ressources",
    description: "Classer ou taguer documents et fiches pour aider l’élève (ou la classe) à s’y retrouver sans noyer sous le contenu.",
    tags: ["NLP", "Embeddings", "Pipeline"],
  },
  {
    id: "4",
    title: "Assistant “mémoire de tâche”",
    description: "Se souvenir de l’enoncé, des règles, du niveau, pour rappeler la méthode et inciter à relire le raisonnement plutôt qu’à tricher.",
    tags: ["Conversation", "Mémoire", "RAG"],
  },
];

const OUTILS = [
  { name: "OpenAI API", desc: "Prototyper et montrer l’idée d’une requête à un modèle.", url: "https://platform.openai.com" },
  { name: "Vercel AI SDK", desc: "Interfaces d’exemple (streaming, chat) pour illustrer l’interactivité.", url: "https://sdk.vercel.ai" },
  { name: "LangChain / LangGraph", desc: "Chaînes RAG / agents : expliquer “plusieurs étapes” plutôt qu’un clic unique.", url: "https://langchain.com" },
  { name: "Hugging Face", desc: "Modèles ouverts et expérimentation sans tout centraliser.", url: "https://huggingface.co" },
  { name: "Anthropic Claude", desc: "Grands contextes = attacher un texte de référence clairement à la tâche.", url: "https://anthropic.com" },
];

const RESSOURCES = [
  { label: "Documentation OpenAI", url: "https://platform.openai.com/docs", type: "Docs" },
  { label: "Fast.ai – Practical Deep Learning", url: "https://www.fast.ai", type: "Cours" },
  { label: "Andrew Ng – Machine Learning (Coursera)", url: "https://www.coursera.org/learn/machine-learning", type: "Cours" },
  { label: "Anthropic – Documentation Claude", url: "https://docs.anthropic.com", type: "Docs" },
  { label: "Hugging Face – NLP Course", url: "https://huggingface.co/learn/nlp-course", type: "Cours" },
  { label: "Prompt Engineering Guide", url: "https://www.promptingguide.ai", type: "Ressource" },
];

const STEP_ENSUITE = {
  intro: "Pistes (enseignement + pratique) :",
  directions: [
    { title: "Agents raisonnables", text: "Chaînes d’étapes vraiment utiles, pas de démos creuses — et savoir les raconter simplement." },
    { title: "RAG ancré", text: "Réponses appuyées sur un corpus choisi : info, vérification, biais, travail sur la source (NSI / SNT)." },
    { title: "Automatisation ciblée", text: "Gagner du temps sur l’administratif sans déléguer ce qui doit rester un travail d’écriture ou d’évaluation humaine." },
    { title: "IA dans le parcours", text: "Cadrer consigne, usage et attentes — pas coller l’IA à côté du cours par défaut." },
    { title: "UX légère", text: "Soutenir sans encombrer l’écran, surtout pour un public moins sûr de soi en numérique." },
  ],
};

function useReducedMotion(): boolean {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

// ——— Composants de contenu par étape ———

function StepDeclic() {
  return (
    <div className="ai-roadmap-detail">
      <p className="ai-roadmap-lead">{STEP_DECLIC.intro}</p>
      <div className="ai-roadmap-card ai-roadmap-card--highlight">
        <p className="ai-roadmap-body-text">{STEP_DECLIC.personal}</p>
      </div>
    </div>
  );
}

function StepComprendre() {
  return (
    <div className="ai-roadmap-detail">
      <p className="ai-roadmap-intro">{STEP_COMPRENDRE.intro}</p>
      <div className="ai-roadmap-blocks">
        {STEP_COMPRENDRE.points.map((p) => (
          <div key={p.title} className="ai-roadmap-block">
            <h4 className="ai-roadmap-block-title">{p.title}</h4>
            <p className="ai-roadmap-block-text">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepFonctionnement() {
  return (
    <div className="ai-roadmap-detail">
      <p className="ai-roadmap-intro">{STEP_FONCTIONNEMENT.intro}</p>
      <div className="ai-roadmap-blocks ai-roadmap-blocks--numbered">
        {STEP_FONCTIONNEMENT.blocks.map((b) => (
          <div key={b.title} className="ai-roadmap-block">
            <span className="ai-roadmap-block-badge">{b.title}</span>
            <p className="ai-roadmap-block-text">{b.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepInspire() {
  return (
    <div className="ai-roadmap-detail">
      <p className="ai-roadmap-intro">
        Idées où l’IA sert l’accompagnement, pas le remplacement — compréhension, brouillons, remise en forme, avec relecture humaine.
      </p>
      <div className="ai-roadmap-projets">
        {PROJETS_IDEES.map((projet) => (
          <div key={projet.id} className="ai-roadmap-projet">
            <h4 className="ai-roadmap-projet-title">{projet.title}</h4>
            <p className="ai-roadmap-projet-desc">{projet.description}</p>
            <div className="ai-roadmap-projet-tags">
              {projet.tags.map((t) => (
                <span key={t} className="ai-roadmap-tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepOutils() {
  return (
    <div className="ai-roadmap-detail">
      <p className="ai-roadmap-intro">
        Ressources pour m’y retrouver et, si besoin, pour préparer une démonstration claire en salle.
      </p>
      <div className="ai-roadmap-step-five-grid">
        <div className="ai-roadmap-outils-section">
          <h4 className="ai-roadmap-subtitle">Outils</h4>
          <div className="ai-roadmap-outils-list">
            {OUTILS.map((o) => (
              <a key={o.name} href={o.url} target="_blank" rel="noopener noreferrer" className="ai-roadmap-outil">
                <span className="ai-roadmap-outil-name">{o.name}</span>
                <span className="ai-roadmap-outil-desc">{o.desc}</span>
                <span className="ai-roadmap-outil-arrow" aria-hidden>→</span>
              </a>
            ))}
          </div>
        </div>
        <div className="ai-roadmap-ressources-section">
          <h4 className="ai-roadmap-subtitle">Ressources (cours, docs)</h4>
          <div className="ai-roadmap-ressources-list">
            {RESSOURCES.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="ai-roadmap-ressource">
                <span className="ai-roadmap-ressource-type">{r.type}</span>
                <span className="ai-roadmap-ressource-label">{r.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepEnsuite() {
  return (
    <div className="ai-roadmap-detail">
      <p className="ai-roadmap-intro">{STEP_ENSUITE.intro}</p>
      <div className="ai-roadmap-directions">
        {STEP_ENSUITE.directions.map((d) => (
          <div key={d.title} className="ai-roadmap-direction">
            <h4 className="ai-roadmap-direction-title">{d.title}</h4>
            <p className="ai-roadmap-direction-text">{d.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepDetailContent({ stepId }: { stepId: RoadmapStepId }) {
  switch (stepId) {
    case "declic":
      return <StepDeclic />;
    case "comprendre":
      return <StepComprendre />;
    case "fonctionnement":
      return <StepFonctionnement />;
    case "inspire":
      return <StepInspire />;
    case "outils":
      return <StepOutils />;
    case "ensuite":
      return <StepEnsuite />;
    default:
      return <StepDeclic />;
  }
}

// ——— Mesure de la barre : positions réelles des nodes ———
interface LineLayout {
  left: number;
  width: number;
  top: number;
}

// ——— Composant principal : Roadmap ———

export function AIPanel() {
  const [activeStep, setActiveStep] = useState<RoadmapStepId>("declic");
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeStepRef = useRef(activeStep);
  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  const [lineLayout, setLineLayout] = useState<LineLayout | null>(null);
  const [progressWidthPx, setProgressWidthPx] = useState(0);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const nodes = nodeRefs.current.filter(Boolean);
    if (!track || nodes.length !== ROADMAP_STEPS.length) return;

    const trackRect = track.getBoundingClientRect();
    const firstNode = nodes[0]!;
    const lastNode = nodes[nodes.length - 1]!;
    const firstRect = firstNode.getBoundingClientRect();
    const lastRect = lastNode.getBoundingClientRect();

    const firstCenterX = firstRect.left + firstRect.width / 2 - trackRect.left;
    const lastCenterX = lastRect.left + lastRect.width / 2 - trackRect.left;
    const lineLeft = firstCenterX;
    const lineWidth = Math.max(0, lastCenterX - firstCenterX);

    const dotWrap = firstNode.querySelector<HTMLElement>(".ai-roadmap-node-dot-wrap");
    const dotRect = dotWrap?.getBoundingClientRect() ?? firstRect;
    const lineTop = (dotRect.top + dotRect.height / 2 - trackRect.top);

    setLineLayout({ left: lineLeft, width: lineWidth, top: lineTop });

    const activeIdx = ROADMAP_STEPS.findIndex((s) => s.id === activeStepRef.current);
    if (activeIdx <= 0) {
      setProgressWidthPx(0);
      return;
    }
    const activeNode = nodes[activeIdx];
    if (!activeNode) return;
    const activeRect = activeNode.getBoundingClientRect();
    const activeCenterX = activeRect.left + activeRect.width / 2 - trackRect.left;
    const progress = Math.max(0, Math.min(activeCenterX - firstCenterX, lineWidth));
    setProgressWidthPx(progress);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => measure());
    return () => cancelAnimationFrame(raf);
  }, [activeStep, measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => measure());
    });
    ro.observe(track);
    return () => ro.disconnect();
  }, [measure]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "tween" as const, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const };

  const activeIndex = ROADMAP_STEPS.findIndex((s) => s.id === activeStep);

  return (
    <div className="ai-lab-root ai-lab-root--roadmap h-100 min-h-0">
      <header className="ai-lab-hero ai-lab-hero--roadmap">
        <div className="ai-lab-hero-inner">
          <div className="ai-lab-hero-badge" aria-hidden>
            <span className="ai-lab-hero-badge-dot" />
            <span>Roadmap IA</span>
          </div>
          <h1 className="ai-lab-hero-title">{HERO.title}</h1>
          <p className="ai-lab-hero-subtitle">{HERO.subtitle}</p>
        </div>
      </header>

      <div className="ai-roadmap-layout">
        {/* Roadmap horizontale : track mesurée entre centres Déclic et Suite */}
        <nav className="ai-roadmap-timeline ai-roadmap-timeline--horizontal" aria-label="Étapes de la roadmap">
          <div ref={trackRef} className="ai-roadmap-track ai-roadmap-track--horizontal">
            {/* Ligne construite entre centre premier node et centre dernier node (mesure DOM) */}
            {lineLayout && lineLayout.width > 0 && (
              <div
                className="ai-roadmap-line-wrap ai-roadmap-line-wrap--measured"
                aria-hidden
                style={{
                  left: `${lineLayout.left}px`,
                  width: `${lineLayout.width}px`,
                  top: `${lineLayout.top}px`,
                }}
              >
                <span className="ai-roadmap-line-inactive" />
                <motion.span
                  className="ai-roadmap-line-active"
                  initial={false}
                  animate={{ width: `${progressWidthPx}px` }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            )}
            {ROADMAP_STEPS.map((step, index) => {
              const isActive = step.id === activeStep;
              const isPast = index < activeIndex;
              return (
                <motion.button
                  key={step.id}
                  ref={(el) => { nodeRefs.current[index] = el; }}
                  type="button"
                  className={`ai-roadmap-node ai-roadmap-node--horizontal ${isActive ? "ai-roadmap-node--active" : ""} ${isPast ? "ai-roadmap-node--past" : ""}`}
                  onClick={() => setActiveStep(step.id)}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Étape ${step.order} : ${step.label}`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.96,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.28 }}
                  whileHover={reduceMotion ? {} : { scale: isActive ? 1.02 : 1.01 }}
                  whileTap={reduceMotion ? {} : { scale: 0.97 }}
                >
                  <span className="ai-roadmap-node-dot-wrap">
                    {isActive && <span className="ai-roadmap-node-halo" aria-hidden />}
                    <span className="ai-roadmap-node-ring" />
                    <span className="ai-roadmap-node-dot" />
                  </span>
                  <span className="ai-roadmap-node-label">{step.shortLabel}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Panneau de détail : pleine largeur, grille 2 colonnes desktop */}
        <main className="ai-roadmap-detail-panel" aria-live="polite">
          <div className="ai-roadmap-detail-header">
            <span className="ai-roadmap-detail-badge">Étape {activeIndex + 1} / {ROADMAP_STEPS.length}</span>
            <h2 className="ai-roadmap-detail-title">
              {ROADMAP_STEPS.find((s) => s.id === activeStep)?.label}
            </h2>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStep}
              className="ai-roadmap-detail-inner ai-roadmap-detail-inner--wide"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={transition}
            >
              <StepDetailContent stepId={activeStep} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
