import * as cheerio from "cheerio";

const slug = "greatwork.html";
const html = await (await fetch(`https://www.paulgraham.com/${slug}`)).text();
const $ = cheerio.load(html);

$("font[face='verdana']").each((i, el) => {
  const text = $(el).text().replace(/\s+/g, " ").trim();
  console.log(i, "len", text.length, "start", text.slice(0, 80));
});
