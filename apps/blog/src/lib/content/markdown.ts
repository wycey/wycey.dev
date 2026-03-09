import { readingTime } from "reading-time-estimator";
import { remark } from "remark";
import stripMarkdown from "strip-markdown";

export const markdownToReadableString = async (data: string = "") => {
  const file = await remark().use(stripMarkdown).process(data);

  return String(file).replaceAll(/\s+/g, " ").trim();
};

interface ReadingTimeResult {
  minutesText: string;
  words: number;
}

const readingTimeCache = new Map<string, ReadingTimeResult>();

const isLessThanAMinute = (minutes: number) => minutes < 1 + Number.EPSILON;

export const getFirstHeading = (markdown: string): string | null => {
  const match = markdown.match(/^#\s+(.*)$/m);

  return match ? match[1].trim() : null;
};

export const getReadingTime = async (
  data: string = "",
): Promise<ReadingTimeResult> => {
  if (readingTimeCache.has(data)) {
    // biome-ignore lint/style/noNonNullAssertion: Cache hit guarantees presence
    return readingTimeCache.get(data)!;
  }

  const { minutes, words } = readingTime(await markdownToReadableString(data), {
    language: "ja",
  });

  const result = {
    minutesText: isLessThanAMinute(minutes) ? "1分未満" : `${minutes}分`,
    words,
  };

  readingTimeCache.set(data, result);

  return result;
};
