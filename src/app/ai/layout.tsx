import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IA",
  description:
    "L’essentiel (déclic, repères, mécanique), des idées, outils et ressources — sobre et direct.",
};

export default function AILayout({ children }: { children: React.ReactNode }) {
  return children;
}
