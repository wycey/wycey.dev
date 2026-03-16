import { getEntry } from "astro:content";
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getSortedArticles } from "@/lib/content";
import { parseDate } from "@/lib/content/date";
import { markdownToReadableString } from "@/lib/content/markdown";
import { truncateString } from "@/lib/utils/strings";

export const GET: APIRoute = async (context) => {
  const articles = await getSortedArticles();

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site ?? new URL(context.url, "/"),
    trailingSlash: false,
    items: await Promise.all(
      articles.map(async (article) => {
        const category = await getEntry(article.data.category);

        if (!category) {
          throw new Error(
            `Category ${article.data.category.id} not found for article ${article.id}`,
          );
        }

        return {
          title: article.data.title,
          description: truncateString(
            await markdownToReadableString(article.body),
          ),
          categories: [category.data.name],
          link: `/articles/${article.data.category.id}/${article.id}`,
          ...(article.data.publishedAt && {
            pubDate: parseDate(article.data.publishedAt).toDate(),
          }),
        };
      }),
    ),
  });
};
