"use client";

import { useMemo, useState } from "react";
import type { Essay } from "@/lib/types";
import { useVisitTracker } from "@/hooks/useVisitTracker";
import { EssayCard } from "./EssayCard";

interface EssayListProps {
  essays: Essay[];
  showSearch?: boolean;
  emptyMessage?: string;
}

function resultLabel(count: number) {
  return `${count} ${count === 1 ? "essay" : "essays"}`;
}

export function EssayList({
  essays,
  showSearch = true,
  emptyMessage = "No essays found.",
}: EssayListProps) {
  const [query, setQuery] = useState("");
  const allSlugs = useMemo(() => essays.map((e) => e.slug), [essays]);
  const { isNewSinceVisit } = useVisitTracker(allSlugs);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return essays;
    return essays.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.slug.toLowerCase().includes(q),
    );
  }, [essays, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="space-y-6">
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search essays…"
            className={`w-full rounded-xl border border-white/8 bg-surface/80 py-3 pl-4 font-serif text-sm text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20 ${
              hasQuery ? "pr-[7.5rem]" : "pr-[5.5rem]"
            }`}
          />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
            <span className="font-serif text-xs text-muted/50">
              {resultLabel(filtered.length)}
            </span>
            {hasQuery && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="flex h-11 w-11 items-center justify-center rounded-full font-serif text-sm text-muted transition-colors hover:bg-white/8 hover:text-foreground sm:h-6 sm:w-6"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-12 text-center font-serif text-muted">{emptyMessage}</p>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((essay) => (
            <li key={essay.slug}>
              <EssayCard
                essay={essay}
                isNewSinceVisit={isNewSinceVisit(essay.slug)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
