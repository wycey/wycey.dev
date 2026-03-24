/* biome-ignore-all lint/suspicious/noExplicitAny: UnoCSS theme is too complex to type */

import { variantMatcher } from "@unocss/rule-utils";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  transformerAttributifyJsx,
  transformerDirectives,
  type Variant,
} from "unocss";
import { presetAnimations } from "unocss-preset-animations";
import { presetScrollbarHide } from "unocss-preset-scrollbar-hide";

const BASE_PREFIX = "base-";

const SCALES = [
  "primary",
  "secondary",
  "info",
  "warning",
  "error",
  "success",
] as const;

const MISC_SCALES = ["indigo", "amber"] as const;

const createColorVars = (color: string, theme: any) => {
  theme.colors[color] ??= {};

  // solid and alpha scale
  for (let i = 1; i <= 12; i++) {
    theme.colors[color][i] = {
      DEFAULT: `var(--color-${color}-${i})`,
      A: `var(--color-${color}-${i}-A)`,
    };
  }
};

const createAccentColorVars = (color: string, theme: any) => {
  createColorVars(color, theme);

  // semantic tokens

  theme.colors[color].bg = {
    DEFAULT: `var(--color-${color}-bg)`,
    canvas: `var(--color-${color}-bg-canvas)`,
    subtle: `var(--color-${color}-bg-subtle)`,
    hover: `var(--color-${color}-bg-hover)`,
    active: `var(--color-${color}-bg-active)`,
    solid: {
      DEFAULT: `var(--color-${color}-bg-solid)`,
      hover: `var(--color-${color}-bg-hover)`,
    },
  };

  theme.colors[color].border = {
    DEFAULT: `var(--color-${color}-border)`,
    subtle: `var(--color-${color}-border-subtle)`,
    hover: `var(--color-${color}-border-hover)`,
  };

  theme.colors[color].focusRing = `var(--color-${color}-focusRing)`;

  theme.colors[color].fg = {
    DEFAULT: `var(--color-${color}-fg)`,
    solid: `var(--color-${color}-fg-solid)`,
    muted: `var(--color-${color}-fg-muted)`,
  };
};

const createBaseColorVars = (theme: any) => {
  theme.colors.base ??= {};

  // semantic tokens

  theme.colors.base.bg = {
    DEFAULT: `var(--color-base-bg)`,
    canvas: `var(--color-base-bg-canvas)`,
    subtle: `var(--color-base-bg-subtle)`,
    hover: `var(--color-base-bg-hover)`,
    active: `var(--color-base-bg-active)`,
  };

  theme.colors.base.border = {
    DEFAULT: `var(--color-base-border)`,
    subtle: `var(--color-base-border-subtle)`,
    hover: `var(--color-base-border-hover)`,
  };

  theme.colors.base.fg = {
    DEFAULT: `var(--color-base-fg)`,
    muted: `var(--color-base-fg-muted)`,
  };
};

const createAliasColorVars = (theme: any) => {
  // aliases

  theme.colors.bg = {
    DEFAULT: `var(--color-bg)`,
    normal: `var(--color-bg-normal)`,
    subtle: `var(--color-bg-subtle)`,
    hover: `var(--color-bg-hover)`,
    active: `var(--color-bg-active)`,
  };

  theme.colors.border = {
    DEFAULT: `var(--color-border)`,
    hover: `var(--color-border-hover)`,
    subtle: `var(--color-border-subtle)`,
  };

  theme.colors.fg = {
    DEFAULT: `var(--color-fg)`,
    disabled: `var(--color-fg-disabled)`,
    muted: `var(--color-fg-muted)`,
  };
};

const createDataVariant = (
  prefix: string,
  attribute: string,
  selector: string,
): Variant =>
  variantMatcher(`${prefix}${attribute}`, (input) => ({
    selector: `${input.selector}${selector}`,
  }));

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetAnimations(),
    presetAttributify(),
    presetIcons({
      warn: true,
      collections: {
        lucide: () =>
          import("@iconify-json/lucide/icons.json").then((i) => i.default),
      },
    }),
    presetScrollbarHide(),
  ],
  transformers: [transformerDirectives(), transformerAttributifyJsx()],
  variants: [
    createDataVariant(BASE_PREFIX, "open", "[data-open]"),
    createDataVariant(BASE_PREFIX, "closed", "[data-closed]"),
    createDataVariant(BASE_PREFIX, "popup-open", "[data-popup-open]"),
    createDataVariant(
      BASE_PREFIX,
      "horizontal",
      "[createData-orientation='horizontal']",
    ),
    createDataVariant(BASE_PREFIX, "vertical", "[data-orientation='vertical']"),
    createDataVariant(BASE_PREFIX, "disabled", "[data-disabled]"),
    createDataVariant(BASE_PREFIX, "enabled", ":not([data-disabled])"),
    createDataVariant(BASE_PREFIX, "side-top", "[data-side='top']"),
    createDataVariant(BASE_PREFIX, "side-left", "[data-side='left']"),
    createDataVariant(BASE_PREFIX, "side-right", "[data-side='right']"),
    createDataVariant(BASE_PREFIX, "side-bottom", "[data-side='bottom']"),
    createDataVariant(
      BASE_PREFIX,
      "side-inline-start",
      "[data-side='inline-start']",
    ),
    createDataVariant(
      BASE_PREFIX,
      "side-inline-end",
      "[data-side='inline-end']",
    ),
    createDataVariant(BASE_PREFIX, "inset", "[data-inset]"),
  ],
  extendTheme: (theme: any) => {
    for (const color of SCALES) {
      createAccentColorVars(color, theme);
    }

    for (const color of MISC_SCALES) {
      createColorVars(color, theme);
    }

    createBaseColorVars(theme);
    createAliasColorVars(theme);
  },
});
