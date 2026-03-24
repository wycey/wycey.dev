export interface PagefindIndexOptions {
  basePath?: string;
  baseUrl?: string;
  excerptLength?: number;
  indexWeight?: number;
  mergeFilter?: { [key: string]: unknown };
  highlightParam?: string;
  language?: string;
  primary?: boolean;
  ranking?: PagefindRankingWeights;
}

export interface PagefindRankingWeights {
  termSimilarity?: number;
  pageLength?: number;
  termSaturation?: number;
  termFrequency?: number;
}

export type PagefindFilterQuery<TFilter extends { [key: string]: string[] }> = {
  [K in keyof TFilter]?:
    | string
    | string[]
    | { [K in "all" | "not" | "any" | "none"]?: string[] };
};

export type PagefindSortOrder = "asc" | "desc";

export interface PagefindSearchOptions<
  TFilter extends { [key: string]: string[] },
  TSortKey extends string,
> {
  preload?: boolean;
  verbose?: boolean;
  filters?: PagefindFilterQuery<TFilter>;
  sort?: { [K in TSortKey]?: PagefindSortOrder };
}

export interface PagefindSearchResults<
  TFilter extends { [key: string]: string[] },
  TMeta extends { [key: string]: string },
> {
  results: PagefindSearchResult<TFilter, TMeta>[];
  unfilteredResultCount: number;
  filters: { [K in keyof TFilter]: { [value: string]: number } };
  totalFilters: { [K in keyof TFilter]: number };
  timings: {
    preload: number;
    search: number;
    total: number;
  };
}

export interface PagefindSearchResult<
  TFilter extends { [key: string]: string[] },
  TMeta extends { [key: string]: string },
> {
  id: string;
  score: number;
  words: number[];
  data: () => Promise<PagefindSearchFragment<TFilter, TMeta>>;
}

export interface PagefindSearchFragment<
  TFilter extends { [key: string]: string[] },
  TMeta extends { [key: string]: string },
> {
  url: string;
  raw_url?: string;
  content: string;
  raw_content?: string;
  excerpt: string;
  sub_results: PagefindSubResult[];
  word_count: number;
  locations: number[];
  weighted_locations: PagefindWordLocation[];
  filters: TFilter;
  meta: TMeta;
  anchors: PagefindSearchAnchor[];
}

export interface PagefindSubResult {
  title: string;
  url: string;
  locations: number[];
  weighted_locations: PagefindWordLocation[];
  excerpt: string;
  anchor?: PagefindSearchAnchor;
}

export interface PagefindWordLocation {
  weight: number;
  balanced_score: number;
  location: number;
}

export interface PagefindSearchAnchor {
  element: string;
  id: string;
  text?: string;
  location: number;
}

export interface Pagefind<
  TFilter extends { [key: string]: string[] },
  TMeta extends { [key: string]: string },
  TSortKey extends string,
> {
  debouncedSearch: (
    query: string,
    options?: PagefindSearchOptions<TFilter, TSortKey>,
    duration?: number,
  ) => Promise<PagefindSearchResults<TFilter, TMeta> | null>;
  destroy: () => Promise<void>;
  filters: () => Promise<{ [K in keyof TFilter]: string[] }>;
  init: () => Promise<void>;
  mergeIndex: (
    indexPath: string,
    options?: Record<string, unknown>,
  ) => Promise<void>;
  options: (options: PagefindIndexOptions) => Promise<void>;
  preload: (term: string, options?: PagefindIndexOptions) => Promise<void>;
  search: (
    term: string | null,
    options?: PagefindSearchOptions<TFilter, TSortKey>,
  ) => Promise<PagefindSearchResults<TFilter, TMeta>>;
}
