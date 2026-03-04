import { loadDefaultJapaneseParser } from "budoux";

const budouxParser = loadDefaultJapaneseParser();

/**
 * BudouXを用いてテキストを分かち書きする。
 * 各チャンクは改行可能な単位。
 */
export const splitByBudoux = (text: string): string[] => {
  return budouxParser.parse(text);
};

// ラテン文字の範囲 (基本ラテン + 拡張)
const LATIN_REGEX = /[\u0020-\u024F\u1E00-\u1EFF]/;
// CJK文字の範囲
const CJK_REGEX =
  /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFF60\uFFE0-\uFFE6]/;

const FOUR_PER_EM_SPACE = "\u2005";

/**
 * ラテン文字と和文の間に四分アキ (U+2005) を挿入する。
 */
export const insertQuarterEmSpaces = (text: string): string => {
  const chars = [...text];
  const result: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    const current = chars[i];
    const prev = i > 0 ? chars[i - 1] : undefined;

    if (prev !== undefined) {
      const prevIsLatin = LATIN_REGEX.test(prev);
      const prevIsCJK = CJK_REGEX.test(prev);
      const currentIsLatin = LATIN_REGEX.test(current);
      const currentIsCJK = CJK_REGEX.test(current);

      if ((prevIsLatin && currentIsCJK) || (prevIsCJK && currentIsLatin)) {
        result.push(FOUR_PER_EM_SPACE);
      }
    }

    result.push(current);
  }

  return result.join("");
};

/**
 * OGP画像用にテキストを処理する。
 * 四分アキ挿入 → BudouX分かち書き
 */
export const processTitle = (title: string): string[] => {
  const spaced = insertQuarterEmSpaces(title);
  return splitByBudoux(spaced);
};
