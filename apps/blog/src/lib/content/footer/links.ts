import { link } from "astro-typed-links/link";

export const footerLinks = [
  {
    name: "Contact",
    href: "mailto:contact@wycey.dev",
  },
  { name: "GitHub", href: "https://github.com/wycey" },
  { name: "RSS", href: link("/rss.xml") },
  { name: "Sitemap", href: "/sitemap-index.xml" },
] as const;
