/* @jsxImportSource solid-js */

import type { CollectionEntry } from "astro:content";
import { parseDate } from "@/lib/content/date";

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";

  const date = parseDate(dateString);

  if (!date.isValid()) return dateString;

  return date.format("M月D日");
};

interface YearGroup {
  year: number;
  articles: CollectionEntry<"articles">[];
}

export interface ArticleTimelineProps {
  articles: CollectionEntry<"articles">[];
}

export const ArticleTimeline = ({ articles }: ArticleTimelineProps) => {
  let groups = $signal<YearGroup[]>([]);

  $mount(() => {
    const grouped = articles.reduce(
      (acc, article) => {
        const publishedAt = article.data.publishedAt
          ? parseDate(article.data.publishedAt)
          : undefined;

        if (!publishedAt) return acc;

        const year = publishedAt.year();

        if (!acc[year]) {
          acc[year] = [];
        }

        acc[year].push(article);

        return acc;
      },
      {} as { [year: number]: CollectionEntry<"articles">[] },
    );

    groups = Object.keys(grouped)
      .map((year) => ({
        year: +year,
        articles: grouped[+year],
      }))
      .toSorted((a, b) => b.year - a.year);
  });

  return (
    <div p="x-8 y-6">
      <For each={groups}>
        {({ year, articles }) => (
          <>
            <div flex items="center" w="full" h="15">
              <p w="20% md:15%" transition text="3xl right" font="bold">
                {year}
              </p>
              <div w="20% md:15%">
                <div
                  h="3"
                  w="3"
                  mx="auto"
                  z="40"
                  bg="none"
                  rounded="full"
                  outline="primary-10 3"
                  class="aspect-square"
                ></div>
              </div>
              <div w="70% md:65%" transition text="left fg-muted">
                投稿数: {articles.length}
              </div>
            </div>
            <For each={articles}>
              {(article) => (
                <a
                  href={`/articles/${article.data.category.id}/${article.id}`}
                  aria-label={article.data.title}
                  block="!"
                  w="full"
                  h="10"
                  rounded="2"
                  transition
                  bg="hover:primary-bg-hover active:primary-bg-active"
                  text="hover:primary-10"
                  class="group"
                >
                  <div flex items="center" justify="start" h="full">
                    <p w="20% md:15%" transition text="sm right fg-muted">
                      {formatDate(article.data.publishedAt)}
                    </p>

                    <div
                      class="dashed-line"
                      w="20% md:15%"
                      h="full"
                      relative
                      flex
                      items="center"
                    >
                      <div
                        relative
                        z="10"
                        transition="all"
                        mx="auto"
                        w="1"
                        h="1"
                        rounded="1"
                        group-hover="h-5"
                        bg="fg-muted group-hover:primary-10"
                        outline="4 bg group-hover:primary-bg-hover group-active:primary-bg-active"
                      />
                    </div>

                    <p
                      w="70% md:65%"
                      max-w="md:65%"
                      pr="8"
                      transition="all"
                      text="left ellipsis"
                      font="bold"
                      group-hover="translate-x-0.5"
                      overflow="hidden"
                      class="whitespace-nowrap"
                    >
                      {article.data.title}
                    </p>
                  </div>

                  <div
                    hidden
                    md="block w-15%"
                    text="left sm ellipsis"
                    transition
                    overflow="hidden"
                    class="whitespace-nowrap"
                  >
                    /{article.data.category.id}
                  </div>
                </a>
              )}
            </For>
          </>
        )}
      </For>
    </div>
  );
};
