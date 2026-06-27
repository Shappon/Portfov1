import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Shuan Huynh — Développeur full-stack autodidacte" },
  description:
    "Parcours, méthode et ce que je construis : applications web utiles, SaaS, outils métiers, dashboards et assistants IA.",
  openGraph: {
    title: "Shuan Huynh — Développeur full-stack autodidacte",
    description:
      "Parcours, méthode et ce que je construis : SaaS, outils métiers, dashboards et assistants IA.",
    type: "profile",
    locale: "fr_FR",
  },
};

export default function MeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
