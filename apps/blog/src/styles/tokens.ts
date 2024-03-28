import type { SemanticTokens, Tokens } from "@pandacss/dev";

const joinFonts = (...fonts: string[]) =>
  fonts
    .map((font) =>
      !font.includes(",") && font.includes(" ") ? `"${font}"` : font,
    )
    .join(", ");

const defaultSans = joinFonts("ui-sans-serif", "system-ui");

const defaultSerif = joinFonts("ui-serif");
const defaultMonospace = joinFonts("ui-monospace");

export const tokens: Tokens = {
  fonts: {
    sans: {
      value: joinFonts(
        defaultSans,
        "Yu Gothic",
        "Meiryo",
        "Hiragino Kaku Gothic ProN",
      ),
    },
    serif: {
      value: defaultSerif,
    },
    mono: {
      value: joinFonts(
        "Operator Mono",
        "Input Mono",
        "Menlo",
        "Cascadia",
        "Cascadia Code",
        "Cascadia Mono",
        "Consolas",
        defaultMonospace,
      ),
    },
  },
};

const primaryColor = {
  "1": { value: "{colors.violet.1}" },
  "2": { value: "{colors.violet.2}" },
  "3": { value: "{colors.violet.3}" },
  "4": { value: "{colors.violet.4}" },
  "5": { value: "{colors.violet.5}" },
  "6": { value: "{colors.violet.6}" },
  "7": { value: "{colors.violet.7}" },
  "8": { value: "{colors.violet.8}" },
  "9": { value: "{colors.violet.9}" },
  "10": { value: "{colors.violet.10}" },
  "11": { value: "{colors.violet.11}" },
  "12": { value: "{colors.violet.12}" },

  default: { value: "{colors.violet.2}" },

  bg: {
    disabled: { value: "{colors.violet.2}" },
    DEFAULT: { value: "{colors.violet.3}" },
    hover: { value: "{colors.violet.4}" },
    active: { value: "{colors.violet.5}" },
  },

  border: {
    DEFAULT: { value: "{colors.violet.6}" },
    interact: { value: "{colors.violet.7}" },
    strong: { value: "{colors.violet.8}" },
  },

  solidBg: {
    DEFAULT: { value: "{colors.violet.9}" },
    hover: { value: "{colors.violet.10}" },
  },

  text: {
    muted: { value: "{colors.violet.11}" },
    DEFAULT: { value: "{colors.violet.12}" },
  },

  fg: {
    muted: { value: "{colors.violet.11}" },
    DEFAULT: { value: "{colors.violet.12}" },
  },
};

export const semanticTokens: SemanticTokens = {
  colors: {
    // Palette
    primary: primaryColor,
    // Compatibility with Park UI
    accent: primaryColor,
    colorPalette: primaryColor,
    secondary: {
      "1": { value: "{colors.iris.1}" },
      "2": { value: "{colors.iris.2}" },
      "3": { value: "{colors.iris.3}" },
      "4": { value: "{colors.iris.4}" },
      "5": { value: "{colors.iris.5}" },
      "6": { value: "{colors.iris.6}" },
      "7": { value: "{colors.iris.7}" },
      "8": { value: "{colors.iris.8}" },
      "9": { value: "{colors.iris.9}" },
      "10": { value: "{colors.iris.10}" },
      "11": { value: "{colors.iris.11}" },
      "12": { value: "{colors.iris.12}" },

      bg: {
        disabled: { value: "{colors.iris.2}" },
        DEFAULT: { value: "{colors.iris.3}" },
        hover: { value: "{colors.iris.4}" },
        active: { value: "{colors.iris.5}" },
      },

      border: {
        DEFAULT: { value: "{colors.iris.6}" },
        interact: { value: "{colors.iris.7}" },
        strong: { value: "{colors.iris.8}" },
      },

      solidBg: {
        DEFAULT: { value: "{colors.iris.9}" },
        hover: { value: "{colors.iris.10}" },
      },

      text: {
        muted: { value: "{colors.iris.11}" },
        DEFAULT: { value: "{colors.iris.12}" },
      },
    },
    info: {
      "1": { value: "{colors.indigo.1}" },
      "2": { value: "{colors.indigo.2}" },
      "3": { value: "{colors.indigo.3}" },
      "4": { value: "{colors.indigo.4}" },
      "5": { value: "{colors.indigo.5}" },
      "6": { value: "{colors.indigo.6}" },
      "7": { value: "{colors.indigo.7}" },
      "8": { value: "{colors.indigo.8}" },
      "9": { value: "{colors.indigo.9}" },
      "10": { value: "{colors.indigo.10}" },
      "11": { value: "{colors.indigo.11}" },
      "12": { value: "{colors.indigo.12}" },

      bg: {
        disabled: { value: "{colors.indigo.2}" },
        DEFAULT: { value: "{colors.indigo.3}" },
        hover: { value: "{colors.indigo.4}" },
        active: { value: "{colors.indigo.5}" },
      },

      border: {
        DEFAULT: { value: "{colors.indigo.6}" },
        interact: { value: "{colors.indigo.7}" },
        strong: { value: "{colors.indigo.8}" },
      },

      solidBg: {
        DEFAULT: { value: "{colors.indigo.9}" },
        hover: { value: "{colors.indigo.10}" },
      },

      text: {
        muted: { value: "{colors.indigo.11}" },
        DEFAULT: { value: "{colors.indigo.12}" },
      },
    },
    warning: {
      "1": { value: "{colors.amber.1}" },
      "2": { value: "{colors.amber.2}" },
      "3": { value: "{colors.amber.3}" },
      "4": { value: "{colors.amber.4}" },
      "5": { value: "{colors.amber.5}" },
      "6": { value: "{colors.amber.6}" },
      "7": { value: "{colors.amber.7}" },
      "8": { value: "{colors.amber.8}" },
      "9": { value: "{colors.amber.9}" },
      "10": { value: "{colors.amber.10}" },
      "11": { value: "{colors.amber.11}" },
      "12": { value: "{colors.amber.12}" },

      bg: {
        disabled: { value: "{colors.amber.2}" },
        DEFAULT: { value: "{colors.amber.3}" },
        hover: { value: "{colors.amber.4}" },
        active: { value: "{colors.amber.5}" },
      },

      border: {
        DEFAULT: { value: "{colors.amber.6}" },
        interact: { value: "{colors.amber.7}" },
        strong: { value: "{colors.amber.8}" },
      },

      solidBg: {
        DEFAULT: { value: "{colors.amber.9}" },
        hover: { value: "{colors.amber.10}" },
      },

      text: {
        muted: { value: "{colors.amber.11}" },
        DEFAULT: { value: "{colors.amber.12}" },
      },
    },
    error: {
      "1": { value: "{colors.red.1}" },
      "2": { value: "{colors.red.2}" },
      "3": { value: "{colors.red.3}" },
      "4": { value: "{colors.red.4}" },
      "5": { value: "{colors.red.5}" },
      "6": { value: "{colors.red.6}" },
      "7": { value: "{colors.red.7}" },
      "8": { value: "{colors.red.8}" },
      "9": { value: "{colors.red.9}" },
      "10": { value: "{colors.red.10}" },
      "11": { value: "{colors.red.11}" },
      "12": { value: "{colors.red.12}" },

      bg: {
        disabled: { value: "{colors.red.2}" },
        DEFAULT: { value: "{colors.red.3}" },
        hover: { value: "{colors.red.4}" },
        active: { value: "{colors.red.5}" },
      },

      border: {
        DEFAULT: { value: "{colors.red.6}" },
        interact: { value: "{colors.red.7}" },
        strong: { value: "{colors.red.8}" },
      },

      solidBg: {
        DEFAULT: { value: "{colors.red.9}" },
        hover: { value: "{colors.red.10}" },
      },

      text: {
        muted: { value: "{colors.red.11}" },
        DEFAULT: { value: "{colors.red.12}" },
      },
    },
    success: {
      "1": { value: "{colors.green.1}" },
      "2": { value: "{colors.green.2}" },
      "3": { value: "{colors.green.3}" },
      "4": { value: "{colors.green.4}" },
      "5": { value: "{colors.green.5}" },
      "6": { value: "{colors.green.6}" },
      "7": { value: "{colors.green.7}" },
      "8": { value: "{colors.green.8}" },
      "9": { value: "{colors.green.9}" },
      "10": { value: "{colors.green.10}" },
      "11": { value: "{colors.green.11}" },
      "12": { value: "{colors.green.12}" },

      bg: {
        disabled: { value: "{colors.green.2}" },
        DEFAULT: { value: "{colors.green.3}" },
        hover: { value: "{colors.green.4}" },
        active: { value: "{colors.green.5}" },
      },

      border: {
        DEFAULT: { value: "{colors.green.6}" },
        interact: { value: "{colors.green.7}" },
        strong: { value: "{colors.green.8}" },
      },

      solidBg: {
        DEFAULT: { value: "{colors.green.9}" },
        hover: { value: "{colors.green.10}" },
      },

      text: {
        muted: { value: "{colors.green.11}" },
        DEFAULT: { value: "{colors.green.12}" },
      },
    },
    gray: {
      "1": { value: "{colors.mauve.1}" },
      "2": { value: "{colors.mauve.2}" },
      "3": { value: "{colors.mauve.3}" },
      "4": { value: "{colors.mauve.4}" },
      "5": { value: "{colors.mauve.5}" },
      "6": { value: "{colors.mauve.6}" },
      "7": { value: "{colors.mauve.7}" },
      "8": { value: "{colors.mauve.8}" },
      "9": { value: "{colors.mauve.9}" },
      "10": { value: "{colors.mauve.10}" },
      "11": { value: "{colors.mauve.11}" },
      "12": { value: "{colors.mauve.12}" },

      border: {
        DEFAULT: { value: "{colors.mauve.6}" },
        interact: { value: "{colors.mauve.7}" },
        strong: { value: "{colors.mauve.8}" },
      },

      text: {
        muted: { value: "{colors.mauve.11}" },
        DEFAULT: { value: "{colors.mauve.12}" },
      },
    },

    // Scales
    bg: {
      canvas: { value: "{colors.gray.1}" },
      DEFAULT: {
        value: {
          base: "{colors.gray.1}",
          _dark: "{colors.gray.2}",
        },
      },
      subtle: {
        value: {
          base: "{colors.gray.2}",
          _dark: "{colors.gray.3}",
        },
      },
      disabled: {
        value: {
          base: "{colors.gray.3}",
          _dark: "{colors.gray.4}",
        },
      },
      muted: {
        value: {
          base: "{colors.gray.3}",
          _dark: "{colors.gray.4}",
        },
      },
      emphasized: {
        value: {
          base: "{colors.gray.4}",
          _dark: "{colors.gray.5}",
        },
      },
    },

    border: {
      subtle: { value: "{colors.gray.4}" },
      disabled: { value: "{colors.gray.5}" },
      muted: { value: "{colors.gray.6}" },
      DEFAULT: { value: "{colors.gray.7}" },
      outline: { value: "{colors.gray.9}" },
    },

    text: {
      muted: { value: "{colors.gray.text.muted}" },
      DEFAULT: { value: "{colors.gray.text}" },
    },
    // Compatibility with Park UI
    fg: {
      muted: { value: "{colors.gray.text.muted}" },
      DEFAULT: { value: "{colors.gray.text}" },
    },
  },
  borders: {
    base: { value: "1px solid {colors.border}" },
    bg: { value: "1px solid {colors.border.subtle}" },
    focusRing: { value: "2px solid {colors.primary.border.strong}" },
  },
};
