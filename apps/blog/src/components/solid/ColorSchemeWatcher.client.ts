/* @jsxImportSource solid-js */

export const ColorSchemeWatcher = () => {
  const listener = (e: MediaQueryListEvent) => {
    try {
      const theme = localStorage.getItem("theme");

      if (theme === "dark" || theme === "light") return;
    } catch {}
    const dark = e.matches;

    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  };

  const media = matchMedia("(prefers-color-scheme: dark)");

  media.addEventListener("change", listener);

  $cleanup(() => {
    media.removeEventListener("change", listener);
  });

  return null;
};
