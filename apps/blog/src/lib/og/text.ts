import { loadDefaultJapaneseParser } from "budoux";

const budouxParser = loadDefaultJapaneseParser();

const LATIN_REGEX = /\p{Script=Latin}/u;
const CJK_REGEX = /\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}/u;

const FOUR_PER_EM_SPACE = "\u2005";

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

const splitTextIntoLines = (
  text: string,
  lineClamp: number,
  maxCharsPerLine: number,
) => {
  const parsedText = budouxParser.parse(text);
  const lines = [];
  let currentLine = "";

  parsedText.forEach((segment) => {
    if (currentLine.length + segment.length <= maxCharsPerLine) {
      currentLine += segment;
    } else {
      lines.push(currentLine);

      currentLine = segment;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > lineClamp) {
    lines[lineClamp - 1] =
      `${lines[lineClamp - 1].slice(0, maxCharsPerLine - 3)}…`;

    lines.length = lineClamp;
  }

  return lines;
};

export const processTitle = (
  title: string,
  lineClamp: number,
  maxCharsPerLine: number,
) =>
  splitTextIntoLines(title, lineClamp, maxCharsPerLine).map(
    insertQuarterEmSpaces,
  );
