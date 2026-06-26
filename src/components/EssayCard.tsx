"use client";

import Link from "next/link";
import type { Essay } from "@/lib/types";
import { NewBadge } from "./NewBadge";
import { StarButton } from "./StarButton";

interface EssayCardProps {
  essay: Essay;
  isNewSinceVisit?: boolean;
  variant?: "default" | "featured";
}

export function EssayCard({
  essay,
  isNewSinceVisit = false,
  variant = "default",
}: EssayCardProps) {
  const featured = variant === "featured";

  return (
    <Link
      href={`/essay/${essay.slug}`}
      className={`group block rounded-2xl border transition-all duration-300 ${
        featured
          ? "border-accent/20 bg-gradient-to-br from-accent/8 to-transparent p-5 hover:border-accent/40 hover:shadow-[0_0_40px_-12px_rgba(196,167,125,0.25)] sm:p-6"
          : "border-white/6 bg-surface/50 p-4 hover:border-white/12 hover:bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {essay.isNew && <NewBadge />}
            {isNewSinceVisit && !essay.isNew && (
              <NewBadge label="Since last visit" />
            )}
          </div>
          <h3
            className={`font-serif font-medium leading-snug text-foreground transition-colors group-hover:text-accent ${
              featured ? "text-xl sm:text-2xl" : "text-base"
            }`}
          >
            {essay.title}
          </h3>
        </div>
        <StarButton slug={essay.slug} />
      </div>
    </Link>
  );
}
