"use client";

import Link from "next/link";

interface SectionPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

/**
 * En-tête commun pour les pages /me, /projects, /ai (même contenu que les panneaux de l’accueil).
 */
export function SectionPageLayout({ title, children }: SectionPageLayoutProps) {
  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ background: "#0a0a0a", color: "var(--bs-body-color, #e0e0e0)" }}
    >
      <header
        className="d-flex align-items-center gap-3 py-3 px-3 px-md-4 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))",
          paddingLeft: "max(0.75rem, env(safe-area-inset-left, 0px))",
          paddingRight: "max(0.75rem, env(safe-area-inset-right, 0px))",
        }}
      >
        <Link href="/" className="btn btn-sm btn-outline-light" aria-label="Revenir à l'accueil">
          ← Accueil
        </Link>
        <h1 className="h5 mb-0 text-white">{title}</h1>
      </header>
      <main
        className="flex-grow-1 overflow-auto flex-shrink-1 min-h-0"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {children}
      </main>
    </div>
  );
}
