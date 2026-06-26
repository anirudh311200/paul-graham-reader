"use client";

import { useLocalStorage } from "./useLocalStorage";

const STARS_KEY = "pgr-stars";

export function useStars() {
  const [stars, setStars, ready] = useLocalStorage<string[]>(STARS_KEY, []);

  const isStarred = (slug: string) => stars.includes(slug);

  const toggleStar = (slug: string) => {
    setStars((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  return { stars, isStarred, toggleStar, ready };
}
