import type { APIRoute } from "astro";
import { link } from "astro-typed-links/link";

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);

  return new Response(`\
User-agent: *
Allow: /
Disallow: ${link("/search")}

Sitemap: ${sitemapURL.href}
  `);
};
