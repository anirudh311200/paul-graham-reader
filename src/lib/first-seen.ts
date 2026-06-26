import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  BASELINE_FIRST_SEEN,
  NEW_THRESHOLD_DAYS,
} from "./types";

export type FirstSeenMap = Record<string, string>;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "first-seen.json");

export async function loadFirstSeenMap(): Promise<FirstSeenMap> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as FirstSeenMap;
  } catch {
    return {};
  }
}

export async function saveFirstSeenMap(map: FirstSeenMap): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(map, null, 2), "utf-8");
  } catch (error) {
    console.warn("Could not persist first-seen map:", error);
  }
}

export async function syncFirstSeenSlugs(slugs: string[]): Promise<FirstSeenMap> {
  const map = await loadFirstSeenMap();
  const now = new Date().toISOString();
  let changed = false;

  for (const slug of slugs) {
    if (!map[slug]) {
      map[slug] = now;
      changed = true;
    }
  }

  if (changed) {
    await saveFirstSeenMap(map);
  }

  return map;
}

export function daysSince(isoDate: string): number {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  return (now - then) / (1000 * 60 * 60 * 24);
}

export function isWithinNewWindow(isoDate: string): boolean {
  return daysSince(isoDate) <= NEW_THRESHOLD_DAYS;
}

export function parseMonthYearDate(raw: string | null): string | null {
  if (!raw) return null;

  const match = raw.match(/^([A-Z][a-z]+)\s+(\d{4})$/);
  if (!match) return null;

  const [, month, year] = match;
  const parsed = new Date(`${month} 1, ${year}`);
  if (Number.isNaN(parsed.getTime())) return null;

  const now = new Date();
  if (
    parsed.getMonth() === now.getMonth() &&
    parsed.getFullYear() === now.getFullYear()
  ) {
    return now.toISOString();
  }

  return parsed.toISOString();
}

export function resolveFirstSeenAt(
  slug: string,
  stored: string | undefined,
  essayDateIso: string | null,
): string {
  if (stored && stored !== BASELINE_FIRST_SEEN) {
    return stored;
  }

  if (essayDateIso) {
    return essayDateIso;
  }

  return stored ?? BASELINE_FIRST_SEEN;
}

export function computeIsNew(firstSeenAt: string): boolean {
  if (firstSeenAt === BASELINE_FIRST_SEEN) {
    return false;
  }

  return isWithinNewWindow(firstSeenAt);
}
