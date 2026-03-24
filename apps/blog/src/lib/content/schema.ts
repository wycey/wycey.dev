import { createReference } from "astro/content/runtime";
import { z } from "zod/v4";
import {
  GITHUB_USERNAME_REGEX,
  SLUG_REGEX,
  X_USERNAME_REGEX,
} from "../constants";

// Make reference usable outside of content config
const reference =
  createReference() as unknown as typeof import("astro:content").reference;

export const categoriesSchema = z.object({
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
});

export const authorsSchema = z.object({
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
});

export const articlesSchema = z.object({
  title: z.string().default("Untitled Article"), // H1 is used for title
  author: reference("authors"),
  category: reference("categories"),
  tags: z.array(z.string()).default([]),
  publishedAt: z.iso.date().optional(),
  pinned: z.boolean().default(false),
  relatedPosts: z.array(reference("articles")).default([]),

  /* Used internally */
  prevId: z.string().default(""),
  nextId: z.string().default(""),
});

export const pagefindMetaSchema = z.object({
  title: z.string(),
  image: z.string().exactOptional(),
  publishedAt: z.string(),
  avatar: z.string(),
  readingTime: z.string(),
  wordCount: z.string(),
});

export type PagefindMeta = z.infer<typeof pagefindMetaSchema>;

export const pagefindFilterSchema = z.object({
  author: z.tuple([z.string()]),
  category: z.tuple([z.string()]),
  tags: z.array(z.string()).default([]),
});

export type PagefindFilter = z.infer<typeof pagefindFilterSchema>;

export const pagefindSortSchema = z.union([
  z.literal("publishedAt"),
  z.literal("updatedAt"),
]);

export type PagefindSort = z.infer<typeof pagefindSortSchema>;
