import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import pandacss from "@pandacss/astro";
import { vritePlugin } from "@vrite/sdk/astro";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import solidLables from "vite-plugin-solid-labels";

const { VRITE_ACCESS_TOKEN, VRITE_CONTENT_GROUP_ID } = loadEnv(import.meta.env.MODE, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: "https://blog.wycey.dev",
  output: "server",
  adapter: cloudflare(),
  integrations: [
    pandacss(),
    vritePlugin({
      accessToken: VRITE_ACCESS_TOKEN,
      contentGroupId: VRITE_CONTENT_GROUP_ID,
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    prefetch(),
    sitemap({
      filter: page => !page.startsWith("https://blog.wycey.dev/private"),
    }),
    solidJs(),
  ],
  vite: {
    plugins: [
      solidLables({
        filter: {
          include: "src/components/**/*.{ts,js,tsx,jsx}",
        },
      }),
    ],
  },
});
