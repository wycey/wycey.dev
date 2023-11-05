import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import unicorn from "eslint-plugin-unicorn";

import baseConfig from "../../eslint.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const ignores = [".astro"];

export default [
  ...baseConfig,
  {
    ignores,
  },
  ...compat.extends("plugin:astro/recommended"),
  {
    rules: {
      "no-console": "warn",
    },
  },
  {
    files: ["src/pages/**/*.{j,t}s{,x}"],
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
];
