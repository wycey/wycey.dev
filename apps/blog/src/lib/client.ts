import { QueryClient } from "@tanstack/solid-query";
import { type MicroCMSImage, createClient } from "microcms-js-sdk";

import type { MarkdownHeading } from "astro";
import type {
  MicroCMSRelation,
  MicroCMSSchemaInfer,
  MicroCMSTsClient,
} from "microcms-ts-sdk";
import type { Except, Merge } from "type-fest";

export type Content = {
  fieldId: "richEditor" | "html";
  body: string;
};

export interface SocialLink {
  type: "website" | "github" | "gitlab" | "email" | "twitter" | "fediverse";
  body: string;
}

export interface Editor {
  name: string;
  handle: string;
  bio?: string;
  avatar?: MicroCMSImage;
  socialLinks?: SocialLink[];
}

export interface Category {
  name: string;
}

export interface SubCategory {
  parent: Category;
  name: string;
}

interface ArticleSchema {
  title: string;
  author: Editor;
  cover?: MicroCMSImage;
  content: Content[];
  category: MicroCMSRelation<Category>;
  subCategory: SubCategory;
}

export interface Endpoints {
  list: {
    blogs: ArticleSchema;
    editors: Editor;
    categories: Category;
  };
}

export const client = createClient({
  serviceDomain: "wycey",
  apiKey: import.meta.env.PUBLIC_MICROCMS_API_KEY,
}) as Except<MicroCMSTsClient<Endpoints>, "getAll">;

export type Article = MicroCMSSchemaInfer<MicroCMSTsClient<Endpoints>>["blogs"];

export type ParsedArticle = Merge<
  Article,
  {
    content: string;
    headings: MarkdownHeading[];
  }
>;

export const queryClient = new QueryClient();
