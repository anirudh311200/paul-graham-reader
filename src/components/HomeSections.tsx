"use client";

import Link from "next/link";
import type { Essay } from "@/lib/types";
import { EssayCard } from "./EssayCard";
import { useVisitTracker } from "@/hooks/useVisitTracker";

export function NewSinceVisitBanner({ essays }: { essays: Essay[] }) {
  const allSlugs = essays.map((e) => e.slug);
  const { newSinceVisitCount, ready } = useVisitTracker(allSlugs);

  if (!ready || newSinceVisitCount === 0) return null;

  return (
    <div className="rounded-2xl border border-accent/20 bg-accent/8 px-5 py-4">
      <p className="font-serif text-sm text-foreground">
        <span className="font-medium text-accent">{newSinceVisitCount} new</span>
        {" "}since your last visit — scroll down to catch up.
      </p>
    </div>
  );
}

export function LatestSection({ essays }: { essays: Essay[] }) {
  const allSlugs = essays.map((e) => e.slug);
  const { isNewSinceVisit } = useVisitTracker(allSlugs);
  const latest = essays.slice(0, 6);

  return (
    <section className="space-y-4">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="font-serif text-xs uppercase tracking-[0.2em] text-muted">
            Latest
          </p>
          <h2 className="mt-1 font-serif text-2xl font-medium text-foreground">
            Fresh from Paul
          </h2>
        </div>
        <Link
          href="/essays"
            className="inline-flex min-h-11 items-center font-serif text-sm text-accent transition-colors hover:text-foreground"
        >
          View all →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {latest.map((essay, i) => (
          <EssayCard
            key={essay.slug}
            essay={essay}
            isNewSinceVisit={isNewSinceVisit(essay.slug)}
            variant={i < 2 ? "featured" : "default"}
          />
        ))}
      </div>
    </section>
  );
}

export function NewEssaysSection({ essays }: { essays: Essay[] }) {
  if (essays.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <p className="font-serif text-xs uppercase tracking-[0.2em] text-accent">
          Just published
        </p>
        <h2 className="mt-1 font-serif text-2xl font-medium text-foreground">
          New essays
        </h2>
        <p className="mt-1 font-serif text-sm text-muted">
          Published within the last 10 days.
        </p>
      </div>

      <div className="grid gap-4">
        {essays.map((essay) => (
          <EssayCard key={essay.slug} essay={essay} variant="featured" />
        ))}
      </div>
    </section>
  );
}

export function PaulsPicksSection({ picks }: { picks: Essay[] }) {
  if (picks.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <p className="font-serif text-xs uppercase tracking-[0.2em] text-muted">
          Paul&apos;s picks
        </p>
        <h2 className="mt-1 font-serif text-xl font-medium text-foreground">
          Not sure where to start?
        </h2>
        <p className="mt-1 font-serif text-sm text-muted">
          Paul recommends these if you&apos;re new to his essays.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {picks.map((pick) => (
          <Link
            key={pick.slug}
            href={`/essay/${pick.slug}`}
            className="inline-flex min-h-11 items-center rounded-full border border-white/10 bg-surface/60 px-4 py-2 font-serif text-sm text-foreground transition-colors hover:border-accent/30 hover:text-accent sm:min-h-0"
          >
            {pick.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SyncStatus({ syncedAt }: { syncedAt: string }) {
  const date = new Date(syncedAt);
  const formatted = date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <p className="font-serif text-xs text-muted/60">
      Catalog synced {formatted}
    </p>
  );
}
