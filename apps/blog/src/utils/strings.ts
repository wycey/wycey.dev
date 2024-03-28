const hasSubstringAt = (str: string, substr: string, pos: number) => {
  let idx = 0;
  const len = substr.length;

  for (const max = str.length; idx < len; ++idx) {
    if (pos + idx >= max || str[pos + idx] !== substr[idx]) break;
  }

  return idx === len;
};

export const trimWord = (str: string, word: string) => {
  let start = 0;
  let end = str.length;
  const len = word.length;

  while (start < end && hasSubstringAt(str, word, start)) start += word.length;

  while (end > start && hasSubstringAt(str, word, end - len))
    end -= word.length;

  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

export const trimStart = (str: string, substr: string) => {
  let start = 0;
  const len = substr.length;

  while (start < str.length && hasSubstringAt(str, substr, start)) start += len;

  return start > 0 ? str.substring(start) : str;
};

export const trimEnd = (str: string, substr: string) => {
  let end = str.length;
  const len = substr.length;

  while (end > 0 && hasSubstringAt(str, substr, end - len)) end -= len;

  return end < str.length ? str.substring(0, end) : str;
};

type TrimSurrounding = {
  (str: string, substrStart: string, substrEnd: string): string;
  (str: string, substr: string): string;
};

export const trimSurrounding: TrimSurrounding = (
  str: string,
  substrStart: string,
  substrEnd?: string,
) => trimEnd(trimStart(str, substrStart), substrEnd ?? substrStart);
