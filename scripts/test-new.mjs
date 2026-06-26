import { fetchEssayCatalog } from "../src/lib/scraper.ts";

const catalog = await fetchEssayCatalog();
console.log("New essays:", catalog.newEssays.map((e) => e.title));
console.log("Count:", catalog.newEssays.length);
