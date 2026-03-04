import { type CollectionEntry, getEntry } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { getSortedArticles } from "@/lib/content";
import { renderOgImage } from "@/lib/og/render";

interface Props {
  article: CollectionEntry<"articles">;
  category: CollectionEntry<"categories">;
  author: CollectionEntry<"authors">;
}

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

      const author = await getEntry("authors", article.data.author.id);

      if (!author) {
        throw new Error(
          `Author ${article.data.author.id} not found for article ${article.id}`,
        );
      }

      return {
        params: {
          slug: `${article.data.category.id}/${article.id}`,
        },
        props: { article, category, author },
      };
    }),
  );
};

const fetchAvatarAsBase64 = async (
  url: string,
): Promise<string | undefined> => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "image/png";
    return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
  } catch {
    return undefined;
  }
};

export const GET: APIRoute<Props> = async ({
  props: { article, category, author },
}) => {
  const tags =
    article.data.tags
      .map((tag) => category.data.tags?.find((t) => t.slug === tag))
      .filter((t): t is NonNullable<typeof t> => t != null) ?? [];

  const authorAvatarBase64 = author.data.avatar
    ? await fetchAvatarAsBase64(String(author.data.avatar))
    : undefined;

  const png = await renderOgImage({
    title: article.data.title,
    authorName: author.data.name,
    authorAvatarBase64,
    categoryName: category.data.name,
    tags,
  });

  return new Response(Buffer.from(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
