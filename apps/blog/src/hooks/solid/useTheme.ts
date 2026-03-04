import { useStore } from "@nanostores/solid";
import { createPrefersDark } from "@solid-primitives/media";
import { $theme } from "@/lib/atoms/theme";

export const useTheme = () => {
  const theme = useStore($theme);

  const isSystem = () => theme() === "system";

  const prefersDark = createPrefersDark();

  const isDark = () => {
    if (theme() === "dark") return true;
    if (theme() === "light") return false;

    return prefersDark();
  };

  const toggleLightDark = () => {
    $theme.set(isDark() ? "light" : "dark");
  };

  const setSystem = () => {
    $theme.set("system");
  };

  return {
    theme,
    isSystem,
    isDark,
    toggleLightDark,
    setSystem,
  } as const;
};
