import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moi",
  description:
    "Parcours, méthode et ce que je construis — développeur full-stack, applications SaaS et outils métiers.",
};

export default function MeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
