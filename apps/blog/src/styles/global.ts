import { defineGlobalStyles } from "@pandacss/dev";

export const globalCss = defineGlobalStyles({
  "html, body": {
    h: "full",
  },
  html: {
    lineHeight: 1.8,
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    WebkitTextSizeAdjust: "100%",

    _focusWithin: {
      scrollBehavior: "smooth",
    },

    scrollPaddingTop: "12",
  },
  body: {
    bg: "bg",
    color: "text",

    _dark: {
      colorScheme: "dark",
    },
  },
  "*, *::before, *::after": {
    borderColor: "border.subtle",
    borderStyle: "solid",
    outlineColor: "transparent",
    transition: "outline-color .15s ease-in-out",

    _focusVisible: {
      outline: "focusRing",
      rounded: "sm",
    },
  },
  "*::placeholder": {
    opacity: 1,
    color: "primary.border",
  },
  "*::selection": {
    bg: "primary.solidBg/30",
  },
  "a:not([class])": {
    textDecorationSkipInk: "auto",
  },
  "img, picture, svg, video, canvas": {
    maxW: "full",
    h: "auto",
    verticalAlign: "middle",
    fontStyle: "italic",
    bgRepeat: "no-repeat",
    bgSize: "cover",
  },
  "@media (prefers-reduced-motion: reduce)": {
    html: {
      _focusWithin: {
        scrollBehavior: "auto",
      },
    },

    "*, *::before, *::after": {
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
      scrollBehavior: "auto !important",
      transition: "none !important",
    },
  },
});
