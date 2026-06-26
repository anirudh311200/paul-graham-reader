"use client";

import Link from "next/link";
import { StarButton } from "./StarButton";

interface ReaderToolbarProps {
  slug: string;
  title: string;
  originalUrl: string;
}

export function ReaderToolbar({
  slug,
  title,
  originalUrl,
}: ReaderToolbarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-surface/60 px-4 py-3 sm:mb-8 sm:gap-4 sm:px-5">
      <Link
        href="/essays"
        className="inline-flex min-h-11 items-center font-serif text-sm text-muted transition-colors hover:text-foreground sm:min-h-0"
      >
        ← All essays
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        <StarButton slug={slug} />
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-3 py-1.5 font-serif text-xs text-muted transition-colors hover:border-accent/30 hover:text-accent sm:min-h-0"
        >
          Original
        </a>
      </div>

      <span className="sr-only">{title}</span>
    </div>
  );
}
