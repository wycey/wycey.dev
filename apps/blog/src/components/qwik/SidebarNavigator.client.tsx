import {
  $,
  component$,
  useComputed$,
  useOnDocument,
  useSignal,
  useTask$,
} from "@builder.io/qwik";

import {
  Combobox,
  ComboboxControl,
  ComboboxIcon,
  ComboboxInput,
  ComboboxLabel,
  ComboboxListbox,
  ComboboxOption,
  ComboboxPopover,
  ComboboxTrigger,
  type ResolvedOption,
} from "@qwik-ui/headless";
import { css } from "@style/css";
import { flex } from "@style/patterns";
import { token } from "@style/tokens";
import { CheckIcon, ForwardIcon } from "lucide-qwik";

export const SidebarNavigator = component$(() => {
  const elements = useSignal<{ label: string; element: HTMLHeadingElement }[]>(
    [],
  );

  const options = useComputed$(() => elements.value.map(({ label }) => label));

  const selectedIndex = useSignal(0);

  const isListboxOpen = useSignal(false);
  const listboxStateChanged = useSignal(false);

  useTask$(({ track }) => {
    if (track(isListboxOpen)) {
      listboxStateChanged.value = true;
    }
  });

  useTask$(({ track }) => {
    const selectedElement = elements.value[track(selectedIndex)];

    if (selectedElement) {
      const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";

      selectedElement.element.scrollIntoView({
        behavior,
        block: "start",
      });
    }
  });

  const hidden = css({
    "@supports selector(:popover-open)": {
      display: "none !important",
      opacity: "0 !important",
    },
  });

  useOnDocument(
    "DOMContentLoaded",
    $(() => {
      const headings = document.querySelectorAll("aside h2[data-section]");

      elements.value = [...headings].map((heading, index) => ({
        label: heading.textContent || `Section ${index + 1}`,
        element: heading,
      }));
    }),
  );

  if (elements.value.length === 0) return null;

  return (
    <div class={flex()}>
      <Combobox
        class={css({
          w: "fit-content",
        })}
        options={options.value}
        bind:selectedIndex={selectedIndex}
        bind:isListboxOpen={isListboxOpen}
      >
        <ComboboxLabel
          class={css({
            display: "none",
          })}
        >
          Navigate To
        </ComboboxLabel>
        <ComboboxControl
          class={flex({
            pos: "relative",
            align: "center",
            rounded: "sm",
            borderWidth: "2px",
          })}
        >
          <ComboboxInput
            placeholder="Navigate To..."
            class={css({
              pl: "2",
              pr: "6",
              bg: "bg.subtle",
              w: "48",
              rounded: "sm",

              _placeholder: {
                color: "text.muted",
              },
            })}
          />
          <ComboboxTrigger
            class={css({
              pos: "absolute",
              right: "0",
              h: "6",
              w: "6",

              "&[aria-expanded=true] svg": {
                transform: "rotate(180deg)",
              },
            })}
          >
            <ComboboxIcon
              class={css({
                stroke: "text.muted",
                transition: "transform .2s",
              })}
            />
          </ComboboxTrigger>
        </ComboboxControl>
        <ComboboxPopover
          class={[
            css({
              w: "60",
              transition: "opacity .2s",
              "&.popover-closing": {
                opacity: "0 !important",
              },
            }),
            !(isListboxOpen.value || listboxStateChanged.value) && hidden,
          ]}
          gutter={8}
        >
          <ComboboxListbox
            class={css({
              px: "4",
              py: "2",
              w: "full",
              bg: "bg.subtle",
              rounded: "md",
              borderWidth: "1px",
            })}
            optionRenderer$={(option: ResolvedOption, index: number) => {
              return (
                <ComboboxOption
                  key={option.key}
                  class={flex({
                    justify: "space-between",
                    px: "2",
                    py: "0.5",
                    rounded: "sm",
                    borderWidth: "1px",
                    borderColor: "transparent",
                    cursor: "pointer",
                    wordBreak: "break-word",
                    lineHeight: 1.6,
                    transition: "background-color .2s",

                    _hover: {
                      bg: "bg.emphasized",
                    },

                    _disabled: {
                      color: "text.muted",
                      fontWeight: "light",
                      cursor: "not-allowed",

                      _hover: {
                        bg: "bg.subtle",
                      },
                    },

                    _selected: {
                      bg: "bg.emphasized",
                      borderColor: "primary.border",
                    },
                  })}
                  index={index}
                  resolved={option}
                >
                  <span>{option.label}</span>
                  {index === selectedIndex.value && (
                    <CheckIcon
                      color={token("colors.primary.solidBg")}
                      size={16}
                    />
                  )}
                </ComboboxOption>
              );
            }}
          />
        </ComboboxPopover>
      </Combobox>
      <button
        type="button"
        aria-label="Go"
        class={css({
          ml: "2",
          px: "2",
          bg: "bg.emphasized",
          borderWidth: "2px",
          borderColor: "transparent",
          rounded: "sm",
          color: "text.muted",
          cursor: "pointer",
          transition: "color .2s, background-color .2s, border-color .2s",

          _hover: {
            bg: "primary.bg",
            borderColor: "primary.border",
            color: "text",
          },
        })}
        onClick$={() => {
          const selectedElement = elements.value[selectedIndex.value];

          if (selectedElement) {
            const behavior = matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth";

            selectedElement.element.scrollIntoView({
              behavior,
              block: "start",
            });
          }
        }}
      >
        <ForwardIcon />
      </button>
    </div>
  );
});
