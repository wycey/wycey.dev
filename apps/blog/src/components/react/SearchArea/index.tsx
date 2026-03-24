import type { CollectionEntry } from "astro:content";
import {
  createParser,
  parseAsNativeArrayOf,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import { useCallback, useMemo, useState } from "react";
import { MultiSelect } from "@/components/react/MultiSelect";
import { SearchInput } from "@/components/react/SearchInput";
import { SearchResultCard } from "@/components/react/SearchResultCard";
import { Button } from "@/components/react/ui/button";
import { Field, FieldGroup, FieldTitle } from "@/components/react/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/react/ui/native-select";
import {
  type PagefindFilter,
  type PagefindMeta,
  type PagefindSort,
  pagefindSortSchema,
} from "@/lib/content/schema";
import { cn } from "@/lib/utils/classnames";
import type {
  PagefindFilterQuery,
  PagefindSearchFragment,
  PagefindSearchResult,
  PagefindSortOrder,
} from "@/lib/utils/pagefind";
import styles from "./SearchArea.module.css";

const RESULTS_PER_PAGE = 10;

const sortLabels: Record<string, string> = {
  "updatedAt:desc": "更新日時 (新しい順)",
  "updatedAt:asc": "更新日時 (古い順)",
  "publishedAt:desc": "公開日時 (新しい順)",
  "publishedAt:asc": "公開日時 (古い順)",
};

const tagMatchingLabels: Record<string, string> = {
  any: "いずれかに一致",
  all: "すべてに一致",
  not: "含まない",
  none: "いずれも含まない",
};

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
    "tags",
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

  const authorItems = useMemo(
    () =>
      Object.entries(allAuthors).map(([id, author]) => ({
        value: id,
        label: author.data.name,
      })),
    [allAuthors],
  );

  const categoryItems = useMemo(
    () =>
      Object.entries(allCategories).map(([id, category]) => ({
        value: id,
        label: category.data.name,
      })),
    [allCategories],
  );

  const availableTagItems = useMemo(() => {
    const selectedCategoryIds =
      categories.length > 0 ? categories : Object.keys(allCategories);

    return selectedCategoryIds.flatMap((categoryId) => {
      const category = allCategories[categoryId];

      if (!category) return [];

      return (
        category.data.tags?.map((tag) => ({
          value: tag.slug,
          label: tag.name,
        })) ?? []
      );
    });
  }, [allCategories, categories]);

  const selectedAuthorItems = useMemo(
    () => authorItems.filter((item) => authors.includes(item.value as never)),
    [authorItems, authors],
  );

  const selectedCategoryItems = useMemo(
    () =>
      categoryItems.filter((item) => categories.includes(item.value as never)),
    [categoryItems, categories],
  );

  const selectedTagItems = useMemo(
    () =>
      availableTagItems.filter((item) => tags.includes(item.value as never)),
    [availableTagItems, tags],
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
      tags: {
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
        className={cn("group/search-filter", styles.searchFilterDetails)}
      >
        <summary
          flex
          items="center"
          gap="4"
          cursor="pointer"
          px="4"
          py="3"
          select="none"
          flex-wrap="wrap"
        >
          <span
            block
            text="sm fg-muted"
            transition="transform 200"
            className="i-lucide:chevron-right group-open/search-filter:rotate-90"
          />
          <span text="sm fg-muted" font="medium">
            フィルタ・並べ替え
          </span>
          {!(sort[0] === "updatedAt" && sort[1] === "desc") && (
            <span
              inline-flex
              items="center"
              rounded="full"
              px="2"
              py="0.5"
              text="xs fg-muted"
              bg="bg-normal"
              border="px border"
            >
              {sortLabels[`${sort[0]}:${sort[1]}`]}
            </span>
          )}
          {selectedAuthorItems.length > 0 && (
            <span
              inline-flex
              items="center"
              rounded="full"
              px="2"
              py="0.5"
              text="xs info-fg-solid"
              bg="info-bg"
              border="px info-border"
            >
              著者: {selectedAuthorItems.map((a) => a.label).join(", ")}
            </span>
          )}
          {selectedCategoryItems.length > 0 && (
            <span
              inline-flex
              items="center"
              rounded="full"
              px="2"
              py="0.5"
              text="xs primary-fg-solid"
              bg="primary-bg"
              border="px primary-border"
            >
              カテゴリ: {selectedCategoryItems.map((c) => c.label).join(", ")}
            </span>
          )}
          {selectedTagItems.length > 0 && (
            <span
              inline-flex
              items="center"
              rounded="full"
              px="2"
              py="0.5"
              text="xs success-fg-solid"
              bg="success-bg"
              border="px success-border"
            >
              タグ: {selectedTagItems.length}件 (
              {tagMatchingLabels[tagMatching]})
            </span>
          )}
        </summary>
        <div p="x-4 t-2 b-4" flex flex-col gap="4">
          <div
            grid
            gap="4"
            className="grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_auto]"
          >
            <FieldGroup className="md:row-span-2 md:grid md:grid-rows-subgrid">
              <Field>
                <FieldTitle>並べ替え</FieldTitle>
                <NativeSelect
                  className="w-full [&>select]:h-auto [&>select]:min-h-8 [&>select]:py-2"
                  value={`${sort[0]}:${sort[1]}`}
                  onChange={(e) => {
                    const [key, order] = e.target.value.split(":") as [
                      PagefindSort,
                      PagefindSortOrder,
                    ];

                    setSort([key, order]);
                  }}
                >
                  <NativeSelectOption value="updatedAt:desc">
                    更新日時（新しい順）
                  </NativeSelectOption>
                  <NativeSelectOption value="updatedAt:asc">
                    更新日時（古い順）
                  </NativeSelectOption>
                  <NativeSelectOption value="publishedAt:desc">
                    公開日時（新しい順）
                  </NativeSelectOption>
                  <NativeSelectOption value="publishedAt:asc">
                    公開日時（古い順）
                  </NativeSelectOption>
                </NativeSelect>
              </Field>

              <Field>
                <FieldTitle py="1">著者</FieldTitle>
                <MultiSelect
                  items={authorItems}
                  selected={selectedAuthorItems}
                  onSelectedChange={(items) =>
                    setAuthors(items.map((i) => i.value))
                  }
                  placeholder="著者を選択..."
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="md:row-span-2 md:grid md:grid-rows-subgrid">
              <Field>
                <FieldTitle>カテゴリ</FieldTitle>
                <MultiSelect
                  items={categoryItems}
                  selected={selectedCategoryItems}
                  onSelectedChange={(items) => {
                    setCategories(items.map((i) => i.value));

                    const newCatIds = items.map((i) => i.value);
                    const validTagSlugs = new Set(
                      newCatIds.flatMap(
                        (catId) =>
                          allCategories[catId]?.data.tags?.map((t) => t.slug) ??
                          [],
                      ),
                    );

                    setTags(tags.filter((t) => validTagSlugs.has(t)));
                  }}
                  placeholder="カテゴリを選択..."
                />
              </Field>

              <Field>
                <FieldTitle>
                  タグ
                  <NativeSelect
                    size="sm"
                    value={tagMatching}
                    onChange={(e) =>
                      setTagMatching(
                        e.target.value as "any" | "all" | "not" | "none",
                      )
                    }
                  >
                    <NativeSelectOption value="any">
                      いずれかに一致
                    </NativeSelectOption>
                    <NativeSelectOption value="all">
                      すべてに一致
                    </NativeSelectOption>
                    <NativeSelectOption value="not">
                      含まない
                    </NativeSelectOption>
                    <NativeSelectOption value="none">
                      いずれも含まない
                    </NativeSelectOption>
                  </NativeSelect>
                </FieldTitle>
                <MultiSelect
                  items={availableTagItems}
                  selected={selectedTagItems}
                  onSelectedChange={(items) =>
                    setTags(items.map((i) => i.value))
                  }
                  placeholder="タグを選択..."
                />
              </Field>
            </FieldGroup>
          </div>
        </div>
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
            tags={result.filters.tags ?? []}
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
