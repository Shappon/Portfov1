import { useSyncExternalStore } from "react";

/**
 * Souscription à matchMedia (évite setState synchrone dans un effet, aligné recommandation React 19).
 */
export function useMediaQueryMatch(
  query: string,
  getServerSnapshot: () => boolean = () => false
): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => undefined;
      const mq = window.matchMedia(query);
      const handler = () => onChange();
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    },
    () => window.matchMedia(query).matches,
    getServerSnapshot
  );
}
