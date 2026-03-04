import {
  defineConfig,
  type Preset,
  presetAttributify,
  presetIcons,
  presetWind4,
  transformerAttributifyJsx,
  transformerDirectives,
} from "unocss";
import { presetAnimations } from "unocss-preset-animations";
import { presetRadix } from "unocss-preset-radix";

// biome-ignore lint/suspicious/noExplicitAny: UnoCSS theme is too complex to type
const createColorPaletteForRadix = (theme: any, color: string) => ({
  DEFAULT: theme.colors[color][2],
  bg: {
    disabled: theme.colors[color][1],
    DEFAULT: theme.colors[color][2],
    hover: theme.colors[color][3],
    active: theme.colors[color][4],
  },
  border: {
    DEFAULT: theme.colors[color][6],
    interact: theme.colors[color][7],
    strong: theme.colors[color][8],
  },
  solidBg: {
    DEFAULT: theme.colors[color][9],
    hover: theme.colors[color][10],
  },
  fg: theme.colors[color].fg,
  ...theme.colors[color],
});

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetRadix({
      palette: ["violet", "iris", "indigo", "amber", "red", "green", "mauve"],
      aliases: {
        primary: "violet",
        secondary: "iris",
        info: "indigo",
        warning: "amber",
        error: "red",
        success: "green",
        base: "mauve",
      },
      darkSelector: ".dark",
      lightSelector: ":root, .light",
    }) as unknown as Preset,
    presetAnimations(),
    presetAttributify(),
    presetIcons({
      warn: true,
      collections: {
        lucide: () =>
          import("@iconify-json/lucide/icons.json").then((i) => i.default),
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerAttributifyJsx()],
  // biome-ignore lint/suspicious/noExplicitAny: UnoCSS theme is too complex to type
  extendTheme: (theme: any) => {
    theme.colors.primary = createColorPaletteForRadix(theme, "primary");
    theme.colors.secondary = createColorPaletteForRadix(theme, "secondary");
    theme.colors.info = createColorPaletteForRadix(theme, "info");
    theme.colors.warning = createColorPaletteForRadix(theme, "warning");
    theme.colors.error = createColorPaletteForRadix(theme, "error");
    theme.colors.success = createColorPaletteForRadix(theme, "success");

    theme.colors.base = {
      border: {
        DEFAULT: theme.colors.base[6],
        interact: theme.colors.base[7],
        strong: theme.colors.base[8],
      },
      ...theme.colors.base,
    };

    theme.colors.bg = {
      DEFAULT: theme.colors.base[1],
      subtle: theme.colors.base[2],
      disabled: theme.colors.base[3],
      muted: theme.colors.base[3],
      emphasized: theme.colors.base[4],
    };

    theme.colors.border = {
      subtle: theme.colors.base[4],
      disabled: theme.colors.base[5],
      muted: theme.colors.base[6],
      DEFAULT: theme.colors.base[7],
      outline: theme.colors.base[9],
    };

    theme.colors.fg = {
      ...theme.colors.base.fg,
      DEFAULT: theme.colors.base[12],
      disabled: theme.colors.base[7],
      muted: theme.colors.base[9],
      emphasized: theme.colors.base[12],
    };
  },
});
