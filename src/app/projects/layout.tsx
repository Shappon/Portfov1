import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Projets — SaaS, outils métiers et IA" },
  description:
    "Études de cas détaillées : SaaS, outils métiers, assistants IA et frontend avancé. Contexte, architecture, décisions techniques et stack pour chaque projet.",
  openGraph: {
    title: "Projets — SaaS, outils métiers et IA",
    description:
      "Études de cas : contexte, architecture, décisions techniques et stack pour chaque réalisation.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
