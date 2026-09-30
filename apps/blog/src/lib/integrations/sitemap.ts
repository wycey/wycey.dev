import { execFile } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { SitemapItem } from "@astrojs/sitemap";

const execFileAsync = promisify(execFile);

const ARTICLE_SOURCE_FILENAMES = ["index.md", "index.mdx"];
const ARTICLE_URL_PATH_REGEX = /^\/articles\/[^/]+\/([^/]+)$/;

const getGitLastModified = async (filePath: string) => {
  try {
    // Run in the file's directory so that git resolves the content submodule instead of the parent repository
    const { stdout } = await execFileAsync(
      "git",
      ["log", "-1", "--format=%cI", "--", path.basename(filePath)],
      { cwd: path.dirname(filePath) },
    );

    // Empty when the file has never been committed
    return stdout.trim() || undefined;
  } catch (error) {
    // @astrojs/sitemap skips writing the whole sitemap when serialize throws, so omit lastmod instead
    console.warn(
      `Failed to retrieve last modified date via git log for file "${filePath}"; lastmod is omitted`,
      error,
    );

    return undefined;
  }
};

const collectArticleLastmods = async (articlesDir: string) => {
  const entries = await readdir(articlesDir, { recursive: true });
  const lastmodBySlug = new Map<string, string>();

  await Promise.all(
    entries.map(async (entry) => {
      const segments = entry.split(path.sep);
      const filename = segments.at(-1);
      const slug = segments.at(-2);

      if (!(filename && slug && ARTICLE_SOURCE_FILENAMES.includes(filename))) {
        return;
      }

      const lastmod = await getGitLastModified(path.join(articlesDir, entry));

      if (lastmod) {
        lastmodBySlug.set(slug, lastmod);
      }
    }),
  );

  return lastmodBySlug;
};

// Article slugs are unique across categories (see `generateId` in content.config.ts), so they are used as keys
export const createArticleLastmodSerializer = (articlesDir: string) => {
  let lastmodBySlugPromise: Promise<Map<string, string>> | undefined;

  return async (item: SitemapItem): Promise<SitemapItem> => {
    lastmodBySlugPromise ??= collectArticleLastmods(articlesDir);

    const slug = new URL(item.url).pathname.match(ARTICLE_URL_PATH_REGEX)?.[1];

    if (!slug) {
      return item;
    }

    const lastmod = (await lastmodBySlugPromise).get(slug);

    return lastmod ? { ...item, lastmod } : item;
  };
};
