export type ThemePreference = "light" | "dark" | "system";

const applyTheme = (dark: boolean) => {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
};

const resolveIsDark = (theme: ThemePreference): boolean => {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return matchMedia("(prefers-color-scheme: dark)").matches;
};

export const useTheme = () => {
  let theme = $signal<ThemePreference>(
    (localStorage.getItem("theme") as ThemePreference) || "system",
  );
  let isDark = $signal(resolveIsDark(theme));

  const setTheme = (next: ThemePreference) => {
    theme = next;

    localStorage.setItem("theme", next);

    isDark = resolveIsDark(next);

    applyTheme(isDark);
  };

  const toggleLightDark = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const setSystem = () => {
    setTheme("system");
  };

  const listener = (e: MediaQueryListEvent) => {
    if (theme !== "system") return;

    isDark = e.matches;

    applyTheme(isDark);
  };

  const media = matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", listener);

  $cleanup(() => {
    media.removeEventListener("change", listener);
  });

  return {
    getTheme: $get(theme),
    isDark: $get(isDark),
    toggleLightDark,
    setSystem,
  } as const;
};
