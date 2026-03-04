/* @jsxImportSource solid-js */

import { createEffect } from "solid-js";
import { useTheme } from "@/hooks/solid/useTheme";

export const ColorSchemeWatcher = () => {
  const { isDark } = useTheme();

  createEffect(() => {
    if (isDark()) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    document.documentElement.style.colorScheme = isDark() ? "dark" : "light";
  });

  return null;
};
