import { persistentAtom } from "@nanostores/persistent";

export type ThemePreference = "light" | "dark" | "system";

export const $theme = persistentAtom<ThemePreference>("theme", "system");
