import * as cheerio from "cheerio";

const slug = "greatwork.html";
const html = await (await fetch(`https://www.paulgraham.com/${slug}`)).text();
const $ = cheerio.load(html);

const titleImg = $("img[alt]").filter((_, el) => {
  const alt = $(el).attr("alt") || "";
  return alt.length > 5 && !alt.includes("Essays");
}).first();

console.log("title alt", titleImg.attr("alt"));
console.log("page title", $("title").text());

const contentFont = $("font[face='verdana']").last();
const raw = contentFont.html()?.slice(0, 500);
console.log("content start", raw);

// footnotes
const footnotes = contentFont.find("a[name]").length;
console.log("footnotes", footnotes);
