import { createEffect } from "solid-js";
import { useTheme } from "@/hooks/solid/useTheme";

export const ColorSchemeWatcher = () => {
  const { isSystem, isDark } = useTheme();

  let meta: HTMLMetaElement | null | undefined;

  createEffect(() => {
    if (meta === undefined) {
      meta = document.querySelector('meta[name="color-scheme"]');
    }

    if (meta) {
      if (isSystem()) {
        meta.setAttribute("content", "light dark");

        delete document.documentElement.dataset.theme;
      } else {
        const mode = isDark() ? "dark" : "light";

        meta.setAttribute("content", mode);

        document.documentElement.dataset.theme = mode;
      }
    }
  });

  return null;
};
