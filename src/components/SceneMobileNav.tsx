"use client";

/**
 * Navigation mobile entre les formes 3D du carousel.
 *
 * - Visible uniquement sous le breakpoint mobile (piloté par la media query globale `.scene-mobile-nav`).
 * - Branche ses actions sur les mêmes handlers que le clavier / le pointeur (goLeft, goRight, onSelect, onEnter).
 * - Indicateur "index / total" + pastilles cliquables pour sauter directement à une forme.
 * - Zones tactiles ≥ 44×44 px (WCAG 2.1 target size).
 */

interface SceneMobileNavProps {
  activeIndex: number;
  total: number;
  activeTitle: string;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  onEnter: () => void;
}

export function SceneMobileNav({
  activeIndex,
  total,
  activeTitle,
  onPrev,
  onNext,
  onSelect,
  onEnter,
}: SceneMobileNavProps) {
  return (
    <nav
      className="scene-mobile-nav"
      aria-label="Navigation entre les formes 3D"
      // Empêche le tap d'être intercepté par le backdrop / canvas
      onClick={(e) => e.stopPropagation()}
    >
      <div className="scene-mobile-nav-indicator" aria-live="polite">
        <span className="scene-mobile-nav-counter">
          {activeIndex + 1}
          <span className="scene-mobile-nav-counter-sep">/</span>
          {total}
        </span>
        <span className="scene-mobile-nav-title">{activeTitle}</span>
      </div>

      <div className="scene-mobile-nav-controls">
        <button
          type="button"
          className="scene-mobile-nav-btn scene-mobile-nav-btn--side"
          onClick={onPrev}
          aria-label="Forme précédente"
        >
          <span aria-hidden>‹</span>
        </button>

        <div className="scene-mobile-nav-dots" role="tablist" aria-label="Sélection rapide">
          {Array.from({ length: total }).map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Aller à la forme ${i + 1}`}
                className={`scene-mobile-nav-dot${isActive ? " scene-mobile-nav-dot--active" : ""}`}
                onClick={() => onSelect(i)}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="scene-mobile-nav-btn scene-mobile-nav-btn--side"
          onClick={onNext}
          aria-label="Forme suivante"
        >
          <span aria-hidden>›</span>
        </button>
      </div>

      <button
        type="button"
        className="scene-mobile-nav-btn scene-mobile-nav-btn--primary"
        onClick={onEnter}
        aria-label={`Ouvrir la section ${activeTitle}`}
      >
        Ouvrir
      </button>
    </nav>
  );
}
