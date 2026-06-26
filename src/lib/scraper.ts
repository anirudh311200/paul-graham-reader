import * as cheerio from "cheerio";
import type { Essay, EssayCatalog } from "./types";
import {
  computeIsNew,
  loadFirstSeenMap,
  parseMonthYearDate,
  resolveFirstSeenAt,
  syncFirstSeenSlugs,
} from "./first-seen";
import { fetchEssayDateLabel } from "./essay-content";

const BASE_URL = "https://www.paulgraham.com";
const ARTICLES_URL = `${BASE_URL}/articles.html`;

const EXCLUDED_SLUGS = new Set([
  "rss",
  "index",
  "articles",
  "books",
  "bio",
  "faq",
  "arc",
  "bel",
  "lisp",
  "antispam",
  "kedrosky",
  "raq",
  "quo",
]);

const TOP_ESSAYS_FOR_DATE_LOOKUP = 8;

function slugFromHref(href: string): string | null {
  if (!href.endsWith(".html") || href.includes("://")) return null;
  const slug = href.replace(/^\.\//, "").replace(/\.html$/, "");
  if (EXCLUDED_SLUGS.has(slug)) return null;
  return slug;
}

function parseEssayLinks(html: string): { slug: string; title: string; url: string }[] {
  const $ = cheerio.load(html);
  const raw: { slug: string; title: string; url: string }[] = [];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    const slug = slugFromHref(href);
    if (!slug) return;

    const title =
      $(el).find("u").text().trim() ||
      $(el).text().trim().replace(/\s+/g, " ");

    if (!title || title.length < 2) return;

    raw.push({
      slug,
      title,
      url: `${BASE_URL}/${slug}.html`,
    });
  });

  const seen = new Set<string>();
  const ordered: typeof raw = [];

  for (let i = raw.length - 1; i >= 0; i--) {
    const item = raw[i];
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    ordered.unshift(item);
  }

  return ordered;
}

function parsePicks(html: string): Essay[] {
  const $ = cheerio.load(html);
  const picks: Essay[] = [];

  if (!$("body").text().includes("If you're not sure which to read")) {
    return picks;
  }

  $("font").each((_, el) => {
    const text = $(el).text();
    if (!text.includes("If you're not sure which to read")) return;

    $(el)
      .find("a[href]")
      .each((_, link) => {
        const href = $(link).attr("href");
        if (!href) return;

        const slug = slugFromHref(href);
        if (!slug) return;

        const title =
          $(link).find("u").text().trim() ||
          $(link).text().trim().replace(/\s+/g, " ");

        if (!title) return;

        picks.push({
          slug,
          title,
          url: `${BASE_URL}/${slug}.html`,
          isNew: false,
          firstSeenAt: null,
        });
      });
  });

  return picks;
}

async function buildEssayDateCache(
  slugs: string[],
): Promise<Map<string, string | null>> {
  const cache = new Map<string, string | null>();
  const topSlugs = slugs.slice(0, TOP_ESSAYS_FOR_DATE_LOOKUP);

  await Promise.all(
    topSlugs.map(async (slug) => {
      const label = await fetchEssayDateLabel(slug);
      cache.set(slug, parseMonthYearDate(label));
    }),
  );

  return cache;
}

export async function fetchEssayCatalog(): Promise<EssayCatalog> {
  const articlesRes = await fetch(ARTICLES_URL, { next: { revalidate: 3600 } });

  if (!articlesRes.ok) {
    throw new Error("Failed to fetch essay catalog from paulgraham.com");
  }

  const articlesHtml = await articlesRes.text();
  const links = parseEssayLinks(articlesHtml);
  const picks = parsePicks(articlesHtml);
  const pickSlugs = new Set(picks.map((p) => p.slug));

  const slugs = links.map((l) => l.slug);
  const firstSeenMap = await syncFirstSeenSlugs(slugs);
  const essayDateCache = await buildEssayDateCache(slugs);

  const essays: Essay[] = links.map((link, index) => {
    const stored = firstSeenMap[link.slug];
    const essayDateIso = essayDateCache.get(link.slug) ?? null;
    const firstSeenAt = resolveFirstSeenAt(
      link.slug,
      stored,
      index < TOP_ESSAYS_FOR_DATE_LOOKUP ? essayDateIso : null,
    );

    return {
      ...link,
      firstSeenAt,
      isNew: computeIsNew(firstSeenAt),
    };
  });

  const listWithoutPicks = essays.filter((e) => !pickSlugs.has(e.slug));
  const catalogEssays =
    listWithoutPicks.length > 0 ? listWithoutPicks : essays;

  const newEssays = catalogEssays.filter((e) => e.isNew);

  return {
    essays: catalogEssays,
    picks,
    newEssays,
    syncedAt: new Date().toISOString(),
  };
}
