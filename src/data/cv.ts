/**
 * Contenu du CV (sources : CV réel Shuan Huynh — pages 1 & 2).
 * Ajouts / compléments cumulés, rien n'est supprimé volontairement.
 */

export const CV_IDENTITY = {
  name: "Shuan Huynh",
  portfolioUrl: "https://www.shuanhuynh.fr",
  portfolioLabel: "www.shuanhuynh.fr",
} as const;

export const CV_CONTACT = {
  phone: "06 24 05 15 22",
  email: "admin-shuyh@gmail.com",
  address: "69 Rue Simone Veil, Pérols",
} as const;

export interface CvEducation {
  diploma: string;
  school: string;
  /** Segments survolables dans l'intitulé du diplôme. */
  diplomaParts?: readonly CvCompanyPart[];
}

export const CV_EDUCATION: readonly CvEducation[] = [
  {
    diploma: "BTS SIO B (Solutions logicielles et applications métiers) — Alternance",
    diplomaParts: [
      { text: "BTS SIO B", videoKey: "bts-sio" },
      { text: " (Solutions logicielles et applications métiers) — Alternance" },
    ],
    school: "Lycée privé Saint-Bénigne, Dijon",
  },
  {
    diploma: "BAC STI2D (Sciences et technologies de l'industrie et du développement durable)",
    diplomaParts: [
      { text: "BAC STI2D", videoKey: "bac-sti2d" },
      { text: " (Sciences et technologies de l'industrie et du développement durable)" },
    ],
    school: "Lycée Nicéphore Niépce",
  },
];

export const CV_LANGUAGES = ["Anglais conversationnel"] as const;

export const CV_PROGRAMMING = ["Javascript", "Python", "SQL", "PHP"] as const;

export const CV_FRAMEWORKS = ["React", "Node", "Laravel"] as const;

export const CV_INTERESTS = ["Histoire", "Veille technologique", "IA"] as const;

/** Vidéos YouTube liées au survol du CV métier. */
export interface CvVideoEntry {
  youtubeId: string;
  title: string;
  /** Début de lecture en secondes (paramètre &t= de l’URL YouTube). */
  startSeconds?: number;
}

export const CV_VIDEOS = {
  i2a: {
    youtubeId: "M8MB3o-GuJ0",
    title: "I2A",
    startSeconds: 2,
  },
  "france-travail": {
    youtubeId: "Vagn1UoyOIY",
    title: "France Travail Pérols",
    startSeconds: 22,
  },
  simpliciti: {
    youtubeId: "winjQ62KqWc",
    title: "Simpliciti",
    startSeconds: 10,
  },
  "bts-sio": {
    youtubeId: "kfgHfSGnSfA",
    title: "BTS SIO B — Lycée Saint-Bénigne",
    startSeconds: 26,
  },
  "bac-sti2d": {
    youtubeId: "s4a2ZCiqTrA",
    title: "BAC STI2D — Lycée Nicéphore Niépce",
    startSeconds: 28,
  },
} as const satisfies Record<string, CvVideoEntry>;

export type CvVideoKey = keyof typeof CV_VIDEOS;

export interface CvCompanyPart {
  text: string;
  videoKey?: CvVideoKey;
}

export interface CvExperience {
  role: string;
  company: string;
  /** Segments cliquables / survolables dans la ligne entreprise. */
  companyParts?: readonly CvCompanyPart[];
  period: string;
  summary?: string;
  bullets: readonly string[];
}

export const CV_EXPERIENCES: readonly CvExperience[] = [
  {
    role: "Technicien SAV Logiciel",
    company: "I2A",
    companyParts: [{ text: "I2A", videoKey: "i2a" }],
    period: "Mars 2025 — Aujourd'hui",
    summary:
      "Support SAV logiciel : accompagnement des utilisateurs, télémaintenance d'automates et d'applications, collaboration avec les équipes de développement.",
    bullets: [
      "Accompagnement des utilisateurs dans l'utilisation de logiciels complexes.",
      "Réparation à distance d'automates, du point de vue applicatif et logiciel.",
      "Réparation à distance de logiciels sur l'ensemble des erreurs applicatives.",
      "Échanges constants avec développeurs et ingénieurs d'applications pour identifier et résoudre des bugs.",
      "Explication pédagogique de systèmes informatiques et adaptation du discours selon le niveau technique.",
    ],
  },
  {
    role: "Service Civique — Médiation numérique",
    company: "France Travail Pérols",
    companyParts: [
      { text: "France Travail", videoKey: "france-travail" },
      { text: " " },
      { text: "Pérols", videoKey: "france-travail" },
    ],
    period: "Septembre 2024 — Février 2025",
    bullets: [
      "Accompagnement de publics en difficulté.",
      "Aide à la réalisation de démarches administratives.",
      "Assistance avec les outils numériques et plateformes administratives.",
      "Explication simplifiée de concepts informatiques (navigation, comptes).",
      "Adaptation du discours (débutants, publics éloignés du numérique).",
      "Adaptation de la communication selon le public.",
      "Simplification de démarches complexes.",
      "Approche pédagogique basée sur la patience et la progression.",
      "Mise en confiance des utilisateurs face aux outils numériques.",
      "Mise en confiance des usagers.",
      "Aide à la structuration de processus numériques simples.",
    ],
  },
  {
    role: "Intérimaire",
    company: "DSI SNCF",
    period: "Septembre 2024 — Février 2025",
    summary: "En parallèle du Service Civique — missions de nuit.",
    bullets: [
      "Propreté et maintenance légère de trains.",
      "Travail de nuit sur les rames.",
    ],
  },
  {
    role: "Chargé de clientèle technique",
    company: "Simpliciti",
    companyParts: [{ text: "Simpliciti", videoKey: "simpliciti" }],
    period: "Avril 2024 — Août 2024",
    summary:
      "Support technique sur des solutions logicielles liées à la ramasse de déchets pour les communes.",
    bullets: [
      "Gestion et accompagnement de clients sur des solutions web.",
      "Explication des fonctionnalités techniques à des utilisateurs non techniques.",
      "Création de requêtes SQL pour analyses et statistiques vendues comme services.",
    ],
  },
  {
    role: "Télé-Technicien (intérim)",
    company: "Randstad — Computer Center (mission Airbus)",
    period: "Juillet 2023 — Septembre 2023",
    summary:
      "Mission d'intérim en support DSI : réparation à distance des postes des employés Airbus, via Computer Center (MSR / OneState).",
    bullets: [
      "Prise en charge et résolution d'incidents à distance sur les postes de travail.",
      "Reset de mots de passe et interventions de type support DSI.",
      "Utilisation d'outils IBM et de logiciels tiers pour le diagnostic et la réparation.",
      "Ciblage de l'incident et élaboration de solutions via protocoles de télémaintenance.",
    ],
  },
  {
    role: "Développeur Web (Alternance)",
    company: "SARL Alban Prebolin",
    period: "Juillet 2020 — Mars 2021",
    summary: "Maintenance, correction et amélioration de sites web existants.",
    bullets: [],
  },
];

export const CV_NETWORK_SKILLS = [
  "Compréhension de réseaux informatiques",
  "Fonctionnement des adresses IP et des ports",
  "Lecture et analyse simple d'une configuration réseau",
] as const;

export const CV_DEV_SKILLS = [
  "Développement web Full-Stack",
  "Conception SaaS",
  "Analyse systèmes informatiques",
  "Architecture applicative",
  "Intégration API",
] as const;

