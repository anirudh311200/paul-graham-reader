"use client";

import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

const LAST_VISIT_KEY = "pgr-last-visit";
const KNOWN_SLUGS_KEY = "pgr-known-slugs";

export function useVisitTracker(allSlugs: string[]) {
  const [lastVisit, setLastVisit] = useLocalStorage<string | null>(
    LAST_VISIT_KEY,
    null,
  );
  const [knownSlugs, setKnownSlugs, ready] = useLocalStorage<string[]>(
    KNOWN_SLUGS_KEY,
    [],
  );

  const isNewSinceVisit = (slug: string) => {
    if (!ready || !lastVisit) return false;
    return !knownSlugs.includes(slug);
  };

  const newSinceVisitCount = allSlugs.filter(isNewSinceVisit).length;

  useEffect(() => {
    if (!ready) return;

    const handleLeave = () => {
      setLastVisit(new Date().toISOString());
      setKnownSlugs(allSlugs);
    };

    window.addEventListener("beforeunload", handleLeave);
    return () => window.removeEventListener("beforeunload", handleLeave);
  }, [allSlugs, ready, setKnownSlugs, setLastVisit]);

  return {
    isNewSinceVisit,
    newSinceVisitCount,
    lastVisit,
    ready,
  };
}
