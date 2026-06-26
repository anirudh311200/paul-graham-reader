import { unstable_cache } from "next/cache";
import { fetchEssayCatalog } from "./scraper";
import type { Essay, EssayCatalog } from "./types";

export const getEssayCatalog = unstable_cache(
  async (): Promise<EssayCatalog> => fetchEssayCatalog(),
  ["essay-catalog"],
  { revalidate: 3600, tags: ["essays"] },
);

export async function getEssayBySlug(slug: string): Promise<Essay | undefined> {
  const catalog = await getEssayCatalog();
  return catalog.essays.find((e) => e.slug === slug);
}

export function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
