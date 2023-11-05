import { stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { default as config, createTsParser, createTsConfig } from "./packages/eslint-config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ignores = ["**/node_modules/*", "dist", "apps/*/functions/**/*.js", "apps/web/server", "apps/blog/.astro"];

const project = ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json", "./tsconfig.eslint.json"];

const exists = async path => {
  try {
    await stat(path);

    return true;
  } catch (_) {
    return false;
  }
};

if (await exists(resolve("./tsconfig.json"))) {
  project.unshift(resolve("./tsconfig.json"));
}

export default [
  ...config,
  {
    ignores,
  },
  ...createTsConfig(__dirname, project),
];
