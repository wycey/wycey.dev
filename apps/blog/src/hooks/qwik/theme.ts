import { useLocalStorage } from "@/hooks/qwik/local-storage.ts";
import { isBrowser } from "@/lib/util.ts";
import { useSignal, useTask$ } from "@builder.io/qwik";

type Theme = "light" | "dark" | "system";
type ActualTheme = "light" | "dark";

const getDefaultTheme = () => {
  if (matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

export const useTheme = () => {
  const [theme, setTheme$] = useLocalStorage<Theme>("theme", "system");
  const actualTheme = useSignal<ActualTheme>("dark");

  useTask$(({ track }) => {
    track(theme);

    if (theme.value !== actualTheme.value && theme.value !== "system") {
      actualTheme.value = theme.value;
    }

    if (theme.value !== "system" || !isBrowser()) return;

    actualTheme.value = getDefaultTheme();
  });

  return [actualTheme, setTheme$] as const;
};
