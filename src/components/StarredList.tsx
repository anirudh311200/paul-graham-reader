"use client";

import Link from "next/link";
import type { Essay } from "@/lib/types";
import { useStars } from "@/hooks/useStars";
import { EssayCard } from "./EssayCard";

export function StarredList({ essays }: { essays: Essay[] }) {
  const { stars, ready } = useStars();

  if (!ready) {
    return (
      <p className="py-12 text-center font-serif text-muted">Loading stars…</p>
    );
  }

  const starredEssays = stars
    .map((slug) => essays.find((e) => e.slug === slug))
    .filter((e): e is Essay => e !== undefined);

  if (starredEssays.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
        <p className="font-logo text-3xl text-muted/50">☆</p>
        <h2 className="mt-4 font-serif text-lg font-medium text-foreground">
          No starred essays yet
        </h2>
        <p className="mt-2 font-serif text-sm text-muted">
          Star the ones that hit different — your high-fi picks live here.
        </p>
        <Link
          href="/essays"
          className="mt-6 inline-block font-serif text-sm text-accent hover:text-foreground"
        >
          Browse essays →
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {starredEssays.map((essay) => (
        <li key={essay.slug}>
          <EssayCard essay={essay} variant="featured" />
        </li>
      ))}
    </ul>
  );
}
