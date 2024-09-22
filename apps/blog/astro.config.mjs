import { esbuildDecorators } from "@anatine/esbuild-decorators";
import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import qwikdev from "@qwikdev/astro";
//import { imageService as unpicImageService } from "@unpic/astro/service";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import { analyzer } from "vite-bundle-analyzer";
import removeConsole from "vite-plugin-remove-console";
import topLevelAwait from "vite-plugin-top-level-await";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.wycey.dev",
  output: "hybrid",
  adapter: cloudflare({
    imageService: "compile",
    wasmModuleImports: true,
    runtime: {
      mode: "local",
      type: "pages",
      bindings: {
        CACHE_KV: {
          type: "kv",
        },
      },
    },
  }),
  image: {
    domains: ["blog.wycey.dev", "images.microcms-assets.io"],
    remotePatterns: [{ protocol: "https" }],
    //service: unpicImageService(),
  },
  prefetch: {
    prefetchAll: true,
  },
  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap({
      filter: (page) => !page.startsWith("https://blog.wycey.dev/private"),
    }),
    robotsTxt({
      policy: [
        {
          userAgent: "*",
          //allow: "/",
          disallow: ["/", "/private", "/search", "/preview"],
        },
      ],
    }),
    qwikdev({
      exclude: "**/solid/**/*",
    }),
    solid({
      include: "**/solid/**/*",
    }),
  ],
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
    plugins: [
      topLevelAwait(),
      removeConsole({
        includes: ["log", "debug"],
      }),
      import.meta.env.MODE === "analyze" &&
        analyzer({
          analyzerMode: "server",
          analyzerPort: "auto",
        }),
    ],
  },
});
