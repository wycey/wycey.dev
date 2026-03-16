import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import type { RemarkEmbedderOptions } from "@remark-embedder/core";
import type { AstroIntegration } from "astro";

type Cache = RemarkEmbedderOptions["cache"] & {
  save(): Promise<void>;
};

export const createCache = (path: string): Cache => {
  const cache = (() => {
    try {
      return JSON.parse(readFileSync(path, "utf-8")) as {
        [key: string]: string;
      };
    } catch (_) {
      // Failed to read or parse cache file; treat as missing and start with an empty cache
    }

    return {};
  })();

  return {
    async get(key: string) {
      return cache[key];
    },

    async set(key: string, value: string) {
      cache[key] = value;
    },

    async save() {
      const sorted: Record<string, string> = {};

      Object.keys(cache)
        .sort()
        .forEach((key) => {
          sorted[key] = cache[key];
        });

      await writeFile(path, JSON.stringify(sorted, null, 2));
    },
  };
};

export const cacheSaveIntegration = (cache: Cache): AstroIntegration => {
  return {
    name: "cache-save",
    hooks: {
      "astro:build:generated": async () => {
        await cache.save();
      },
    },
  };
};
