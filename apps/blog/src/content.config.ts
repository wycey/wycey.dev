import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { SLUG_REGEX } from "./lib/constants";
import {
  articlesSchema,
  authorsSchema,
  categoriesSchema,
} from "./lib/content/schema";

const categories = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./content/categories" }),
  schema: categoriesSchema,
});

const authors = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./content/authors" }),
  schema: authorsSchema,
});

const articles = defineCollection({
  loader: glob({
    pattern: "**/index.{md,mdx}",
    base: "./content/articles",
    generateId: ({ entry }) => {
      const parts = entry.split("/");
      const slug = parts[parts.length - 2];

      if (!SLUG_REGEX.test(slug)) {
        throw new Error(
          `Invalid slug '${slug}' in path '${entry}'. Slugs must be lowercase and can only contain letters, numbers, and hyphens.`,
        );
      }

      return slug;
    },
  }),
  schema: articlesSchema,
});

export const collections = { articles, authors, categories };
