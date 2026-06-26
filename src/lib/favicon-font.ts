const PINYON_FONT_URL =
  "https://fonts.gstatic.com/s/pinyonscript/v24/6xKpdSJbL9-e9LuoeQiDRQR8aOI.ttf";

let cachedFont: ArrayBuffer | null = null;

export async function loadPinyonFont(): Promise<ArrayBuffer> {
  if (cachedFont) return cachedFont;

  const response = await fetch(PINYON_FONT_URL);
  if (!response.ok) {
    throw new Error("Failed to load Pinyon Script font for favicon");
  }

  cachedFont = await response.arrayBuffer();
  return cachedFont;
}

export const faviconColors = {
  background: "#0c0b0a",
  foreground: "#e8e4dc",
  border: "rgba(196, 167, 125, 0.35)",
} as const;
