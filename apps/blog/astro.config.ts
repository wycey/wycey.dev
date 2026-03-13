import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCodeCaption } from "@fujocoded/expressive-code-caption";
import rehypeFigureCaption from "@ljoss/rehype-figure-caption";
import rehypeTypst from "@myriaddreamin/rehype-typst";
import remarkEmbedder, {
  type RemarkEmbedderOptions,
} from "@remark-embedder/core";
import oEmbedTransformer, {
  type Config as OEmbedTransformerConfig,
} from "@remark-embedder/transformer-oembed";
import sentry from "@sentry/astro";
import type { AstroIntegration } from "astro";
import { defineConfig, envField, sharpImageService } from "astro/config";
import expressiveCode from "astro-expressive-code";
import minifyHtml from "astro-minify-html-swc";
import robotsTxt from "astro-robots-txt";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import rehypeAutolinkHeadings, {
  type Options as RehypeAutolinkHeadingsOptions,
} from "rehype-autolink-headings";
import rehypeCallouts, {
  type UserOptions as RehypeCalloutsOptions,
} from "rehype-callouts";
import rehypeExternalLinks, {
  type Options as RehypeExternalLinksOptions,
} from "rehype-external-links";
import rehypeMermaid, { type RehypeMermaidOptions } from "rehype-mermaid";
import rehypeOGCard, { type RehypeOGCardOptions } from "rehype-og-card";
import rehypeSlug from "rehype-slug";
import remarkCjkFriendly from "remark-cjk-friendly";
import remarkGfmStrikethroughCjkFriendly from "remark-cjk-friendly-gfm-strikethrough";
import remarkEmoji, { type RemarkEmojiOptions } from "remark-emoji";
import remarkMath from "remark-math";
import remarkNormalizeHeadings from "remark-normalize-headings";
import remarkSectionize from "remark-sectionize";
import { createGenerator } from "unocss";
import unoCSS from "unocss/astro";
import removeConsole from "vite-plugin-remove-console";
import {
  type RehypeBudouxOptions,
  rehypeBudoux,
  rehypeFancybox,
  rehypeRecordHeadings,
  rehypeTypstMathDisplay,
  remarkHeading1ToTitle,
  remarkLastModified,
} from "./src/lib/content/unified";
import unoConfig from "./uno.config";

type Cache = RemarkEmbedderOptions["cache"] & {
  save(): Promise<void>;
};

const createCache = (path: string): Cache => {
  const cache = (() => {
    try {
      return JSON.parse(readFileSync(path, "utf-8")) as {
        [key: string]: string;
      };
    } catch (_) {
      // Failed to read or parse cache file; treat as missing and start with an empty cache
    }

    return {};
  })();

  return {
    async get(key: string) {
      return cache[key];
    },

    async set(key: string, value: string) {
      cache[key] = value;
    },

    async save() {
      const sorted: Record<string, string> = {};

      Object.keys(cache)
        .sort()
        .forEach((key) => {
          sorted[key] = cache[key];
        });

      await writeFile(path, JSON.stringify(sorted, null, 2));
    },
  };
};

const cacheSave = (cache: Cache): AstroIntegration => {
  return {
    name: "cache-save",
    hooks: {
      "astro:build:generated": async () => {
        await cache.save();
      },
    },
  };
};

const remarkEmbedderCache = createCache(
  "./node_modules/.astro/remark-embedder.json",
);

const unoCtx = await createGenerator(unoConfig);

// https://astro.build/config
export default defineConfig({
  site: "https://blog.wycey.dev",
  output: "static",
  adapter: cloudflare({
    imageService: {
      build: "compile",
      runtime: "cloudflare-binding",
    },
    prerenderEnvironment: "node",
  }),
  trailingSlash: "never",
  build: {
    assets: "_assets",
    inlineStylesheets: "always",
  },
  server: {
    open: true,
  },
  image: {
    domains: ["blog.wycey.dev", "static.wycey.dev"],
    remotePatterns: [{ protocol: "https" }],
    responsiveStyles: true,
    layout: "constrained",
    service: sharpImageService({ kernel: "mks2021" }),
  },
  devToolbar: {
    enabled: false,
  },
  prefetch: false, // https://github.com/withastro/astro/issues/15520
  env: {
    schema: {
      GA_MEASUREMENT_ID: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      SENTRY_DSN: envField.string({
        context: "client",
        access: "public",
        optional: true,
        url: true,
      }),
    },
  },
  integrations: [
    react({
      include: ["**/react/*"],
    }),
    solid({
      include: ["**/solid/*"],
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    minifyHtml(),
    sitemap(),
    robotsTxt({
      policy: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/search"],
        },
      ],
    }),
    sentry({
      telemetry: false,
    }),
    unoCSS({
      injectReset: true,
    }),
    expressiveCode({
      plugins: [pluginLineNumbers(), pluginCodeCaption()],
      themes: ["catppuccin-mocha", "catppuccin-latte"],
      defaultProps: {
        wrap: true,
        overridesByLang: {
          shellsession: {
            showLineNumbers: false,
            wrap: false,
          },
        },
      },
      styleOverrides: {
        borderColor: unoCtx.config.theme.colors.border.subtle,
      },
    }),
    cacheSave(remarkEmbedderCache),
  ],
  vite: {
    build: {
      //cssMinify: "lightningcss", TODO: Enable when the build issue with LightningCSS is resolved
    },
    css: {
      lightningcss: {
        targets: browserslistToTargets(browserslist()),
      },
    },
    plugins: [
      import.meta.env.PROD &&
        removeConsole({
          includes: ["log", "debug"],
        }),
    ],
  },
  markdown: {
    remarkPlugins: [
      remarkNormalizeHeadings,
      remarkHeading1ToTitle,
      remarkLastModified,
      [
        remarkEmoji,
        {
          accessible: true,
        } satisfies RemarkEmojiOptions,
      ],
      remarkMath,
      [
        // @ts-expect-error remarkEmbedder without .default causes type error, but with .default it works. This might be an issue with the type definitions of remarkEmbedder
        remarkEmbedder.default,
        {
          cache: remarkEmbedderCache,
          transformers: [
            [
              // @ts-expect-error Same as above regarding .default
              oEmbedTransformer.default,
              {
                params: {
                  lang: "ja",
                  omit_script: true,
                  dnt: true,
                },
              } satisfies OEmbedTransformerConfig,
            ],
          ],
        } satisfies RemarkEmbedderOptions,
      ],
      remarkCjkFriendly,
      remarkGfmStrikethroughCjkFriendly,
      remarkSectionize,
    ],
    remarkRehype: {
      footnoteLabel: "脚注",
      footnoteLabelProperties: {
        "data-footnote-label": "",
      },
      footnoteBackContent: "↩\u{FE0E}",
    },
    rehypePlugins: [
      rehypeSlug,
      rehypeRecordHeadings,
      [
        rehypeOGCard,
        {
          buildCache: true,
          buildCachePath: "./node_modules/.astro",
          enableSameTextURLConversion: true,
          serverCache: true,
          openInNewTab: true,
          serverCachePath: "./public",
        } satisfies RehypeOGCardOptions,
      ],
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["nofollow", "noreferrer"],
          content: {
            type: "element",
            tagName: "span",
            properties: {
              "aria-hidden": "true",
              "data-external-link-icon": "",
            },
            children: [],
          },
          test: (el, index, parent) => {
            if (
              parent &&
              parent.type === "element" &&
              parent.tagName === "div" &&
              parent.children.length === 1 &&
              (
                (parent.properties.className as string[] | undefined) ?? []
              ).includes("og-card-container") &&
              index === 0
            ) {
              return false;
            }

            return el.tagName === "a";
          },
        } satisfies RehypeExternalLinksOptions,
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            ariaHidden: "true",
            tabIndex: -1,
            dataAutolink: "",
          },
          content: {
            type: "element",
            tagName: "span",
            properties: {
              className: ["icon"],
            },
            children: [],
          },
        } satisfies RehypeAutolinkHeadingsOptions,
      ],
      rehypeFigureCaption,
      rehypeFancybox,
      [
        rehypeCallouts,
        {
          theme: "obsidian",
          callouts: {
            note: {
              title: "ノート",
            },
            abstract: {
              title: "概要",
            },
            summary: {
              title: "要約",
            },
            tldr: {
              title: "TL;DR",
            },
            info: {
              title: "情報",
            },
            todo: {
              title: "ToDo",
            },
            tip: {
              title: "ヒント",
            },
            hint: {
              title: "ヒント",
            },
            important: {
              title: "重要",
            },
            success: {
              title: "成功",
            },
            check: {
              title: "チェック",
            },
            done: {
              title: "完了",
            },
            question: {
              title: "質問",
            },
            faq: {
              title: "FAQ",
            },
            warning: {
              title: "警告",
            },
            attention: {
              title: "注意",
            },
            caution: {
              title: "注意",
            },
            failure: {
              title: "失敗",
            },
            missing: {
              title: "不足",
            },
            fail: {
              title: "失敗",
            },
            danger: {
              title: "危険",
            },
            error: {
              title: "エラー",
            },
            bug: {
              title: "バグ",
            },
            example: {
              title: "例",
            },
            quote: {
              title: "引用",
            },
            cite: {
              title: "引用",
            },
          },
        } satisfies RehypeCalloutsOptions,
      ],
      [
        rehypeBudoux,
        {
          include: ["h1", "h2", "h3", "h4", "h5", "h6", "figcaption"],
        } satisfies RehypeBudouxOptions,
      ],
      [
        rehypeMermaid,
        {
          strategy: "pre-mermaid",
        } satisfies RehypeMermaidOptions,
      ],
      rehypeTypst,
      rehypeTypstMathDisplay,
    ],
  },
  experimental: {
    contentIntellisense: true,
    svgo: true,
    clientPrerender: true,
  },
});
