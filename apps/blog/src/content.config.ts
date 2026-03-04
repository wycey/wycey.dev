import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import {
  GITHUB_USERNAME_REGEX,
  SLUG_REGEX,
  X_USERNAME_REGEX,
} from "./lib/constants";

const categories = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./content/categories" }),
  schema: z.object({
    name: z.string(),
    tags: z
      .array(
        z.object({
          name: z.string(),
          slug: z
            .string()
            .regex(
              SLUG_REGEX,
              "Tag slugs must be lowercase and can only contain letters, numbers, and hyphens",
            ),
        }),
      )
      .optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./content/authors" }),
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
    avatar: z.url({ protocol: /^https?$/ }).optional(),
    socialLinks: z
      .array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("website"),
            url: z.httpUrl(),
          }),
          z.object({
            type: z.literal("x"),
            username: z
              .string()
              .regex(
                X_USERNAME_REGEX,
                "X (Twitter) usernames must follow the rules for X username",
              ),
          }),
          z.object({
            type: z.literal("github"),
            username: z
              .string()
              .regex(
                GITHUB_USERNAME_REGEX,
                "GitHub usernames must follow the rules for GitHub username",
              ),
          }),
        ]),
      )
      .optional(),
  }),
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
  schema: z.object({
    title: z.string(),
    author: reference("authors"),
    category: reference("categories"),
    tags: z.array(z.string()).default([]),
    publishedAt: z.iso.date().optional(),
    pinned: z.boolean().default(false),
    relatedPosts: z.array(reference("articles")).default([]),

    /* 内部で利用 */
    prevTitle: z.string().default(""),
    prevId: z.string().default(""),
    nextTitle: z.string().default(""),
    nextId: z.string().default(""),
    minutesRead: z.string().default(""),
    words: z.number().default(0),
  }),
});

export const collections = { articles, authors, categories };
