import { type ParsedArticle, client } from "@/lib/client.ts";
import { rehypeExtractHeadings } from "@/lib/rehype/extract-headings.ts";
import { trimSurrounding } from "@/utils/strings.ts";
import rehypeSectionize from "@hbsnow/rehype-sectionize";
import type { MarkdownHeading } from "astro";
import type { MicroCMSImage } from "microcms-js-sdk";
import { rehype } from "rehype";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeRewrite from "rehype-rewrite";
import rehypeSlug from "rehype-slug";
import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  ImageObject,
  WithContext,
} from "schema-dts";

export const getStaticPaths = async () => {
  const data = await client.getList({
    endpoint: "blogs",
    queries: { fields: ["id", "category"] },
  });

  return {
    paths: data.contents.map(({ id, category }) => ({
      params: {
        slug: id,
        category: category.id,
      },
    })),
    fallback: true,
  };
};

export const getArticleList = async (config?: {
  offset?: number;
  limit?: number;
}) => {
  const { offset = 0, limit = 10 } = config || {};

  const data = await client.getList({
    endpoint: "blogs",
    queries: {
      fields: ["id", "title", "category", "subCategory", "createdAt"],
      offset,
      limit,
    },
  });

  return data.contents;
};

export const getArticleWithoutCache = async (slug: string) =>
  client.getListDetail({
    endpoint: "blogs",
    contentId: slug,
  });

export const getPreviewArticle = async (id: string, key: string) =>
  await client.getListDetail({
    endpoint: "blogs",
    contentId: id,
    queries: { draftKey: key },
  });

export const createAuthorUrl = (handle: string) => `/@${handle}`;

const microCMSImageToImageObject = (image: MicroCMSImage): ImageObject => ({
  "@type": "ImageObject",
  url: image.url,
  width: `${image.width}`,
  height: `${image.height}`,
});

export const createArticleSchema = (
  article: ParsedArticle,
): [WithContext<BlogPosting>, WithContext<BreadcrumbList>] => {
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      datePublished: article.createdAt,
      dateModified: article.updatedAt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://blog.wycey.dev/${article.category.id}/${article.id}`,
      },
      url: `https://blog.wycey.dev/${article.category.id}/${article.id}`,
      ...(article.cover
        ? {
            image: microCMSImageToImageObject(article.cover),
          }
        : {}),
      author: [
        {
          "@type": "Person",
          name: article.author.name,
          description: article.author.bio,
          url: `https://blog.wycey.dev/${createAuthorUrl(
            article.author.handle,
          )}`,
          ...(article.author.avatar
            ? {
                image: microCMSImageToImageObject(article.author.avatar),
              }
            : {}),
        },
      ],
      publisher: {
        "@type": "Organization",
        name: "Wycey",
        url: "https://wycey.dev",
        logo: {
          "@type": "ImageObject",
          url: "https://blog.wycey.dev/logo.svg",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://blog.wycey.dev/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: article.category.name,
          item: `https://blog.wycey.dev/${article.category.id}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: `https://blog.wycey.dev/${article.category.id}/${article.id}`,
        },
      ],
    },
  ] as const;
};

const editors = {
  applyTabindexToHeadings: (node: import("hast").Element) => {
    if (node.tagName.match(/h[1-6]/)) {
      node.properties = {
        ...node.properties,
        tabindex: -1,
      };
    }
  },
  inlineMathToCode: (
    node: import("hast").Element,
    parent?: import("hast").Root | import("hast").Element,
  ) => {
    if (node.tagName !== "code") return;
    if (parent && parent.type === "element" && parent.tagName === "pre") return;
    if (!node.children || node.children.length !== 1) return;

    const child = node.children[0];

    if (child.type !== "text") return;

    const value = child.value;

    if (!(value.startsWith("$") && value.endsWith("$"))) return;

    child.value = trimSurrounding(value, "$");

    if (!node.properties.className) {
      node.properties.className = [];
    }

    (node.properties.className as string[]).push("language-math");
  },
  addCodeType: (node: import("hast").Element) => {
    if (node.tagName === "pre") {
      for (const child of node.children
        .filter((child) => child.type === "element")
        // FIXME: Remove in TypeScript 5.5
        .map((child) => child as unknown as import("hast").Element)) {
        if (child.tagName !== "code") continue;

        child.properties.dataCodeType = "block";

        if ("className" in child.properties && child.properties.className) {
          const language = (child.properties.className as string[]).find((c) =>
            c.startsWith("language-"),
          );

          if (language) {
            node.properties = {
              ...node.properties,
              lang: language.replace("language-", ""),
            };
          }
        }

        node.properties.dataCode = "true";
      }
    }

    if (node.tagName === "code" && !("dataCodeType" in node.properties)) {
      node.properties.dataCodeType = "inline";
    }
  },
  addFilenameAtBlockCode: (
    node: import("hast").Element,
    parent?: import("hast").Root | import("hast").Element,
  ) => {
    if (
      node.tagName !== "pre" ||
      !parent ||
      parent.type !== "element" ||
      parent.tagName !== "div"
    )
      return;

    const filename = parent.properties.dataFilename;

    if (!filename || typeof filename !== "string") return;

    parent.tagName = "figure";
    parent.properties.dataFigureType = "code";

    const figcaption: import("hast").Element = {
      type: "element",
      tagName: "figcaption",
      properties: {},
      children: [
        {
          type: "element",
          tagName: "span",
          properties: { className: ["filename"] },
          children: [{ type: "text", value: filename }],
        },
      ],
    };

    parent.children.unshift(figcaption);
  },
} as const;

export const processHtml = async (html: string) => {
  const headings: MarkdownHeading[] = [];

  const rehypeProcessedHtml = await rehype()
    .data("settings", { fragment: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      content: {
        type: "element",
        tagName: "span",
        properties: { className: ["heading-link"] },
        children: [],
      },
    })
    .use(rehypeRewrite, {
      rewrite: (node, _, parent) => {
        if (node.type !== "element") return;

        editors.applyTabindexToHeadings(node);
        editors.inlineMathToCode(node, parent);
        editors.addCodeType(node);
        editors.addFilenameAtBlockCode(node, parent);
      },
    })
    .use(rehypeKatex)
    .use(rehypeExtractHeadings, { headings })
    .use(rehypeSectionize)
    .process(html);

  return [rehypeProcessedHtml.toString(), headings] as const;
};
