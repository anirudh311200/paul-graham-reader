"use client";

import { useStars } from "@/hooks/useStars";

export function StarButton({
  slug,
  size = "md",
}: {
  slug: string;
  size?: "sm" | "md";
}) {
  const { isStarred, toggleStar, ready } = useStars();
  const starred = ready && isStarred(slug);

  const sizeClass = size === "sm" ? "text-base" : "text-xl";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleStar(slug);
      }}
      aria-label={starred ? "Remove star" : "Star this essay"}
      className={`${sizeClass} flex h-11 w-11 shrink-0 items-center justify-center rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 sm:h-auto sm:w-auto sm:min-h-0 sm:min-w-0`}
    >
      <span className={starred ? "text-gold" : "text-muted/40 hover:text-gold/70"}>
        {starred ? "★" : "☆"}
      </span>
    </button>
  );
}
