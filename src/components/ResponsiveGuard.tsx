"use client";

import { useState, useEffect } from "react";

/** Seuils minimaux (px) : largeur et hauteur de la fenêtre */
const MIN_WIDTH = 320;
const MIN_HEIGHT = 320;

export function ResponsiveGuard({ children }: { children: React.ReactNode }) {
  const [isBelowThreshold, setIsBelowThreshold] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 0;
      const h = typeof window !== "undefined" ? window.innerHeight : 0;
      setIsBelowThreshold(w < MIN_WIDTH || h < MIN_HEIGHT);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isBelowThreshold) {
    return (
      <div
        className="d-flex align-items-center justify-content-center w-100 min-vh-100 bg-dark text-white text-center p-4"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        }}
        role="alert"
        aria-live="polite"
      >
        <p className="mb-0 fs-5" style={{ maxWidth: "20rem" }}>
          Résolution trop petite, veuillez agrandir la fenêtre.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
