import * as cheerio from "cheerio";
import type { EssayContent } from "./types";

const BASE_URL = "https://www.paulgraham.com";

function absolutizeLinks(html: string, slug: string): string {
  const $ = cheerio.load(html, null, false);

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("http") || href.startsWith("#")) return;

    if (href.endsWith(".html")) {
      $(el).attr("href", `${BASE_URL}/${href.replace(/^\.\//, "")}`);
    } else if (href.startsWith("/")) {
      $(el).attr("href", `${BASE_URL}${href}`);
    } else if (!href.includes("://")) {
      $(el).attr(
        "href",
        `${BASE_URL}/${slug}.html${href.startsWith("#") ? href : `#${href}`}`,
      );
    }
  });

  return $.html();
}

function wrapFootnoteMarkers($: cheerio.CheerioAPI, root: cheerio.Cheerio<any>): void {
  root.find("p, .essay-notes").each((_, el) => {
    const block = $(el);
    let html = block.html() ?? "";

    html = html.replace(
      /\[\s*(<a[^>]*footnote-ref[^>]*>\d+<\/a>)\s*\]/gi,
      '<span class="footnote-marker">[$1]</span>',
    );

    block.html(html);
  });
}

function sanitizeEssayHtml(html: string): string {
  const $ = cheerio.load(`<div data-essay-root="true">${html}</div>`, null, false);
  const root = $("[data-essay-root]");

  root.find("img").remove();

  while (root.find("font").length > 0) {
    root.find("font").each((_, el) => {
      $(el).replaceWith($(el).html() ?? "");
    });
  }

  root.find("*").each((_, el) => {
    if (el.type !== "tag") return;
    $(el)
      .removeAttr("color")
      .removeAttr("bgcolor")
      .removeAttr("face")
      .removeAttr("size")
      .removeAttr("background");
  });

  root.find("hr").replaceWith('<div class="essay-hr" role="presentation"></div>');

  root.find('a[href^="#"]').each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (/^#f\d+n$/i.test(href)) {
      $(el).addClass("footnote-ref");
    }
  });

  root.find("a[name]").each((_, el) => {
    const name = $(el).attr("name") ?? "";
    if (/^f\d+n$/i.test(name)) {
      $(el).addClass("footnote-ref");
    }
  });

  wrapFootnoteMarkers($, root);

  root.find("b").each((_, el) => {
    if ($(el).text().trim() === "Notes") {
      $(el).replaceWith('<h2 class="essay-notes-heading">Notes</h2>');
    }
  });

  root.find("p").each((_, el) => {
    const text = $(el).text().replace(/\u00a0|\s/g, "");
    const hasMedia = $(el).find("img, a, h2, .essay-hr").length > 0;
    if (!text && !hasMedia) {
      $(el).remove();
    }
  });

  const notesHeading = root.find(".essay-notes-heading").first();
  if (notesHeading.length) {
    const section = $('<div class="essay-notes-section"></div>');
    const notesBody = $('<div class="essay-notes"></div>');

    notesHeading.before(section);
    section.append(notesHeading);
    notesHeading.nextAll().appendTo(notesBody);
    section.append(notesBody);
  }

  return root.html() ?? html;
}

function brsToParagraphs(html: string): string {
  return html
    .replace(/(<br\s*\/?>\s*){3,}/gi, "</p><p>")
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, "</p><p>")
    .replace(/<br\s*\/?>/gi, "<br />");
}

function extractDate(text: string): string | null {
  const match = text.match(/^([A-Z][a-z]+ \d{4})/);
  return match ? match[1] : null;
}

export async function fetchEssayDateLabel(slug: string): Promise<string | null> {
  const url = `${BASE_URL}/${slug}.html`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const html = await res.text();
  const $ = cheerio.load(html);

  let contentFont = $("font[face='verdana']").first();
  let maxLen = contentFont.text().length;

  $("font[face='verdana']").each((_, el) => {
    const len = $(el).text().length;
    if (len > maxLen) {
      maxLen = len;
      contentFont = $(el);
    }
  });

  const plainText = contentFont.text().replace(/\s+/g, " ").trim();
  return extractDate(plainText);
}

export async function fetchEssayContent(slug: string): Promise<EssayContent | null> {
  const url = `${BASE_URL}/${slug}.html`;
  const res = await fetch(url, { next: { revalidate: 86400 } });

  if (!res.ok) return null;

  const html = await res.text();
  const $ = cheerio.load(html);

  let title = $("title").text().trim();

  const titleImg = $("img[alt]")
    .toArray()
    .map((el) => $(el).attr("alt")?.trim())
    .find((alt) => alt && alt.length > 3 && alt !== "Essays");

  if (titleImg) title = titleImg;

  let contentFont = $("font[face='verdana']").first();
  let maxLen = contentFont.text().length;

  $("font[face='verdana']").each((_, el) => {
    const len = $(el).text().length;
    if (len > maxLen) {
      maxLen = len;
      contentFont = $(el);
    }
  });

  const plainText = contentFont.text().replace(/\s+/g, " ").trim();
  const date = extractDate(plainText);

  let contentHtml = contentFont.html() ?? "";

  contentHtml = contentHtml.replace(
    /^(<br\s*\/?>)*\s*([A-Z][a-z]+ \d{4})\s*(<br\s*\/?>)*/i,
    "",
  );
  contentHtml = brsToParagraphs(contentHtml);

  if (!contentHtml.startsWith("<p>")) {
    contentHtml = `<p>${contentHtml}</p>`;
  }

  contentHtml = sanitizeEssayHtml(contentHtml);
  contentHtml = absolutizeLinks(contentHtml, slug);

  return {
    slug,
    title,
    date,
    html: contentHtml,
    originalUrl: url,
  };
}
