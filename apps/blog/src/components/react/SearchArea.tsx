import type { CollectionEntry } from "astro:content";
import {
  createParser,
  parseAsNativeArrayOf,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import { useCallback, useMemo, useState } from "react";
import { SearchInput } from "@/components/react/SearchInput";
import { SearchResultCard } from "@/components/react/SearchResultCard";
import { Button } from "@/components/react/ui/button";
import {
  type PagefindFilter,
  type PagefindMeta,
  type PagefindSort,
  pagefindSortSchema,
} from "@/lib/content/schema";
import type {
  PagefindFilterQuery,
  PagefindSearchFragment,
  PagefindSearchResult,
  PagefindSortOrder,
} from "@/lib/utils/pagefind";

const RESULTS_PER_PAGE = 10;

interface SearchAreaProps {
  pathname: string | undefined;
  allAuthors: { [key: string]: CollectionEntry<"authors"> };
  allCategories: { [key: string]: CollectionEntry<"categories"> };
  allTags: { [key: string]: string };
}

const parseAsSorting = createParser({
  parse(queryValue): [PagefindSort, PagefindSortOrder] | null {
    const [rawSortKey, sortOrder] = queryValue.split(":");

    const sortKey = pagefindSortSchema.safeParse(rawSortKey);

    if (!sortKey.success || (sortOrder !== "asc" && sortOrder !== "desc")) {
      return null;
    }

    return [sortKey.data, sortOrder];
  },
  serialize(value) {
    return `${value[0]}:${value[1]}`;
  },
});

const SearchAreaInner = ({
  allAuthors,
  allCategories,
  allTags,
}: Omit<SearchAreaProps, "pathname">) => {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });

  const [authors, setAuthors] = useQueryState(
    "author",
    parseAsNativeArrayOf(
      parseAsStringLiteral(Object.keys(allAuthors)),
    ).withDefault([]),
  );

  const [categories, setCategories] = useQueryState(
    "category",
    parseAsNativeArrayOf(
      parseAsStringLiteral(Object.keys(allCategories)),
    ).withDefault([]),
  );

  const [tags, setTags] = useQueryState(
    "tag",
    parseAsNativeArrayOf(
      parseAsStringLiteral(
        Object.values(allCategories).flatMap(
          (category) => category.data.tags?.map((tag) => tag.slug) ?? [],
        ),
      ),
    ).withDefault([]),
  );

  const [tagMatching, setTagMatching] = useQueryState(
    "tagMatching",
    parseAsStringLiteral(["all", "not", "any", "none"]).withDefault("any"),
  );

  const [sort, setSort] = useQueryState(
    "sort",
    parseAsSorting.withDefault(["updatedAt", "desc"]),
  );

  const filters: PagefindFilterQuery<PagefindFilter> = useMemo(
    () => ({
      author: {
        any: authors
          .map((author) => allAuthors[author])
          .filter(Boolean)
          .map((author) => author.data.name),
      },
      category: {
        any: categories
          .map((category) => allCategories[category])
          .filter(Boolean)
          .map((category) => category.data.name),
      },
      tag: {
        [tagMatching]: tags.map((tag) => allTags[tag]).filter(Boolean),
      },
    }),
    [
      allAuthors,
      allCategories,
      allTags,
      authors,
      categories,
      tagMatching,
      tags,
    ],
  );

  const [rawResults, setRawResults] = useState<
    PagefindSearchResult<PagefindFilter, PagefindMeta>[]
  >([]);

  const [results, setResults] = useState<
    PagefindSearchFragment<PagefindFilter, PagefindMeta>[]
  >([]);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadResults = useCallback(
    async (
      raw: PagefindSearchResult<PagefindFilter, PagefindMeta>[],
      startIndex: number,
      count: number,
    ) => {
      const slice = raw.slice(startIndex, startIndex + count);

      return Promise.all(slice.map((result) => result.data()));
    },
    [],
  );

  const handleSearch = useCallback(
    async (
      searchResults: PagefindSearchResult<PagefindFilter, PagefindMeta>[],
    ) => {
      setRawResults(searchResults);
      const initial = await loadResults(searchResults, 0, RESULTS_PER_PAGE);
      setResults(initial);
    },
    [loadResults],
  );

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true);
    const more = await loadResults(
      rawResults,
      results.length,
      RESULTS_PER_PAGE,
    );

    setResults((prev) => [...prev, ...more]);
    setIsLoadingMore(false);
  }, [rawResults, results.length, loadResults]);

  const hasMore = results.length < rawResults.length;

  return (
    <>
      <SearchInput
        w="full"
        h="12"
        filters={filters}
        sort={sort}
        query={query}
        onChangeQuery={setQuery}
        onSearch={handleSearch}
      />

      <details
        my="4"
        rounded="2"
        border="1 border-subtle"
        bg="bg-subtle"
        className="group/search-filter"
      >
        <summary
          flex
          items="center"
          gap="2"
          cursor="pointer"
          px="4"
          py="3"
          select="none"
        >
          <span
            block
            text="sm fg-muted"
            transition="transform 200"
            className="i-lucide:chevron-right group-open/search-filter:rotate-90"
          />
          <span text="sm fg-muted" font="medium">
            フィルタ
          </span>
        </summary>
        <div px="4" pb="4" />
      </details>

      <hr my="6" border="0 t border" />

      {rawResults.length > 0 && (
        <p text="sm fg-muted" mb="4">
          {rawResults.length}件中{results.length}件を表示
        </p>
      )}

      <div flex flex-col gap="4">
        {results.map((result) => (
          <SearchResultCard
            key={result.url}
            url={result.url.replace(/\/+$/, "")}
            title={result.meta.title}
            excerpt={result.excerpt}
            category={result.filters.category?.[0]}
            tags={result.filters.tag ?? []}
            author={result.filters.author?.[0]}
            avatar={result.meta.avatar}
            publishedAt={result.meta.publishedAt}
            wordCount={Number(result.meta.wordCount) || result.word_count}
          />
        ))}
      </div>

      {hasMore && (
        <Button
          variant="ghost"
          mt="4"
          w="full"
          onClick={handleLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? "読み込み中..." : "さらに表示"}
        </Button>
      )}
    </>
  );
};

export const SearchArea = ({ pathname, ...props }: SearchAreaProps) => {
  if (pathname && pathname !== "/search") {
    throw new Error(
      "SearchArea component should only be rendered on the /search page",
    );
  }

  return (
    <NuqsAdapter>
      <SearchAreaInner {...props} />
    </NuqsAdapter>
  );
};
