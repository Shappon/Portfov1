"use client";

/**
 * Bloc contact réutilisable (MePanel, pages SEO, DetailPanel).
 *
 * Contenu modifiable ci-dessous. Les liens absents (chaîne vide) sont
 * automatiquement masqués pour éviter d'afficher des placeholders cassés.
 */
export const CONTACT = {
  email: "admin-shuyh@gmail.com",
  phone: "06 24 05 15 22",
  github: "https://github.com/shuan-huynh",
  linkedin: "",
  message:
    "Disponible pour échanger autour d’un projet web, d’un outil métier, d’un SaaS ou d’une idée intégrant l’IA.",
} as const;

interface ContactBlockProps {
  /** Variante d'affichage : "panel" (dans un panneau) ou "page" (route SEO). */
  variant?: "panel" | "page";
}

export function ContactBlock({ variant = "panel" }: ContactBlockProps) {
  const links: { label: string; href: string }[] = [];
  if (CONTACT.email) links.push({ label: "Email", href: `mailto:${CONTACT.email}` });
  if (CONTACT.github) links.push({ label: "GitHub", href: CONTACT.github });
  if (CONTACT.linkedin) links.push({ label: "LinkedIn", href: CONTACT.linkedin });

  return (
    <section
      className={`contact-block contact-block--${variant}`}
      aria-label="Me contacter"
    >
      <h2 className="contact-block-title">Me contacter</h2>
      <p className="contact-block-message">{CONTACT.message}</p>
      <div className="contact-block-links">
        {links.map((link) => {
          const isExternal = link.href.startsWith("http");
          return (
            <a
              key={link.label}
              className="contact-block-link"
              href={link.href}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-label={
                link.label === "Email"
                  ? `Envoyer un email à ${CONTACT.email}`
                  : `Ouvrir ${link.label}`
              }
            >
              <span className="contact-block-link-label">{link.label}</span>
              <span className="contact-block-link-arrow" aria-hidden>
                →
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
