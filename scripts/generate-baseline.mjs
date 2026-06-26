import * as cheerio from "cheerio";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const BASELINE = "2020-01-01T00:00:00.000Z";
const BASE_URL = "https://www.paulgraham.com/articles.html";

const EXCLUDED = new Set([
  "rss", "index", "articles", "books", "bio", "faq", "arc", "bel",
  "lisp", "antispam", "kedrosky", "raq", "quo",
]);

function slugFromHref(href) {
  if (!href?.endsWith(".html") || href.includes("://")) return null;
  const slug = href.replace(/^\.\//, "").replace(/\.html$/, "");
  if (EXCLUDED.has(slug)) return null;
  return slug;
}

const html = await (await fetch(BASE_URL)).text();
const $ = cheerio.load(html);
const raw = [];

$("a[href]").each((_, el) => {
  const href = $(el).attr("href");
  const slug = slugFromHref(href);
  if (!slug) return;
  raw.push(slug);
});

const seen = new Set();
const slugs = [];
for (let i = raw.length - 1; i >= 0; i--) {
  if (seen.has(raw[i])) continue;
  seen.add(raw[i]);
  slugs.unshift(raw[i]);
}

const map = Object.fromEntries(slugs.map((slug) => [slug, BASELINE]));

const outDir = path.join(process.cwd(), "data");
await mkdir(outDir, { recursive: true });
await writeFile(
  path.join(outDir, "first-seen.json"),
  JSON.stringify(map, null, 2),
  "utf-8",
);

console.log(`Baseline written for ${slugs.length} essays`);
