import * as cheerio from "cheerio";

const articlesRes = await fetch("https://www.paulgraham.com/articles.html");
const articlesHtml = await articlesRes.text();
const $ = cheerio.load(articlesHtml);

const essays = [];
$("a[href]").each((_, el) => {
  const href = $(el).attr("href");
  const text = $(el).find("u").text().trim() || $(el).text().trim();
  if (!href?.endsWith(".html")) return;
  if (["index.html", "articles.html"].includes(href)) return;
  if (!text) return;
  essays.push({ href, title: text });
});

console.log("essay count", essays.length);
console.log("first 10", essays.slice(0, 10));
console.log("last 5", essays.slice(-5));

const indexRes = await fetch("https://www.paulgraham.com/index.html");
const indexHtml = await indexRes.text();
const newMatch = indexHtml.match(/New:([^<]*(?:<[^>]+>[^<]*)*)/i);
console.log("new section raw", newMatch?.[0]?.slice(0, 200));

const index$ = cheerio.load(indexHtml);
const newLinks = [];
index$("a[href]").each((_, el) => {
  const parent = $(el).parent()?.html() || "";
  const href = $(el).attr("href");
  const title = $(el).find("u").text().trim();
  if (href?.endsWith(".html") && title) {
    const before = indexHtml.indexOf($(el).prop("outerHTML") || "");
    const context = indexHtml.slice(Math.max(0, before - 80), before);
    if (/New:/i.test(context)) newLinks.push({ href, title });
  }
});
console.log("new links", newLinks);
