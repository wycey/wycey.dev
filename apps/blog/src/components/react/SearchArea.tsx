import type { CollectionEntry } from "astro:content";
import {
  createParser,
  parseAsJson,
  parseAsNativeArrayOf,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import { useMemo, useState } from "react";
import { SearchInput } from "@/components/react/SearchInput";
import {
  type PagefindFilter,
  type PagefindMeta,
  type PagefindSort,
  pagefindSortSchema,
} from "@/lib/content/schema";
import type {
  PagefindFilterQuery,
  PagefindSearchFragment,
  PagefindSortOrder,
} from "@/lib/utils/pagefind";

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

  const [results, setResults] = useState<
    PagefindSearchFragment<PagefindFilter, PagefindMeta>[]
  >([]);

  return (
    <>
      <SearchInput
        w="full"
        h="12"
        filters={filters}
        sort={sort}
        query={query}
        onChangeQuery={setQuery}
        onSearch={async (_results) => {
          setResults(
            await Promise.all(_results.map((result) => result.data())),
          );

          console.log(results);
        }}
      />
      <hr />
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
