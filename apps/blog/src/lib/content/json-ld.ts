import { getImage } from "astro:assets";
import { type CollectionEntry, getEntry } from "astro:content";
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
import { createAuthorUrl, markdownToReadableString } from "@/lib/content";
import { parseDate } from "@/lib/content/date";
import { truncateString } from "@/lib/utils/strings";

export const createPublisherSchema = (): Organization => ({
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Wycey",
  url: "https://wycey.dev",
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.svg`,
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
    url: `${SITE_URL}/${createAuthorUrl(id)}`,
    ...(author.bio
      ? {
          description: author.bio,
        }
      : {}),
    ...(author.avatar && avatarImage
      ? {
          image: {
            "@id": `${SITE_URL}/${createAuthorUrl(id)}#avatar`,
            "@type": "ImageObject",
            url: new URL(avatarImage.src, SITE_URL).href,
            ...(avatarImage.options.width != null
              ? { width: avatarImage.options.width }
              : {}),
            ...(avatarImage.options.height != null
              ? { height: avatarImage.options.height }
              : {}),
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
      url: `${SITE_URL}/articles/${article.data.category.id}/${article.id}`,
      name: article.data.title,
    }),
  ),
});

export const createAuthorArticlesSchema = async (
  author: CollectionEntry<"authors">,
  articles: CollectionEntry<"articles">[],
): Promise<[Person, CollectionPage, BreadcrumbList, WebSite]> => [
  await createAuthorSchema(author),
  {
    "@type": "CollectionPage",
    name: `${author.data.name}の執筆記事一覧`,
    description: `${author.data.name}が執筆した記事の一覧です。`,
    url: `${SITE_URL}/${createAuthorUrl(author.id)}`,
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
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${author.data.name} (@${author.id})`,
        item: `${SITE_URL}/${createAuthorUrl(author.id)}`,
      },
    ],
  },
  createWebSiteSchema(),
];

export const createArchiveArticlesSchema = (
  articles: CollectionEntry<"articles">[],
): [CollectionPage, BreadcrumbList, WebSite] => [
  {
    "@type": "CollectionPage",
    name: `アーカイブ`,
    description: `全ての記事の一覧です。`,
    url: `${SITE_URL}/articles`,
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
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "記事",
        item: `${SITE_URL}/articles`,
      },
    ],
  },
  createWebSiteSchema(),
];

export const createCategoriesSchema = (
  { id, data: category }: CollectionEntry<"categories">,
  articles?: CollectionEntry<"articles">[],
): [CollectionPage, BreadcrumbList, WebSite] => {
  return [
    {
      "@type": "CollectionPage",
      name: `${category.name}の記事一覧`,
      description: `${category.name}に関する記事の一覧です。`,
      url: `${SITE_URL}/articles/${id}`,
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
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.name,
          item: `${SITE_URL}/articles/${id}`,
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
  const author = await getEntry("authors", article.author.id);
  const category = await getEntry("categories", article.category.id);
  const publishedAt = article.publishedAt
    ? parseDate(article.publishedAt)
    : undefined;

  if (!category) {
    throw new Error(
      `Category '${article.category.id}' not found for article '${article.title}'`,
    );
  }

  const articleUrl = `${SITE_URL}/articles/${article.category.id}/${id}`;

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
        url: `${SITE_URL}/og/${article.category.id}/${id}.png`,
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
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.data.name,
          item: `${SITE_URL}/articles/${article.category.id}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: articleUrl,
        },
      ],
    },
    createCategoriesSchema(category)[0],
    createWebSiteSchema(),
  ] as const;
};

export const createAboutPageSchema = (): [AboutPage, WebSite] => [
  {
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about`,
    name: `${SITE_NAME} について`,
    url: `${SITE_URL}/about`,
    description: `${SITE_NAME} についてのページです。`,
    inLanguage: "ja",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  },
  createWebSiteSchema(),
];

export const createHomePageSchema = (
  currentPage: number,
): [WebPage, WebSite] => [
  {
    "@type": "WebPage",
    "@id": currentPage === 1 ? `${SITE_URL}/` : `${SITE_URL}/${currentPage}`,
    name: SITE_NAME,
    url: currentPage === 1 ? `${SITE_URL}/` : `${SITE_URL}/${currentPage}`,
    description: SITE_DESCRIPTION,
    inLanguage: "ja",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  },
  createWebSiteSchema(),
];
