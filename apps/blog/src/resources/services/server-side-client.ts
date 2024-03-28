import type { ParsedArticle } from "@/lib/client.ts";
import {
  getArticleWithoutCache,
  getPreviewArticle,
  processHtml,
} from "@/resources/content.ts";
import { Cat, Option, Promise as PromiseT, Tuple } from "@mikuroxina/mini-fn";

type CacheObject = {
  response: ParsedArticle;
  cacheTtl: number;
};

export class ServerSideClientService {
  constructor(private rt: Runtime["runtime"]) {}

  private createCacheKey(slug: string) {
    return `article-${slug}`;
  }

  private async tryGetCache(
    key: string,
  ): Promise<Tuple.Tuple<boolean, Option.Option<ParsedArticle>>> {
    const obj = await this.rt.env.CACHE_KV.get<CacheObject>(key, "json");

    if (obj === null) return [true, Option.none()];

    return [obj.cacheTtl < new Date().getTime(), Option.some(obj.response)];
  }

  private async createCache(key: string, response: ParsedArticle) {
    // Cache for 7 days
    const cacheTtl = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);

    await this.rt.env.CACHE_KV.put(
      key,
      JSON.stringify({
        response,
        cacheTtl: new Date(cacheTtl.toISOString()).getTime(),
      } satisfies CacheObject),
      {
        expirationTtl: 60 * 60 * 24 * 365,
      },
    );
  }

  private async tryFetchAndCache(
    key: string,
    slug: string,
    maybeResponse: Option.Option<Promise<ParsedArticle>>,
  ) {
    const response = await Option.unwrapOrElse(() =>
      this.prepareResponse(slug),
    )(maybeResponse);

    await this.createCache(key, response);
  }

  private async prepareResponse(slug: string): Promise<ParsedArticle> {
    const { content: unprocessedContent, ...response } =
      await getArticleWithoutCache(slug);

    const [content, headings] = await processHtml(
      unprocessedContent.map((c) => c.body).join(""),
    );

    return {
      ...response,
      content,
      headings,
    };
  }

  public async get(slug: string): Promise<ParsedArticle> {
    const key = this.createCacheKey(slug);

    const { shouldRevalidate, reuseOldResponse, response } = Cat.cat(
      await this.tryGetCache(key),
    )
      .feed(Tuple.map(Option.map(PromiseT.pure)))
      .feed(([shouldRevalidate, response]) => ({
        shouldRevalidate,
        reuseOldResponse: Option.isNone(response),
        response: Option.unwrapOrElse(() => this.prepareResponse(slug))(
          response,
        ),
      })).value;

    if (shouldRevalidate) {
      this.rt.waitUntil(
        this.tryFetchAndCache(
          key,
          slug,
          Option.fromPredicate<Promise<ParsedArticle>>(() => reuseOldResponse)(
            response,
          ),
        ),
      );
    }

    console.debug("Cache %s: %s", shouldRevalidate ? "miss" : "hit", slug);

    return response;
  }

  public async getPreview(id: string, key: string): Promise<ParsedArticle> {
    const { content: unprocessedContent, ...response } =
      await getPreviewArticle(id, key);

    const [content, headings] = await processHtml(
      unprocessedContent.map((c) => c.body).join(""),
    );

    return {
      ...response,
      content,
      headings,
    };
  }
}
