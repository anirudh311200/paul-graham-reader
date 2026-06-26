import * as cheerio from "cheerio";

const articlesRes = await fetch("https://www.paulgraham.com/articles.html");
const html = await articlesRes.text();
const $ = cheerio.load(html);

// Find reddit icon essays
const redditEssays = [];
$("img[src*='reddits']").each((_, img) => {
  const next = $(img).next("a[href]");
  if (next.length) {
    redditEssays.push({
      href: next.attr("href"),
      title: next.find("u").text() || next.text(),
    });
  }
});
console.log("reddit/new icon essays", redditEssays.slice(0, 10));

// index new links
const indexHtml = await (await fetch("https://www.paulgraham.com/index.html")).text();
const index$ = cheerio.load(indexHtml);
const newSection = index$("font").first().html() || "";
console.log("index font snippet", newSection?.slice(0, 400));

const newEssays = [];
index$("a[href]").each((_, el) => {
  const href = index$(el).attr("href");
  const title = index$(el).text().trim();
  if (!href?.endsWith(".html") || !title) return;
  const outer = index$.html(el) || "";
  const idx = indexHtml.indexOf(outer);
  const ctx = indexHtml.slice(Math.max(0, idx - 120), idx + outer.length);
  if (/New:/i.test(ctx)) newEssays.push({ href, title });
});
console.log("new from index", newEssays);
