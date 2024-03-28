import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";

import radixColorsPreset from "pandacss-preset-radix-colors";

import { conditions } from "./src/styles/conditions";
import { globalCss } from "./src/styles/global";
import { semanticTokens, tokens } from "./src/styles/tokens";

const createParkUIFilteredPreset = () => {
  const {
    globalCss: _1,
    theme: {
      extend: {
        semanticTokens: _2,
        tokens: { colors: _3, fonts: _4, ...themeExtendTokens },
        ...themeExtend
      },
    },
    ...root
  } = createPreset();

  return {
    ...root,
    theme: {
      extend: {
        ...themeExtend,
        tokens: themeExtendTokens,
      },
    },
  };
};

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: [
    radixColorsPreset({
      darkMode: true,
      autoP3: true,
      colorScales: [
        // Primary
        "violet",
        // Accent
        "iris",
        // Info
        "indigo",
        // Warning / Pending
        "amber",
        // Danger / Error / Rejected
        "red",
        // Success / Valid
        "green",
        // Gray scale
        "mauve",
      ],
    }),
    "@pandacss/preset-base",
    createParkUIFilteredPreset(),
  ],

  globalCss,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx,astro}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens,
      semanticTokens,
    },
  },

  conditions: {
    extend: conditions,
  },

  hash: {
    cssVar: false,
    className: true,
  },

  lightningcss: true,

  browserslist: [">= 0.25%", "not dead"],

  importMap: {
    css: "@style/css",
    recipes: "@style/recipes",
    patterns: "@style/patterns",
    jsx: "@style/jsx",
  },

  jsxFramework: "solid",

  jsxFactory: "styled",
  jsxStyleProps: "minimal",

  // The output directory for your css system
  outdir: "styled-system",
});
