"use client";

import { useState, useMemo } from "react";
import { useSpring, useSprings, animated } from "@react-spring/web";

export type ProjectCategory = "saas" | "dev" | "reseau";

/** Contexte détaillé du problème (case study) */
export interface ProblemContext {
  contexte?: string;
  situationInitiale?: string;
  utilisateurCible?: string;
}

/** Stack détaillée par couche (case study) */
export interface StackBreakdown {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  orm?: string[];
  auth?: string[];
  hosting?: string[];
}

/** Architecture technique (case study) */
export interface Architecture {
  frontend?: string;
  backend?: string;
  database?: string;
  auth?: string;
  hosting?: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  subCategory?: string;
  description: string;
  problem: string;
  solution: string;
  stack: string[];
  proof: [string, string, string];
  demoUrl?: string;
  githubUrl?: string;
  // ——— Champs case study (optionnels) ———
  /** Type d'application (ex: Dashboard, Web App, API) */
  appType?: string;
  /** Stack par couche pour la section Présentation */
  stackBreakdown?: StackBreakdown;
  /** Contexte métier détaillé pour "Le problème" */
  problemContext?: ProblemContext;
  /** Liste de fonctionnalités pour "La solution" */
  solutionFeatures?: string[];
  /** URLs d'images pour la démo */
  demoScreenshots?: string[];
  /** URL vidéo démo */
  demoVideo?: string;
  /** Lien démo live (alias ou complément de demoUrl) */
  demoLiveUrl?: string;
  /** Architecture technique (Frontend, Backend, etc.) */
  architecture?: Architecture;
  /** Challenges techniques rencontrés */
  challenges?: string[];
  /** Décisions d'ingénierie */
  technicalDecisions?: string[];
  /** Impact / résultats */
  impact?: string[];
  /** Améliorations futures */
  futureImprovements?: string[];
}

const MAIN_CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "saas", label: "SaaS" },
  { id: "dev", label: "Dev" },
  { id: "reseau", label: "Réseau/Cyber" },
];

const projects: Project[] = [
  {
    id: "1",
    title: "TBKing — E-commerce vêtements",
    category: "saas",
    subCategory: "E-commerce",
    description:
      "Boutique en ligne type vêtements avec catalogue, panier, checkout Stripe, compte client et programme de fidélité (points). Back-office admin pour commandes, stock, promotions et statistiques.",
    problem:
      "Besoin d'une plateforme e-commerce complète : vente en ligne, gestion des commandes, fidélisation client et administration interne sans dépendre d'une solution clé en main.",
    solution:
      "Application full-stack Next.js avec catalogue (homme/femme/nouveautés), panier (localStorage), paiement Stripe Checkout, authentification par cookie HttpOnly, programme de points (gain et remise au checkout), et dashboard admin (commandes, stock, promos, stats, paramètres).",
    stack: [
      "Next.js 16 (App Router)",
      "React 19",
      "TypeScript",
      "Bootstrap 5",
      "Prisma",
      "PostgreSQL",
      "Stripe (Checkout Session)",
      "bcrypt",
      "Node.js",
    ],
    proof: [
      "Authentification cookie HttpOnly (tbk_session) + bcrypt, rôles USER/STAFF/ADMIN, garde admin (requireAdminOrStaff).",
      "API REST (produits, auth, checkout, admin) ; Stripe Checkout Session ; Prisma + PostgreSQL (User, Order, LoyaltyAccount, PromoCode, StockMovement, AuditLog, ShopSettings).",
      "Déploiement prévu Vercel (README) ; pas de config déploiement dédiée dans le repo.",
    ],
    demoUrl: "",
    githubUrl: "",
    appType: "Web App",
    stackBreakdown: {
      frontend: ["Next.js 16", "React 19", "TypeScript", "Bootstrap 5", "Bootstrap Icons"],
      backend: ["Next.js API Routes", "Node.js"],
      database: ["PostgreSQL"],
      orm: ["Prisma"],
      auth: ["Cookie HttpOnly (session)", "bcrypt"],
      hosting: [],
    },
    problemContext: {
      contexte:
        "Projet e-commerce avec boutique publique et back-office pour gérer commandes, stock, promotions et paramètres boutique.",
      situationInitiale:
        "Catalogue produits (JSON + Prisma), panier côté client, besoin de paiement en ligne, de comptes clients avec fidélité et d'un espace admin sécurisé.",
      utilisateurCible:
        "Clients (achat, compte, points fidélité) et staff/admin (dashboard, commandes, stock, promos, stats).",
    },
    solutionFeatures: [
      "Catalogue produits (shop homme/femme/nouveautés, PDP, API produits).",
      "Panier persistant (localStorage), page panier et checkout avec résumé.",
      "Paiement Stripe Checkout Session (redirect), pages success/cancel.",
      "Inscription et connexion (email/mot de passe, bcrypt), cookie de session HttpOnly.",
      "Compte client : profil, points fidélité (balance, lifetime), règles de gain et remise (plafonds 20 %/40 %, min 300 pts).",
      "Dashboard admin : KPIs (CA 7j/30j, commandes en attente), top produits, alertes stock, commandes (liste, détail, actions), stock (mouvements), promotions (codes), paramètres boutique, stats et export, gestion nouveautés et utilisateurs.",
      "Modèle de données : User (rôles), Order/OrderItem, LoyaltyAccount/LoyaltyTransaction, PromoCode, StockMovement, AuditLog, ShopSettings.",
    ],
    architecture: {
      frontend: "Next.js 16 App Router, React 19, Bootstrap 5, composants serveur et client.",
      backend: "API Routes Next.js (auth, products, stripe/checkout, me/loyalty, admin/*).",
      database:
        "PostgreSQL via Prisma ; données hybrides (users.json et products.json pour partie auth/catalogue).",
      auth: "Cookie HttpOnly tbk_session (userId), vérification bcrypt ; rôles USER/STAFF/ADMIN, garde admin (admin-guard).",
      hosting: "Prévu Vercel (README) ; DATABASE_URL et STRIPE_SECRET_KEY en env.",
    },
    challenges: [
      "Double source utilisateurs (users.json pour login/register vs Prisma pour profil/fidélité) sans sync automatique.",
      "Remise points calculée côté client au checkout mais non appliquée au montant Stripe (sous-total plein envoyé à Stripe).",
      "Pas de webhook Stripe : aucune création Order en base après paiement réussi.",
      "Paramètre next sur /login non validé (risque open redirect).",
    ],
    technicalDecisions: [
      "Session par cookie HttpOnly plutôt que JWT pour la sécurité et la simplicité côté serveur.",
      "Prisma avec adapter PostgreSQL (@prisma/adapter-pg + pg Pool) pour la connexion DB.",
      "Panier et options checkout (points) en localStorage pour un MVP sans persistance serveur du panier.",
      "Admin protégé par requireAdminOrStaff() (désactivé en dev dans le layout, à réactiver en prod).",
      "Stripe en mode Checkout Session (redirect) plutôt que Payment Intents in-app.",
    ],
    impact: [
      "Boutique utilisable de bout en bout : navigation, panier, paiement et compte client.",
      "Back-office opérationnel pour suivre commandes, stock, promos et statistiques.",
      "Base solide (auth, rôles, audit, modèle fidélité) pour évolutions (webhook, sync users, remise points Stripe).",
    ],
    futureImprovements: [
      "Webhook Stripe checkout.session.completed pour créer Order/OrderItems et débit points.",
      "Appliquer la remise points au montant Stripe (discount ou ligne de remise).",
      "Unifier auth : une seule source (Prisma) avec création User + LoyaltyAccount à l'inscription.",
      "Valider le paramètre next (chemin relatif uniquement) sur la page login.",
      "Optionnel : middleware pour protéger /account et /checkout, persistance panier par utilisateur.",
    ],
    demoVideo: "",
    demoLiveUrl: "",
  },
  {
    id: "2",
    title: "Générateur de cours par IA",
    category: "dev",
    subCategory: "IA / outillage",
    description:
      "Script Python en ligne de commande qui génère des cours complets en Markdown via l'API Hugging Face, les convertit en PDF et les envoie par email.",
    problem:
      "Créer des supports de cours structurés (intro, développement, étude de cas, quiz) demande du temps et une mise en forme cohérente. Les formateurs ou enseignants ont besoin d'un outil simple pour produire rapidement un cours sur un sujet donné.",
    solution:
      "L'outil prend un sujet en entrée, appelle plusieurs modèles LLM (Hugging Face) en fallback jusqu'à obtenir une réponse exploitable, produit un cours au format Markdown (800–1200 mots, structure fixe), le convertit en PDF avec fpdf2, enregistre les fichiers dans un dossier local et envoie Markdown + PDF par email (SMTP).",
    stack: ["Python", "Hugging Face Inference API", "fpdf2", "python-dotenv", "SMTP"],
    proof: [
      "Génération IA multi-modèles (Mistral, Qwen, Phi, etc.) avec fallback chat_completion puis text_generation",
      "Export Markdown + PDF (fpdf2, gestion Unicode et mise en page titres/sections)",
      "Envoi email SMTP avec pièces jointes (Markdown et PDF)",
    ],
    demoUrl: "",
    githubUrl: "",
    appType: "CLI / Script",
    stackBreakdown: {
      frontend: [],
      backend: ["Python"],
      database: [],
      orm: [],
      auth: [],
      hosting: [],
    },
    problemContext: {
      contexte: "Création de supports de cours pour formateurs ou auto-formation.",
      situationInitiale: "Rédaction manuelle longue et répétitive pour chaque sujet.",
      utilisateurCible: "Formateur, enseignant ou apprenant voulant un cours structuré sur un thème donné.",
    },
    solutionFeatures: [
      "Saisie du sujet en ligne de commande",
      "Génération de cours en Markdown via API Hugging Face (plusieurs modèles en fallback)",
      "Structure imposée : introduction, développement (4 sous-sections), étude de cas, résumé, ressources, quiz QCM",
      "Conversion Markdown → PDF (fpdf2, titres h1/h2/h3, retours à la ligne)",
      "Sauvegarde locale (dossier courses, noms datés)",
      "Envoi par email avec Markdown et PDF en pièces jointes (SMTP, config .env)",
    ],
    architecture: {
      frontend: "",
      backend: "Script Python monolithique (app.py), pas de serveur HTTP",
      database: "",
      auth: "Secrets en .env (HF_TOKEN, SMTP_*), pas d'auth applicative",
      hosting: "Exécution locale uniquement, pas de déploiement",
    },
    challenges: [
      "Robustesse face aux échecs d'API : fallback sur plusieurs modèles (chat_completion puis text_generation).",
      "Gestion des caractères spéciaux en PDF : normalisation Unicode (NFKD) et encodage latin-1 pour fpdf2.",
      "Découpage du texte pour le PDF : force_wrap pour éviter les débordements de largeur.",
    ],
    technicalDecisions: [
      "Hugging Face Inference API plutôt qu'un seul modèle local pour éviter l'infra et tester plusieurs modèles.",
      "Liste de modèles candidats (Mistral-Small-24B, Qwen2.5-14B, EuroLLM-9B, Mistral-7B, Phi-3.5-mini) avec ordre de priorité.",
      "Prompt structuré fixe (sections numérotées, objectifs, quiz) pour un format de sortie prévisible.",
      "Configuration via .env (HF_TOKEN, SMTP_USER, SMTP_PASS, SMTP_TO, SMTP_HOST, SMTP_PORT).",
    ],
    impact: [],
    futureImprovements: [],
    demoVideo: "",
    demoLiveUrl: "",
  },
  {
    id: "3",
    title: "Gestionent — Dashboard auto-entrepreneur",
    category: "saas",
    subCategory: "Gestion / conformité",
    description:
      "Application web de tableau de bord pour micro-entrepreneurs : suivi économique (recettes/dépenses), planning URSSAF, calendrier des échéances et mémo juridique/fiscal.",
    problem:
      "Les auto-entrepreneurs doivent suivre CA, dépenses, déclarations URSSAF (mensuelles/trimestrielles), CFE, CFP, IR, tout en respectant les plafonds et seuils. Les échéances et le suivi sont souvent éparpillés.",
    solution:
      "Un dashboard unique avec fiche entreprise et KPIs (CA, marge, progression plafond micro), module Économie (journal, graphiques CA/dépenses, factures) et module URSSAF (planning auto, Kanban, rappels J-N, export CSV/ICS). Calendrier dédié avec tâches typées et notifications navigateur. Données persistées en localStorage.",
    stack: ["React", "Vite", "React Router", "Bootstrap", "Chart.js", "Leaflet", "Lucide React"],
    proof: [
      "Persistance localStorage (économie, URSSAF, calendrier) avec états synchronisés entre pages",
      "Planning URSSAF généré (mensuel/trimestriel) avec export CSV et calendrier ICS",
      "Graphiques Chart.js et cartes Leaflet intégrés (Économie, Marketing, Communication)",
    ],
    demoUrl: "",
    githubUrl: "",
    appType: "Web App",
    stackBreakdown: {
      frontend: [
        "React",
        "Vite",
        "React Router DOM",
        "Bootstrap",
        "Chart.js",
        "react-chartjs-2",
        "Leaflet",
        "react-leaflet",
        "Lucide React",
      ],
      backend: [],
      database: [],
      orm: [],
      auth: [],
      hosting: [],
    },
    problemContext: {
      contexte: "Outil personnel / démo pour la gestion d'une micro-entreprise (EI).",
      situationInitiale:
        "Suivi fiscal et économique dispersé, risque d'oubli des déclarations URSSAF et jalons (CFE, CFP, IR).",
      utilisateurCible: "Auto-entrepreneur (prestations de services ou ventes), en France.",
    },
    solutionFeatures: [
      "Fiche entreprise (identité, seuils micro/TVA) et KPIs dérivés du module Économie (CA mois/YTD, dépenses, marge, progression plafond)",
      "Module Économie : saisie recettes/dépenses, journal filtré, graphiques (sparklines CA/dépenses), suivi factures, persistance eco_state_v2",
      "Module URSSAF : planning annuel (mensuel ou trimestriel), Kanban À faire / En retard / Fait, rappels J-N, export CSV et ICS",
      "Calendrier auto-entrepreneur : tâches (déclaration, échéance, commercial, rdv, formation), vues mois/semaine/jour, notifications navigateur",
      "Pages Juridique, Communication, Marketing (cartes Leaflet), Évolution (conseils micro → SASU/EURL)",
      "Section Projets : liste, détail, cahier des charges, éditeur de structure (StructureEditor)",
    ],
    architecture: {
      frontend: "SPA React (Vite), routing React Router, état local + localStorage.",
      backend: "",
      database:
        "Aucune ; données en localStorage (eco_state_v2, urssaf_declarations, urssaf_settings, ae_calendar_tasks_v1).",
      auth: "",
      hosting: "",
    },
    challenges: [
      "Gestion d'états partagés entre InfosPage et EconomiePage (KPIs depuis eco_state_v2)",
      "Calcul des échéances URSSAF (fin du mois suivant pour le mensuel, dates T1–T4 pour le trimestriel)",
      "Compatibilité des icônes Leaflet avec Vite (URLs CDN pour marker/shadow)",
    ],
    technicalDecisions: [
      "Persistance uniquement côté client (localStorage) pour éviter backend et déploiement serveur",
      "Chart.js pour les courbes (CategoryScale, LinearScale, Line, Tooltip) dans EconomiePage",
      "Export calendrier au format ICS (VEVENT + VALARM) pour intégration dans des agendas externes",
    ],
    impact: [],
    futureImprovements: [],
    demoVideo: "",
    demoLiveUrl: "",
  },
  {
    id: "4",
    title: "SAV Runbook — Télémaintenance par site",
    category: "saas",
    subCategory: "Outillage interne",
    description:
      "Application de runbook SAV et télémaintenance : fiches sites, schémas d'accès et de structure, demandes techniques, avec rôles TECH / IA / ADMIN.",
    problem:
      "Centraliser les informations par site (accès, structure, contacts DSI) et gérer les demandes techniques avec des droits différenciés selon le profil (technicien, IA, admin).",
    solution:
      "Web app avec liste et fiches sites éditables, éditeurs de schémas (accès / structure), soumission de demandes tech, administration des utilisateurs et des accès par site pour le rôle IA.",
    stack: ["Next.js", "React", "TypeScript", "Prisma", "SQLite", "NextAuth", "Bootstrap", "Zod", "bcryptjs"],
    proof: [
      "Authentification NextAuth (JWT, Credentials + Azure AD optionnel) et RBAC TECH/IA/ADMIN",
      "API REST protégée (sites, users, demandes tech) avec contrôle d'accès par site (UserSiteAccess) pour le rôle IA",
      "Rate limiting sur login (5 tentatives / 15 min), middleware de protection /api/*",
    ],
    demoUrl: "",
    githubUrl: "",
    appType: "Web App",
    stackBreakdown: {
      frontend: ["React", "Next.js App Router", "Bootstrap", "Bootstrap Icons", "CSS (token, components, schema)"],
      backend: ["Next.js API Routes", "NextAuth"],
      database: ["SQLite"],
      orm: ["Prisma"],
      auth: ["NextAuth", "CredentialsProvider", "Azure AD (optionnel)", "bcryptjs", "JWT"],
      hosting: [],
    },
    problemContext: {
      contexte: "Runbook SAV et télémaintenance par site.",
      situationInitiale:
        "Besoin d'un outil unique pour consulter/éditer les fiches sites (schémas d'accès, structure, contacts) et traiter les demandes techniques avec des droits par rôle.",
      utilisateurCible: "Équipes TECH (lecture), IA (édition sur sites attribués), ADMIN (gestion complète et utilisateurs).",
    },
    solutionFeatures: [
      "Liste des sites avec recherche",
      "Fiche site : en-tête, panneau rapide, onglets Schéma d'accès / Schéma structure",
      "Éditeurs de schémas (structSchema, accessSchema) avec nœuds et arêtes",
      "Demandes techniques par site (liste + création)",
      "Administration : CRUD utilisateurs, création de site",
      "RBAC : TECH (lecture), IA (édition sites attribués), ADMIN (tout + suppression sites)",
      "Connexion email/mot de passe (Credentials) et option Azure AD",
      "Mode dev : bypass auth avec cookie dev_role (DEV_AUTH_BYPASS)",
      "Rate limiting sur credentials et dev-auth login/register",
    ],
    architecture: {
      frontend: "Next.js 16 App Router, React 19, Bootstrap 5, CSS variables (thème dark).",
      backend: "Next.js API Routes (sites, users, sites/[id]/requests, auth, dev-auth).",
      database:
        "SQLite via Prisma (User, Site, TechRequest, UserSiteAccess, Issue, Intervention, Profile, etc.).",
      auth: "NextAuth JWT (30 j), Credentials + Azure AD optionnel, rôles en session, siteAccess (assertCanModifySite, assertCanDeleteSite).",
      hosting: "",
    },
    challenges: [
      "Gestion des droits IA par site (UserSiteAccess) avec assertCanModifySite / assertCanDeleteSite.",
      "Transition tempPassword → passwordHash (bcrypt) avec rétrocompatibilité dans authorize.",
      "Protection globale /api/* via middleware (session ou dev_role si bypass) sans bloquer NextAuth et dev-auth.",
    ],
    technicalDecisions: [
      "Session JWT (pas d'adapter DB pour les sessions) pour simplifier le déploiement.",
      "SQLite pour le développement et déploiements légers (pas de Postgres dans le repo).",
      "Schémas Zod (userSchema, siteSchema, requestSchema) pour valider les body des API.",
      "Rate limit en mémoire (Map + TTL) ; documenté comme single-instance / à remplacer par Redis en horizontal scaling.",
    ],
    impact: [
      "Accès unifié aux fiches sites et aux schémas pour TECH / IA / ADMIN.",
      "Traçabilité des demandes techniques par site et par utilisateur.",
      "Audit de sécurité documenté (AUDIT_SECURITE_V2.md) avec correctifs ciblés (hash, Zod, cookie Secure, etc.).",
    ],
    futureImprovements: [
      "Espace IA (/ia) prévu en placeholder pour livrable 2 (workspace draft).",
      "Cookie dev_role avec Secure en prod ; désactiver DEV_AUTH_BYPASS en prod.",
      "Rate limit partagé (ex. Redis) pour scaling horizontal.",
    ],
    demoVideo: "",
    demoLiveUrl: "",
  },
  {
    id: "5",
    title: "BiologiA — Assistant IA biologie (RAG + Ollama)",
    category: "dev",
    subCategory: "IA / Éducation",
    description:
      "Application web d'assistant pédagogique en biologie : chat avec un LLM local (Ollama), RAG sur documents uploadés, et enrichissement par images (Wikimedia, iNaturalist) au survol des termes en gras.",
    problem:
      "Les étudiants en biologie ont besoin d'un outil qui réponde à leurs questions à partir de leurs cours (PDF/DOCX) et de sources fiables, avec un format pédagogique (réponse rapide, leçon structurée ou fiche) et une visualisation des concepts par des images pertinentes.",
    solution:
      "Interface de chat multi-conversations avec upload de documents (PDF, DOCX, TXT, MD), indexation vectorielle par conversation (RAG), réponses via Ollama avec modes Q/R, leçon ou fiche. En l'absence de documents, fallback sur Wikipedia (FR/EN). Les termes scientifiques en gras dans les réponses deviennent cliquables au survol : affichage d'images (Wikimedia Commons, Wikidata, iNaturalist) et d'une définition issue du RAG ou du modèle.",
    stack: [
      "React",
      "Vite",
      "Bootstrap",
      "Node.js",
      "Express",
      "Ollama",
      "pdfjs-dist",
      "mammoth",
      "multer",
      "Wikipedia API",
      "Wikidata",
      "iNaturalist API",
      "LRU cache",
    ],
    proof: [
      "RAG sur documents (chunking, embeddings Ollama nomic-embed-text, similarité cosinus, index par chat)",
      "API REST Express (chats, upload, /chat, /define, /images) + intégration Wikipedia/Wikidata/Commons/iNaturalist pour images",
      "Frontend React (Vite) avec chats multiples, modes de réponse (Q/R, leçon, fiche), hover sur termes en gras pour images et définitions",
    ],
    demoUrl: "",
    githubUrl: "",
    appType: "Web App",
    stackBreakdown: {
      frontend: ["React", "Vite", "Bootstrap"],
      backend: ["Node.js", "Express"],
      database: [],
      orm: [],
      auth: [],
      hosting: [],
    },
    problemContext: {
      contexte: "Projet d'outil pédagogique pour la biologie (niveau L1), utilisable en local avec un LLM auto-hébergé.",
      situationInitiale: "Besoin de poser des questions sur des cours (PDF/DOCX) et d'obtenir des réponses sourcées et illustrées.",
      utilisateurCible:
        "Étudiants en biologie, enseignants ou toute personne voulant interroger des documents avec un assistant IA local.",
    },
    solutionFeatures: [
      "Chat multi-conversations (création, renommage, suppression)",
      "Upload de fichiers PDF, DOCX, TXT, MD avec extraction de texte (pdfjs-dist, mammoth)",
      "Indexation RAG par chat (chunks, embeddings Ollama, vector_index.json)",
      "Modes de réponse : Q/R, leçon structurée (objectifs, plan, cours, quiz, synthèse), fiche document",
      "Fallback Wikipedia (FR puis EN) quand aucun document n'est indexé",
      "Termes en gras dans les réponses : survol → appel /images et /define",
      "Images : Wikimedia Commons, Wikidata P18, Wikipedia summary, iNaturalist (espèces), avec scoring et cache LRU",
      "Définitions courtes (JSON) via Ollama avec contexte RAG",
      "Persistance : dossiers par chat (meta.json, history.json, vector_index.json, files/*.json)",
    ],
    architecture: {
      frontend: "React 19 + Vite 7, Bootstrap 5 ; appels fetch vers API backend (localhost:3333)",
      backend: "Express 5, CORS, routes /chats, /upload, /chat, /define, /images",
      database: "Stockage fichier (data/chats/{chatId}/) : pas de SGBD relationnel",
      auth: "Aucune (usage local)",
      hosting: "Non spécifié (dev local : client Vite, server Node sur port 3333)",
    },
    challenges: [
      "Chunking et indexation RAG par conversation avec embeddings Ollama (nomic-embed-text)",
      "Sélection d'images pertinentes (scoring anti-logos/covers, bonus schémas bio, sources multiples)",
      "Format de sortie du LLM contraint (pas de titres Markdown #, puces avec \"-\", termes en gras pour le hover)",
    ],
    technicalDecisions: [
      "Ollama en local pour le chat (llama3.1:8b) et les embeddings (nomic-embed-text), sans clé API cloud",
      "Index vectoriel par chat stocké en JSON (vector_index.json) pour simplicité et portabilité",
      "APIs Wikimedia et iNaturalist avec User-Agent et cache LRU pour limiter les appels et respecter les bonnes pratiques",
      "Post-traitement serveur des réponses (normalisation Markdown, correction des ** non fermés)",
    ],
    impact: [],
    futureImprovements: [],
    demoVideo: "",
    demoLiveUrl: "",
  },
  {
    id: "6",
    title: "Portfolio",
    category: "dev",
    subCategory: "frontend",
    description: "Site personnel one-page avec carousel 3D (Three.js), panneaux détaillés (Moi, Projets, IA) et design sombre.",
    problem: "Présenter parcours, projets et explorations de manière visuelle et professionnelle sans multiplier les pages.",
    solution: "Une seule page avec navigation 3D par carousel (flèches / clic), panneau latéral pour le détail de chaque section, et présentation des projets en case studies.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Three.js", "React Three Fiber", "Framer Motion", "React Spring", "Bootstrap"],
    proof: [
      "Carousel 3D interactif (Three.js / R3F) pour naviguer entre les sections",
      "Panneaux détail (Me, Projets, IA) avec transitions Framer Motion et mise en page responsive",
      "Stack moderne : Next.js App Router, React 19, typographie Geist",
    ],
    appType: "Site one-page / Portfolio",
    stackBreakdown: {
      frontend: ["Next.js 16", "React 19", "TypeScript", "Bootstrap"],
      hosting: ["Vercel ou équivalent (Next.js)"],
    },
    problemContext: {
      contexte: "Besoin d’un portfolio unique pour candidatures et visibilité.",
      situationInitiale: "Souhaite mettre en avant parcours, projets techniques et explorations IA sans site multi-pages.",
      utilisateurCible: "Recruteurs et contacts techniques.",
    },
    solutionFeatures: [
      "Accueil en carousel 3D (Three.js) avec trois sections : Moi, Explorer mes projets, IA",
      "Panneau détail latéral avec contenu riche (présentation, grille de projets, case studies)",
      "Section Moi : blocs cliquables (Qui je suis, Ce que je construis, Ma méthode, Ma vision) + zone de détail",
      "Section Projets : filtres par catégorie (SaaS, Dev, Réseau), cartes projets et case studies détaillées",
      "Animations fluides (Framer Motion, React Spring), design sombre et responsive",
    ],
    architecture: {
      frontend: "Next.js 16 (App Router), React 19, composants client (Home3D, SceneCarousel, DetailPanel, MePanel, ProjectsPanel, AIPanel). Pas de backend.",
      hosting: "Déploiement statique / SSR Next.js (ex. Vercel).",
    },
    challenges: [
      "Intégrer une scène 3D (R3F) dans un layout fullpage sans conflit avec le scroll et les panneaux.",
      "Gérer les transitions entre vue carousel et panneau détail (état, accessibilité, responsive).",
      "Organiser la présentation des projets (fiches + case studies) sans surcharger l’UI.",
    ],
    technicalDecisions: [
      "One-page avec état local (viewMode carousel/detail, activeIndex) pour éviter le routing entre sections.",
      "Three.js via React Three Fiber et Drei pour la 3D déclarative et les helpers.",
      "Framer Motion pour les transitions de panneaux, React Spring pour les animations plus physiques.",
    ],
    impact: [
      "Présentation unifiée du parcours et des projets sur une seule URL.",
      "Expérience distinctive grâce au carousel 3D et au design soigné.",
    ],
    futureImprovements: ["SEO (metadata par section)", "Mode clair/sombre", "Internationalisation (i18n)"],
  },
  {
    id: "7",
    title: "Plateforme d'apprentissage (LMS)",
    category: "saas",
    subCategory: "EdTech",
    description:
      "Plateforme d'apprentissage en ligne avec rôles enseignant/étudiant : modules, leçons, quiz, tests et activités interactives en direct.",
    problem:
      "Besoin d'un outil pour structurer des parcours (modules, leçons), évaluer (quiz et tests) et animer des sessions live (questions, nuage de mots, classement) avec suivi de la progression des étudiants.",
    solution:
      "Application web qui permet aux enseignants de créer modules, leçons (avec pièces jointes et contenu riche), quiz et tests, d'animer des sessions en temps réel via Socket.io, et aux étudiants de suivre leur progression et de passer les évaluations.",
    stack: [
      "React",
      "React Router",
      "Axios",
      "Bootstrap",
      "TipTap",
      "Konva",
      "Socket.io-client",
      "Node.js",
      "Express",
      "PostgreSQL",
      "bcrypt",
      "Multer",
      "Socket.io",
    ],
    proof: [
      "API REST Express (CRUD modules, leçons, quiz, tests, utilisateurs, progression)",
      "PostgreSQL avec schéma relationnel (users, modules, lessons, quizzes, tests, student_progress, réponses)",
      "Socket.io pour sessions live (code session, questions en direct, nuage de mots, classement)",
    ],
    demoUrl: "",
    githubUrl: "",
    appType: "Web App",
    stackBreakdown: {
      frontend: ["React", "React Router DOM", "Axios", "Bootstrap", "TipTap", "react-konva", "Konva", "Socket.io-client"],
      backend: ["Node.js", "Express", "Socket.io"],
      database: ["PostgreSQL"],
      orm: [],
      auth: ["bcrypt"],
      hosting: [],
    },
    problemContext: {
      contexte: "Projet d'application d'enseignement / formation (LMS).",
      situationInitiale: "Pas de déploiement configuré ; exécution en local (backend port 5000, frontend React sur 3000).",
      utilisateurCible:
        "Enseignants (création de contenu, gestion des étudiants, sessions live) et étudiants (parcours, quiz, tests, progression).",
    },
    solutionFeatures: [
      "Inscription et connexion par rôle (student / teacher)",
      "CRUD modules avec composition (leçons, quiz, tests)",
      "CRUD leçons avec upload de fichier et image de couverture, contenu riche (chapitres)",
      "CRUD quiz (questions type texte, vrai/faux, choix multiples) avec soumission et score",
      "CRUD tests avec soumission et enregistrement des réponses",
      "Suivi de progression (leçons complétées, réponses quiz/tests)",
      "Sessions interactives en direct : code session, questions live, nuage de mots, classement (Socket.io)",
      "Gestion des utilisateurs (liste, modification du nom, réinitialisation mot de passe, suppression)",
      "Tableaux de bord et vues détaillées par rôle (enseignant / étudiant)",
    ],
    architecture: {
      frontend:
        "React (Create React App), React Router, Bootstrap, TipTap (éditeur), Konva (canvas), Socket.io-client, Axios ; auth via localStorage et composant RequireAuth.",
      backend: "Express 5 sur Node.js, CORS, routes REST ; même serveur HTTP pour Socket.io.",
      database: "PostgreSQL (pg), connexion via variables d'environnement (DB_USER, DB_DATABASE, DB_PASSWORD).",
      auth: "Bcrypt pour hash des mots de passe ; pas de JWT dans les routes (session côté client via localStorage).",
      hosting: "Non déployé ; lancement local via run.bat (backend node, frontend npm start).",
    },
    challenges: [],
    technicalDecisions: [
      "Utilisation de Socket.io pour les activités live (sessions, questions, nuage de mots, classement) sur le même serveur que l'API.",
      "Stockage de la session utilisateur côté client (localStorage) sans JWT côté backend pour les requêtes API.",
    ],
    impact: [],
    futureImprovements: [],
    demoVideo: "",
    demoLiveUrl: "",
  },
  {
    id: "8",
    title: "SlowPaste",
    category: "dev",
    subCategory: "Desktop",
    description:
      "Application desktop Windows qui intercepte Ctrl+V hors de sa fenêtre pour taper une chaîne enregistrée caractère par caractère (injection clavier SendInput). Conçue pour un usage contrôlé (VPN, RDP, saisie lente).",
    problem:
      "En environnement contrôlé (RDP, VPN), le collage direct (Ctrl+V) peut être bloqué ou indésirable ; il faut parfois simuler une saisie clavier lente pour que le texte soit accepté par l'application cible.",
    solution:
      "L'utilisateur enregistre une chaîne dans l'app, l'« arme » : hors SlowPaste, Ctrl+V déclenche un typing lent (SendInput Unicode) au lieu du collage. Sécurisé par défaut (désarmé, TTL 120 s, one-shot, pas de persistance).",
    stack: ["Tauri 2", "Rust", "TypeScript", "Vite", "Windows API (SendInput, WH_KEYBOARD_LL)"],
    proof: [
      "Hook clavier global Windows (WH_KEYBOARD_LL) + injection SendInput Unicode",
      "Architecture Tauri 2 : frontend Vite/TS, backend Rust, IPC invoke",
      "Packaging Windows (bundle Tauri : exe, MSI/NSIS), déploiement GPO/Intune documenté",
    ],
    demoUrl: "",
    githubUrl: "",
    appType: "Desktop (Windows)",
    stackBreakdown: {
      frontend: ["TypeScript", "Vite", "HTML/CSS"],
      backend: ["Rust", "Tauri 2"],
      database: [],
      orm: [],
      auth: [],
      hosting: [],
    },
    problemContext: {
      contexte: "Environnements où le collage standard est limité ou surveillé (RDP, sessions à distance, politiques de sécurité).",
      situationInitiale: "Coller du texte dans une app distante ou sous politique stricte peut échouer ou être bloqué.",
      utilisateurCible: "Utilisateurs IT, télétravailleurs sous RDP/VPN ayant besoin d'une saisie lente et contrôlée.",
    },
    solutionFeatures: [
      "Enregistrement d'une chaîne (max 20 000 caractères) en mémoire",
      "Toggle ARMÉ/DÉSARMÉ (désarmé par défaut)",
      "Interception de Ctrl+V hors SlowPaste → typing caractère par caractère (délais configurables)",
      "Mode one-shot : désarmement automatique après un collage",
      "TTL 120 s : expiration du buffer en mémoire",
      "Focus guard : arrêt du typing si changement de fenêtre",
      "Mode VMRC : détection vmrc.exe, passage par le presse-papier puis restauration",
      "Pas de persistance disque ; logs sans données sensibles",
      "CSP et capabilities Tauri restreints",
    ],
    architecture: {
      frontend: "Vite + TypeScript, une fenêtre (index.html, main.ts, styles.css), appels invoke() vers le backend.",
      backend:
        "Rust (main.rs) : AppData (Mutex), commandes Tauri (save_text, set_enabled, clear_text, get/set one_shot, TTL), module win (hook + SendInput).",
      database: "Aucune (état uniquement en mémoire).",
      auth: "Aucune.",
      hosting:
        "Application desktop ; déploiement via bundle Tauri (exe/MSI/NSIS), GPO/Intune ou manuel (docs OPERATIONS.md).",
    },
    challenges: [
      "Fiabilité du typing sur RDP et apps lentes (délais, retries, debounce)",
      "Sécurité : pas de fuite du buffer (pas de persistance, logs sans contenu)",
      "Compatibilité VMRC : Ctrl+V non bloqué, usage temporaire du presse-papier puis restauration",
    ],
    technicalDecisions: [
      "Désarmé par défaut et one-shot pour limiter la fenêtre d'exposition",
      "Hook WH_KEYBOARD_LL + thread dédié pour le typing pour ne pas bloquer l'UI",
      "Vérification du focus toutes les 10 frappes (foreground_matches) pour arrêter si l'utilisateur change de fenêtre",
      "CSP strict (tauri.conf.json) et capabilities minimales (core:default uniquement)",
    ],
    impact: [
      "Saisie contrôlée et lente dans des contextes RDP/VPN sans modifier les politiques serveur.",
      "Documentation complète (utilisateur, sécurité, dev, architecture, opérations) pour déploiement et audit.",
    ],
    futureImprovements: [],
    demoVideo: "",
    demoLiveUrl: "",
  },
];

function useReducedMotion(): boolean {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

function categoryLabel(cat: ProjectCategory): string {
  return MAIN_CATEGORIES.find((c) => c.id === cat)?.label ?? cat;
}

// ——— ProjectCard ———
interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <div
      className={`projects-panel-card card border-0 rounded-3 p-3 h-100 projects-panel-card--${project.category}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(project);
        }
      }}
      aria-label={`Voir le projet ${project.title}`}
    >
      <h3 className="projects-panel-card-title mb-1">{project.title}</h3>
      <span className={`projects-panel-card-category projects-panel-cat-badge projects-panel-cat-badge--${project.category} small`}>
        {categoryLabel(project.category)}
      </span>
      <p className="projects-panel-card-desc small mb-2 mt-1">{project.description}</p>
      <div className="d-flex flex-wrap gap-1">
        {project.stack.slice(0, 4).map((s) => (
          <span key={s} className="projects-panel-badge-sm rounded-pill">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ——— ProjectCaseStudy (case study orientée recruteur) ———
interface ProjectCaseStudyProps {
  project: Project;
  onBack: () => void;
  reduceMotion: boolean;
}

function ProjectCaseStudy({ project, onBack, reduceMotion }: ProjectCaseStudyProps) {
  const githubHref = project.githubUrl?.trim() || undefined;
  const problemCtx = project.problemContext;
  const hasProblemDetail = problemCtx && (problemCtx.contexte || problemCtx.situationInitiale || problemCtx.utilisateurCible);
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
      <animated.div style={{ opacity: backSpring.opacity, transform: backSpring.x.to((x) => `translateX(${x}px)`) }} className="project-case-study-nav">
        <button type="button" className="project-case-study-back btn btn-link p-0 text-decoration-none" onClick={onBack} aria-label="Retour à la liste des projets">
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
            {(project.demoVideo || project.demoUrl || project.demoLiveUrl) ? (
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
            <span className={`projects-panel-cat-badge projects-panel-cat-badge--${project.category} project-case-study-hero-cat`}>
              {categoryLabel(project.category)}
            </span>
            {project.appType && <p className="project-case-study-hero-type">{project.appType}</p>}
            <h1 className="project-case-study-hero-title">{project.title}</h1>
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
      <animated.section style={{ opacity: sectionSprings[0].opacity, transform: sectionSprings[0].y.to((y) => `translateY(${y}px)`) }} className="project-case-study-block">
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
      <animated.section style={{ opacity: sectionSprings[1].opacity, transform: sectionSprings[1].y.to((y) => `translateY(${y}px)`) }} className="project-case-study-block">
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
      <animated.section style={{ opacity: sectionSprings[2].opacity, transform: sectionSprings[2].y.to((y) => `translateY(${y}px)`) }} className="project-case-study-block">
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
      <animated.section style={{ opacity: sectionSprings[3].opacity, transform: sectionSprings[3].y.to((y) => `translateY(${y}px)`) }} className="project-case-study-block">
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

      {/* SECTION 6 — Challenges techniques */}
      <animated.section style={{ opacity: sectionSprings[4].opacity, transform: sectionSprings[4].y.to((y) => `translateY(${y}px)`) }} className="project-case-study-block">
        <h2 className="project-case-study-block-title">Challenges techniques</h2>
        {challenges ? (
          <div className="project-case-study-challenges">
            {challenges.map((c, i) => (
              <div key={i} className="project-case-study-challenge-card">
                <span className="project-case-study-challenge-num">{i + 1}</span>
                <p className="project-case-study-card-text mb-0">{c}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="project-case-study-card">
            <p className="project-case-study-card-text mb-0 text-muted small">Non renseigné pour ce projet.</p>
          </div>
        )}
      </animated.section>

      {/* SECTION 7 — Décisions d'ingénierie */}
      <animated.section style={{ opacity: sectionSprings[5].opacity, transform: sectionSprings[5].y.to((y) => `translateY(${y}px)`) }} className="project-case-study-block">
        <h2 className="project-case-study-block-title">Décisions techniques</h2>
        {decisions ? (
          <ul className="project-case-study-decisions">
            {decisions.map((d, i) => (
              <li key={i} className="project-case-study-decision-item">{d}</li>
            ))}
          </ul>
        ) : (
          <div className="project-case-study-card">
            <p className="project-case-study-card-text mb-0 text-muted small">Non renseigné pour ce projet.</p>
          </div>
        )}
      </animated.section>

      {/* SECTION 8 — Impact */}
      <animated.section style={{ opacity: sectionSprings[6].opacity, transform: sectionSprings[6].y.to((y) => `translateY(${y}px)`) }} className="project-case-study-block">
        <h2 className="project-case-study-block-title">Impact</h2>
        {impact ? (
          <div className="project-case-study-impact">
            {impact.map((item, i) => (
              <div key={i} className="project-case-study-impact-item">
                <span className="project-case-study-impact-icon">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="project-case-study-card">
            <p className="project-case-study-card-text mb-0 text-muted small">Non renseigné pour ce projet.</p>
          </div>
        )}
      </animated.section>

      {/* SECTION 9 — Améliorations futures */}
      <animated.section style={{ opacity: sectionSprings[7].opacity, transform: sectionSprings[7].y.to((y) => `translateY(${y}px)`) }} className="project-case-study-block">
        <h2 className="project-case-study-block-title">Améliorations futures</h2>
        {future ? (
          <div className="d-flex flex-wrap gap-2">
            {future.map((f, i) => (
              <span key={i} className="project-case-study-future-chip">{f}</span>
            ))}
          </div>
        ) : (
          <div className="project-case-study-card">
            <p className="project-case-study-card-text mb-0 text-muted small">Non renseigné pour ce projet.</p>
          </div>
        )}
      </animated.section>
    </div>
  );
}

// ——— ProjectsExplorer ———
interface ProjectsExplorerProps {
  categoryFilter: ProjectCategory | null;
  onCategoryFilterChange: (category: ProjectCategory | null) => void;
  onSelectProject: (project: Project) => void;
  reduceMotion: boolean;
}

function ProjectsExplorer({
  categoryFilter,
  onCategoryFilterChange,
  onSelectProject,
  reduceMotion,
}: ProjectsExplorerProps) {
  const filtered = useMemo(() => {
    return categoryFilter
      ? projects.filter((p) => p.category === categoryFilter)
      : projects;
  }, [categoryFilter]);

  const [cardSprings] = useSprings(filtered.length, (i) => ({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    delay: reduceMotion ? 0 : 80 + i * 60,
    config: { duration: reduceMotion ? 0 : 280 },
  }));

  return (
    <div className="projects-panel-explorer projects-panel-explorer--scrollable d-flex flex-column h-100 min-h-0">
      <header className="projects-panel-header mb-4 mb-md-5 text-center flex-shrink-0">
        <h1 className="projects-panel-title mb-0">Explorer mes projets</h1>
      </header>

      <div className="projects-panel-filters mb-4 mb-md-5 d-flex justify-content-center flex-shrink-0">
        <div className="d-flex flex-wrap gap-2 overflow-x-auto overflow-y-hidden pb-1 justify-content-center">
          <button
            type="button"
            className={`btn btn-pill btn-pill-main ${categoryFilter === null ? "btn-pill-main--active" : "btn-pill-main--inactive"}`}
            onClick={() => onCategoryFilterChange(null)}
          >
            Tous
          </button>
          {MAIN_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`btn btn-pill btn-pill-main btn-pill-main--${c.id} ${categoryFilter === c.id ? "btn-pill-main--active" : "btn-pill-main--inactive"}`}
              onClick={() => onCategoryFilterChange(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <section className="projects-panel-grid mt-2 mb-4 flex-shrink-0">
        <div className="row g-3 g-md-3 mx-0">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="col-12 col-sm-6 col-lg-4 projects-panel-grid-cell"
            >
              <animated.div
                className="h-100"
                style={{
                  opacity: cardSprings[i].opacity,
                  transform: cardSprings[i].y.to((y) => `translateY(${y}px)`),
                }}
              >
                <ProjectCard project={project} onSelect={onSelectProject} />
              </animated.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ——— ProjectsPanel (composant principal) ———
export function ProjectsPanel() {
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();

  const transitionSpring = useSpring({
    from: { opacity: 0, y: 12 },
    to: { opacity: 1, y: 0 },
    config: { duration: reduceMotion ? 0 : 240 },
  });

  return (
    <div className="projects-panel-root d-flex flex-column w-100 h-100 min-h-0">
      <animated.div
        key={selectedProject ? "detail" : "explorer"}
        className="projects-panel-view w-100 h-100 min-h-0 d-flex flex-column"
        style={{
          opacity: transitionSpring.opacity,
          transform: transitionSpring.y.to((y) => `translateY(${y}px)`),
        }}
      >
        {selectedProject ? (
          <ProjectCaseStudy
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
            reduceMotion={reduceMotion}
          />
        ) : (
          <ProjectsExplorer
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            onSelectProject={setSelectedProject}
            reduceMotion={reduceMotion}
          />
        )}
      </animated.div>
    </div>
  );
}