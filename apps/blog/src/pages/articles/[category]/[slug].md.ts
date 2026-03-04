import { type CollectionEntry, getEntry } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { getSortedArticles } from "@/lib/content";

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getSortedArticles();

  return Promise.all(
    articles.map(async (article) => {
      const category = await getEntry("categories", article.data.category.id);

      if (!category) {
        throw new Error(
          `Category ${article.data.category.id} not found for article ${article.id}`,
        );
      }

      return {
        params: {
          category: category.id,
          slug: article.id,
        },
        props: { article },
      };
    }),
  );
};

export const GET: APIRoute<{ article: CollectionEntry<"articles"> }> = ({
  props: { article },
}) =>
  new Response(article.body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
