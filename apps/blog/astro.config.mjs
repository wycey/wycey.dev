import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import qwikdev from "@qwikdev/astro";
import { vritePlugin } from "@vrite/sdk/astro";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const { VRITE_ACCESS_TOKEN, VRITE_CONTENT_GROUP_ID } = loadEnv(
  import.meta.env.MODE,
  process.cwd(),
  "",
);

// https://astro.build/config
export default defineConfig({
  site: "https://blog.wycey.dev",
  output: "hybrid",
  adapter: cloudflare(),
  prefetch: {
    prefetchAll: true,
  },
  integrations: [
    vritePlugin({
      accessToken: VRITE_ACCESS_TOKEN,
      contentGroupId: VRITE_CONTENT_GROUP_ID,
    }),
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
          disallow: "/",
        },
      ],
    }),
    qwikdev({
      include: ["**/qwik/*"],
    }),
    solid({
      include: ["**/solid/*"],
    }),
  ],
});
