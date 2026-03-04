/* @jsxImportSource solid-js */

import { useTheme } from "@/hooks/solid/useTheme";

export const ThemeSwitcher = () => {
  const { isSystem, isDark, toggleLightDark, setSystem } = useTheme();

  return (
    <section flex items="center" aria-label="テーマ切り替え">
      <button
        type="button"
        aria-label={
          isDark() ? "ライトモードに切り替え" : "ダークモードに切り替え"
        }
        onClick={toggleLightDark}
        text="lg"
        p="2.5"
        rounded="l-2"
        cursor="pointer"
        transition="all 300"
        class={
          isDark()
            ? "bg-indigo-3 text-indigo-11 hover:bg-indigo-4 active:bg-indigo-5"
            : "bg-amber-3 text-amber-11 hover:bg-amber-4 active:bg-amber-5"
        }
      >
        <span
          block
          transition="all 500"
          class={
            isDark() ? "i-lucide:moon rotate-0" : "i-lucide:sun rotate-180"
          }
          style={{
            transform: isDark() ? "rotate(0deg)" : "rotate(360deg)",
          }}
        />
      </button>
      <button
        type="button"
        aria-label="システムテーマに合わせる"
        aria-pressed={isSystem()}
        onClick={setSystem}
        text="lg"
        p="2.5"
        rounded="r-2"
        cursor="pointer"
        transition="all 300"
        relative
        class={
          isSystem()
            ? "bg-primary-solidBg text-border hover:bg-primary-solidBg-hover"
            : "bg-primary-bg text-fg-muted hover:bg-primary-bg-hover hover:text-fg active:bg-primary-bg-active"
        }
      >
        <span block class="i-lucide:monitor" />
      </button>
    </section>
  );
};
