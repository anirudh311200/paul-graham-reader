const slugs = ["earn", "winc", "brandage"];

for (const slug of slugs) {
  const html = await (await fetch(`https://www.paulgraham.com/${slug}.html`)).text();
  const match = html.replace(/\s+/g, " ").match(/([A-Z][a-z]+ \d{4})/);
  console.log(slug, match?.[1] ?? "no date");
}
