import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "SaaS, outils et expérimentations : études de cas et stack pour chaque réalisation.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
