import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import pandacss from "@pandacss/astro";
import { vritePlugin } from "@vrite/sdk/astro";
import { loadEnv } from "vite";
import partytown from "@astrojs/partytown";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
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
  ],
});
