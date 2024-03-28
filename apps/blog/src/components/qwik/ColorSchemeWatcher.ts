import { $, component$, useOnDocument } from "@builder.io/qwik";

export const ColorSchemeWatcher = component$(() => {
  useOnDocument(
    "DOMContentLoaded",
    $(() => {
      const listener = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

      const media = matchMedia("(prefers-color-scheme: dark)");

      media.addEventListener("change", listener);
    }),
  );

  return null;
});
