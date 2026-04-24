import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IA",
  description:
    "Parcours d'apprentissage autour de l'IA, outils et pistes d'exploration pour des produits concrets.",
};

export default function AILayout({ children }: { children: React.ReactNode }) {
  return children;
}
