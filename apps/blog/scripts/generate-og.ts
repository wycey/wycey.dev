import { basename, dirname, resolve } from "node:path";
import { Glob } from "bun";
import matter from "gray-matter";
import { parseDate } from "@/lib/content/date";
import { getFirstHeading, getReadingTime } from "@/lib/content/markdown";
import {
  articlesSchema,
  authorsSchema,
  categoriesSchema,
} from "@/lib/content/schema";
import {
  type ArticleOgImageProps,
  createArticleOg,
  createDefaultOg,
} from "@/lib/og/image";
import type { ImageResources } from "@/lib/og/image-registry";
import { type FontData, renderOgImage } from "@/lib/og/render";

const SRC_IMAGES_DIR = resolve(import.meta.dir, "../src/assets/images");

const FONTS_DIR = resolve(import.meta.dir, "../assets/fonts");
const IMAGES_DIR = resolve(import.meta.dir, "../assets/images");

const CONTENT_DIR = resolve(import.meta.dir, "../content");
const ARTICLES_DIR = resolve(CONTENT_DIR, "articles");
const AUTHORS_DIR = resolve(CONTENT_DIR, "authors");
const CATEGORIES_DIR = resolve(CONTENT_DIR, "categories");

const OUTPUT_DIR = resolve(import.meta.dir, "../dist/client/assets/og");

const createDefaultImageResources = async (): Promise<ImageResources> => ({
  logoLight: await Bun.file(
    resolve(SRC_IMAGES_DIR, "wycey-full-light.png"),
  ).arrayBuffer(),
  logoDark: await Bun.file(
    resolve(SRC_IMAGES_DIR, "wycey-full-dark.png"),
  ).arrayBuffer(),
  ogGradient: await Bun.file(
    resolve(IMAGES_DIR, "og-gradient.png"),
  ).arrayBuffer(),
});

const loadFont = async (
  path: string,
  name: string,
  weight: 400 | 700,
): Promise<FontData> => {
  const file = Bun.file(path);
  const compressedData = await file.arrayBuffer();
  const dataBuffer = await Bun.zstdDecompress(compressedData);
  const data = dataBuffer.buffer.slice(
    dataBuffer.byteOffset,
    dataBuffer.byteOffset + dataBuffer.byteLength,
  ) as ArrayBuffer;

  return {
    name,
    data,
    weight,
    style: "normal",
  };
};

const FONTS: FontData[] = await Promise.all([
  loadFont(
    resolve(FONTS_DIR, "NotoSansJP-Regular-pwid.otf.zst"),
    "Noto Sans JP",
    400,
  ),
  loadFont(
    resolve(FONTS_DIR, "NotoSansJP-Bold-pwid.otf.zst"),
    "Noto Sans JP",
    700,
  ),
  loadFont(
    resolve(FONTS_DIR, "Inter-Regular-tnum.otf.zst"),
    "Inter Tabular Numbers",
    400,
  ),
]);

const getArticleData = async (content: string) => {
  const { data: rawData } = matter(content);

  return await articlesSchema.parseAsync(rawData);
};

const getAuthorData = async (authorId: string) => {
  const authorPath = resolve(AUTHORS_DIR, `${authorId}.yaml`);
  const file = Bun.file(authorPath);
  const content = await file.text();

  const rawData = Bun.YAML.parse(content);

  return await authorsSchema.parseAsync(rawData);
};

const getCategoryData = async (categoryId: string) => {
  const categoryPath = resolve(CATEGORIES_DIR, `${categoryId}.yaml`);
  const file = Bun.file(categoryPath);
  const content = await file.text();

  const rawData = Bun.YAML.parse(content);

  return await categoriesSchema.parseAsync(rawData);
};

const getArticleOgImageProps = async (
  articlePath: string,
  articleId: string,
  images: ImageResources,
): Promise<ArticleOgImageProps | undefined> => {
  const text = await Bun.file(articlePath).text();
  const article = await getArticleData(text);
  const { words } = await getReadingTime(text);

  if (!article.publishedAt) {
    // Skip unpublished articles
    return;
  }

  const author = await getAuthorData(article.author.id);
  const category = await getCategoryData(article.category.id);

  const getTag = (tagSlug: string) =>
    category.tags?.find((tag) => tag.slug === tagSlug);

  if (author.avatar && !images[article.author.id]) {
    const response = await fetch(author.avatar);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch avatar for author ${author.name} from ${author.avatar}`,
      );
    }

    images[article.author.id] = await response.arrayBuffer();
  }

  return {
    title: getFirstHeading(text) ?? article.title,
    routePath: `/articles/${article.category.id}/${articleId}`,
    articleId,
    authorName: author.name,
    authorId: article.author.id,
    categoryName: category.name,
    categoryId: article.category.id,
    publishedAt: parseDate(article.publishedAt).format("YYYY/MM/DD"),
    words,
    tags: article.tags.map(getTag).filter(Boolean),
    images,
  };
};

const renderArticles = async (
  images: ImageResources,
): Promise<Promise<void>[]> => {
  const promises: Promise<void>[] = [];

  const articlesGlob = new Glob(resolve(ARTICLES_DIR, "**", "index.md"));
  const allAuthorsGlob = new Glob(resolve(AUTHORS_DIR, "*.yaml"));

  // Resolve all author images first to avoid redundant fetches when multiple articles share the same author
  const authorImagePromises: Promise<void>[] = [];

  for await (const authorPath of allAuthorsGlob.scan()) {
    const authorId = basename(authorPath, ".yaml");
    const author = await getAuthorData(authorId);
    const authorKey = `avatar-${authorId}`;

    if (author.avatar && !images[authorKey]) {
      const promise = fetch(author.avatar).then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch avatar for author ${author.name} from ${author.avatar}`,
          );
        }

        images[authorKey] = await response.arrayBuffer();
      });

      authorImagePromises.push(promise);
    }
  }

  await Promise.all(authorImagePromises);

  for await (const articlePath of articlesGlob.scan()) {
    const articleId = dirname(articlePath).split("/").pop();

    if (!articleId) {
      console.warn(
        `Skipping article at ${articlePath} due to invalid path structure.`,
      );

      continue;
    }

    promises.push(
      getArticleOgImageProps(articlePath, articleId, images).then(
        async (props) => {
          if (!props) return;

          const data = await renderOgImage(await createArticleOg(props), FONTS);
          const outputPath = resolve(
            OUTPUT_DIR,
            props.categoryId,
            `${articleId}.png`,
          );

          await Bun.write(outputPath, data);
        },
      ),
    );
  }

  return promises;
};

const renderDefault = async (images: ImageResources) => {
  const data = await renderOgImage(await createDefaultOg({ images }), FONTS);
  const outputPath = resolve(OUTPUT_DIR, "default.png");

  await Bun.write(outputPath, data);
};

console.info("Generating OG images...");
console.time("OG image generation completed.");

const images = await createDefaultImageResources();
const promises: Promise<void>[] = [];

promises.push(...(await renderArticles(images)), renderDefault(images));

await Promise.all(promises);

console.timeEnd("OG image generation completed.");
