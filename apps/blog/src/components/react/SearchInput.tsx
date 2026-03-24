import { type ComponentProps, useEffect, useState } from "react";
import { usePublicImport } from "@/hooks/react/usePublicImport";
import type {
  PagefindFilter,
  PagefindMeta,
  PagefindSort,
} from "@/lib/content/schema";
import type {
  Pagefind,
  PagefindFilterQuery,
  PagefindSearchResult,
  PagefindSortOrder,
} from "@/lib/utils/pagefind";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export type SearchInputProps = {
  filters?: PagefindFilterQuery<PagefindFilter>;
  sort?: [PagefindSort, PagefindSortOrder];
  query?: string;
  onChangeQuery?: (query: string) => void;
  onSearch?: (
    results: PagefindSearchResult<PagefindFilter, PagefindMeta>[],
  ) => void;
};

export const SearchInput = ({
  filters = {},
  sort,
  query,
  onChangeQuery,
  onSearch,
  ...props
}: SearchInputProps & ComponentProps<"div">) => {
  const {
    status,
    module: pagefind,
    error,
  } = usePublicImport<Pagefind<PagefindFilter, PagefindMeta, PagefindSort>>(
    "/pagefind/pagefind.js",
  );

  const [count, setCount] = useState<number>(0);

  const processSearch = async (query: string) => {
    if (status !== "success" || query.trim() === "") return;

    const search = await pagefind.debouncedSearch(query, {
      filters,
      ...(sort && { sort: { [sort[0]]: sort[1] } }),
    });

    if (search === null) return;

    setCount(search.results.length);
    onSearch?.(search.results);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: No need to add processSearch to dependencies as it changes on every render
  useEffect(() => {
    if (query) {
      processSearch(query);
    } else {
      setCount(0);
    }
  }, [filters, sort, query, status]);

  return (
    <>
      <InputGroup {...props}>
        <InputGroupInput
          disabled={status !== "success"}
          text="base"
          placeholder="検索..."
          value={query}
          onChange={(e) => {
            onChangeQuery?.(e.currentTarget.value);
          }}
        />
        <InputGroupAddon>
          <span block className="i-lucide:search" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {count > 0 && `${count}件`}
        </InputGroupAddon>
      </InputGroup>
      <p text="sm error-fg-solid" mt="2" className="whitespace-pre-wrap">
        {error ? `Failed to load search module: ${JSON.stringify(error)}` : ""}
      </p>
    </>
  );
};
