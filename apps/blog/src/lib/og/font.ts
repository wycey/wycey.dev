import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CACHE_DIR = join(process.cwd(), ".astro", "og-fonts");

// Older Firefox UA to get woff format (Satori's opentype.js doesn't support woff2)
const GOOGLE_FONTS_UA =
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0";

const getCachePath = (weight: number) =>
  join(CACHE_DIR, `noto-sans-jp-${weight}.woff`);

const getCachedFont = (weight: number): Buffer | undefined => {
  const cachePath = getCachePath(weight);

  if (existsSync(cachePath)) {
    return readFileSync(cachePath);
  }

  return undefined;
};

const cacheFont = (weight: number, data: Buffer): void => {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }

  writeFileSync(getCachePath(weight), data);
};

const extractUrlForWeight = (
  cssText: string,
  weight: number,
): string | null => {
  const blockRe = new RegExp(
    `@font-face\\s*\\{[^}]*font-weight:\\s*${weight}[^}]*\\}`,
    "g",
  );
  const match = cssText.match(blockRe);

  if (!match || match.length === 0) return null;

  const urlMatch = match[0].match(/url\((https:[^)]+)\)/);
  return urlMatch ? urlMatch[1] : null;
};

export interface FontData {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal";
}

let fontCache: FontData[] | undefined;

export const loadFonts = async (): Promise<FontData[]> => {
  if (fontCache) return fontCache;

  const cachedRegular = getCachedFont(400);
  const cachedBold = getCachedFont(700);

  if (cachedRegular && cachedBold) {
    fontCache = [
      {
        name: "Noto Sans JP",
        data: cachedRegular,
        weight: 400,
        style: "normal",
      },
      { name: "Noto Sans JP", data: cachedBold, weight: 700, style: "normal" },
    ];
    return fontCache;
  }

  try {
    const cssResp = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
      { headers: { "User-Agent": GOOGLE_FONTS_UA } },
    );

    if (!cssResp.ok) {
      throw new Error(`Failed to fetch Google Fonts CSS: ${cssResp.status}`);
    }

    const cssText = await cssResp.text();

    const regularUrl = extractUrlForWeight(cssText, 400);
    const boldUrl = extractUrlForWeight(cssText, 700);

    if (!(regularUrl && boldUrl)) {
      throw new Error("Could not find font URLs in Google Fonts CSS response");
    }

    const [regularResp, boldResp] = await Promise.all([
      fetch(regularUrl),
      fetch(boldUrl),
    ]);

    if (!(regularResp.ok && boldResp.ok)) {
      throw new Error("Failed to download font files from Google Fonts");
    }

    const regularBuf = Buffer.from(await regularResp.arrayBuffer());
    const boldBuf = Buffer.from(await boldResp.arrayBuffer());

    cacheFont(400, regularBuf);
    cacheFont(700, boldBuf);

    fontCache = [
      { name: "Noto Sans JP", data: regularBuf, weight: 400, style: "normal" },
      { name: "Noto Sans JP", data: boldBuf, weight: 700, style: "normal" },
    ];
    return fontCache;
  } catch (err) {
    throw new Error(
      `Error loading Noto Sans JP fonts: ${err instanceof Error ? err.message : err}`,
    );
  }
};
