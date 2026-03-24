import { getImage } from "astro:assets";
import { type CollectionEntry, getEntry } from "astro:content";
import { link } from "astro-typed-links/link";
import type { Dayjs } from "dayjs";
import type {
  AboutPage,
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  ItemList,
  ListItem,
  Organization,
  Person,
  WebPage,
  WebSite,
} from "schema-dts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { parseDate } from "@/lib/content/date";
import { markdownToReadableString } from "@/lib/content/markdown";
import { truncateString } from "@/lib/utils/strings";

export const createPublisherSchema = (): Organization => ({
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Wycey",
  url: "https://wycey.dev",
  logo: {
    "@type": "ImageObject",
    url: new URL("/logo.svg", SITE_URL).href,
  },
});

export const createWebSiteSchema = (): WebSite => {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ja",
    publisher: createPublisherSchema(),
  };
};

export const createAuthorSchema = async ({
  id,
  data: author,
}: CollectionEntry<"authors">): Promise<Person> => {
  const avatarImage = author.avatar
    ? await getImage({ src: author.avatar, inferSize: true })
    : undefined;

  return {
    "@type": "Person",
    name: author.name,
    url: new URL(
      link("/@[handle]", {
        params: {
          handle: id,
        },
      }),
      SITE_URL,
    ).href,
    ...(author.bio
      ? {
          description: author.bio,
        }
      : {}),
    ...(author.avatar && avatarImage
      ? {
          image: {
            "@id": new URL(
              link("/@[handle]", {
                params: { handle: id },
                hash: "avatar",
              }),
              SITE_URL,
            ).href,
            "@type": "ImageObject",
            url: new URL(avatarImage.src, SITE_URL).href,
            ...(avatarImage.options.width == null
              ? {}
              : { width: avatarImage.options.width }),
            ...(avatarImage.options.height == null
              ? {}
              : { height: avatarImage.options.height }),
          },
        }
      : {}),
    ...(author.socialLinks
      ? {
          sameAs: author.socialLinks.map((link) => {
            switch (link.type) {
              case "website":
                return link.url;

              case "x":
                return `https://x.com/${link.username}`;

              case "github":
                return `https://github.com/${link.username}`;

              default:
                return link; // should be unreachable
            }
          }),
        }
      : {}),
  };
};

export const createArticleListSchema = (
  articles: CollectionEntry<"articles">[],
): ItemList => ({
  "@type": "ItemList",
  itemListElement: articles.map(
    (article, i): ListItem => ({
      "@type": "ListItem",
      position: i + 1,
      url: new URL(
        link("/articles/[category]/[slug]", {
          params: {
            category: article.data.category.id,
            slug: article.id,
          },
        }),
        SITE_URL,
      ).href,
      name: article.data.title,
    }),
  ),
});

export const createAuthorArticlesSchema = async (
  author: CollectionEntry<"authors">,
  articles: CollectionEntry<"articles">[],
): Promise<[Person, CollectionPage, BreadcrumbList, WebSite]> => {
  const authorUrl = new URL(
    link("/@[handle]", {
      params: {
        handle: author.id,
      },
    }),
    SITE_URL,
  ).href;

  return [
    await createAuthorSchema(author),
    {
      "@type": "CollectionPage",
      name: `${author.data.name}の執筆記事一覧`,
      description: `${author.data.name}が執筆した記事の一覧です。`,
      url: authorUrl,
      ...(articles
        ? {
            mainEntity: createArticleListSchema(articles),
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${author.data.name} (@${author.id})`,
          item: authorUrl,
        },
      ],
    },
    createWebSiteSchema(),
  ];
};

export const createArchiveArticlesSchema = (
  articles: CollectionEntry<"articles">[],
): [CollectionPage, BreadcrumbList, WebSite] => {
  const articlesUrl = new URL(link("/articles"), SITE_URL).href;

  return [
    {
      "@type": "CollectionPage",
      name: `アーカイブ`,
      description: `全ての記事の一覧です。`,
      url: articlesUrl,
      ...(articles
        ? {
            mainEntity: createArticleListSchema(articles),
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "記事",
          item: articlesUrl,
        },
      ],
    },
    createWebSiteSchema(),
  ];
};

export const createCategoriesSchema = (
  { id, data: category }: CollectionEntry<"categories">,
  articles?: CollectionEntry<"articles">[],
): [CollectionPage, BreadcrumbList, WebSite] => {
  const categoryUrl = new URL(
    link("/articles/[category]", {
      params: {
        category: id,
      },
    }),
    SITE_URL,
  ).href;

  return [
    {
      "@type": "CollectionPage",
      name: `${category.name}の記事一覧`,
      description: `${category.name}に関する記事の一覧です。`,
      url: categoryUrl,
      ...(articles
        ? {
            mainEntity: createArticleListSchema(articles),
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "記事",
          item: new URL(link("/articles"), SITE_URL).href,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category.name,
          item: categoryUrl,
        },
      ],
    },
    createWebSiteSchema(),
  ] as const;
};

export const createArticleSchema = async (
  { id, data: article, body }: CollectionEntry<"articles">,
  updatedAt: Dayjs,
): Promise<[BlogPosting, BreadcrumbList, CollectionPage, WebSite]> => {
  const author = await getEntry(article.author);
  const category = await getEntry(article.category);
  const publishedAt = article.publishedAt
    ? parseDate(article.publishedAt)
    : undefined;

  if (!category) {
    throw new Error(
      `Category '${article.category.id}' not found for article '${article.title}'`,
    );
  }

  const articleUrl = new URL(
    link("/articles/[category]/[slug]", {
      params: {
        category: article.category.id,
        slug: id,
      },
    }),
    SITE_URL,
  ).href;

  return [
    {
      "@type": "BlogPosting",
      headline: article.title,
      url: articleUrl,
      ...(publishedAt ? { datePublished: publishedAt.toISOString() } : {}),
      description: truncateString(await markdownToReadableString(body)),
      dateModified: updatedAt.toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl,
      },
      ...(author
        ? {
            author: [await createAuthorSchema(author)],
          }
        : {}),
      publisher: { "@id": `${SITE_URL}/#organization` },
      image: {
        "@type": "ImageObject",
        url: new URL(`/og/${article.category.id}/${id}.png`, SITE_URL).href,
        width: "1200px",
        height: "630px",
      },
      articleSection: category.data.name,
      ...(article.tags
        ? {
            keywords: article.tags.join(", "),
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "記事",
          item: new URL(link("/articles"), SITE_URL).href,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category.data.name,
          item: new URL(
            link("/articles/[category]", {
              params: {
                category: id,
              },
            }),
            SITE_URL,
          ).href,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: article.title,
          item: articleUrl,
        },
      ],
    },
    createCategoriesSchema(category)[0],
    createWebSiteSchema(),
  ] as const;
};

export const createAboutPageSchema = (): [AboutPage, WebSite] => {
  const aboutUrl = new URL(link("/about"), SITE_URL).href;

  return [
    {
      "@type": "AboutPage",
      "@id": aboutUrl,
      name: `${SITE_NAME} について`,
      url: aboutUrl,
      description: "当サイトについての情報を掲載しています。",
      inLanguage: "ja",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    createWebSiteSchema(),
  ];
};

export const createHomePageSchema = (
  currentPage: number,
): [WebPage, WebSite] => {
  const pageUrl =
    currentPage === 1
      ? SITE_URL
      : link("/[...page]", {
          params: {
            page: `${currentPage}`,
          },
        });

  return [
    {
      "@type": "WebPage",
      "@id": pageUrl,
      name: SITE_NAME,
      url: pageUrl,
      description: SITE_DESCRIPTION,
      inLanguage: "ja",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    createWebSiteSchema(),
  ];
};
