import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

import baseConfig from "../../eslint.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const ignores = ["server", "functions/**/*.js"];

export default [
  ...baseConfig,
  {
    ignores,
  },
  ...compat.extends("plugin:qwik/recommended"),
  {
    rules: {
      "no-console": "warn",
    },
  },
  {
    files: ["src/routes/**/*.{j,t}s{,x}"],
    plugins: {
      unicorn,
    },
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
        },
      ],
    },
  },
  {
    files: ["src/components/**/*.{j,t}s{,x}"],
    plugins: {
      unicorn,
    },
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            pascalCase: true,
            kebabCase: true,
            camelCase: true,
          },
        },
      ],
    },
  },
  {
    files: ["src/service-worker.ts"],
    languageOptions: {
      globals: globals.serviceworker,
    },
  },
];
