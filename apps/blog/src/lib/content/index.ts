import {
  type CollectionEntry,
  getCollection,
  getEntry,
  render,
} from "astro:content";
import { dateNow, parseDate } from "@/lib/content/date";
import { isDev } from "@/lib/utils/env";

interface GetSortedArticlesOptions {
  sortPinned?: boolean;
  filterPredicate?: (article: CollectionEntry<"articles">) => boolean;
}

interface GetArticle {
  (article: CollectionEntry<"articles">): Promise<CollectionEntry<"articles">>;

  (id: string): Promise<CollectionEntry<"articles">>;
}

export const getArticle: GetArticle = async (idOrArticle) => {
  const article =
    typeof idOrArticle === "string"
      ? await getEntry("articles", idOrArticle)
      : idOrArticle;

  if (!article) {
    throw new Error(`Article with id ${idOrArticle} not found`);
  }

  const { remarkPluginFrontmatter } = await render(article);

  article.data.title = remarkPluginFrontmatter.title;

  return article;
};

export const getSortedArticles = async ({
  sortPinned = true,
  filterPredicate = () => true,
}: GetSortedArticlesOptions = {}) => {
  const articles = await getCollection("articles", (article) => {
    if (isDev) return filterPredicate(article);

    const publishedAt = article.data.publishedAt
      ? parseDate(article.data.publishedAt)
      : undefined;

    if (!publishedAt) return false;

    if (!publishedAt.isBefore(dateNow())) return false;

    return filterPredicate(article);
  });

  const sortedArticles = articles.toSorted((a, b) => {
    if (sortPinned) {
      if (a.data.pinned && !b.data.pinned) return -1;
      if (!a.data.pinned && b.data.pinned) return 1;
    }

    const dateA = a.data.publishedAt
      ? parseDate(a.data.publishedAt)
      : undefined;
    const dateB = b.data.publishedAt
      ? parseDate(b.data.publishedAt)
      : undefined;

    return (dateB?.valueOf() ?? 0) - (dateA?.valueOf() ?? 0);
  });

  for (let i = 1; i < sortedArticles.length; i++) {
    sortedArticles[i].data.nextId = sortedArticles[i - 1].id;
  }

  for (let i = 0; i < sortedArticles.length - 1; i++) {
    sortedArticles[i].data.prevId = sortedArticles[i + 1].id;
  }

  // Embed remark plugin frontmatter (reading time, word count)
  await Promise.all(sortedArticles.map(getArticle));

  return sortedArticles;
};
