import { SidebarSectionHeader } from "@/components/qwik/SidebarSectionHeader.tsx";
import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import { css } from "@style/css";

import type { MarkdownHeading } from "astro";

type Props = {
  class?: string;
  headings: MarkdownHeading[];
};

export const TOC = component$<Props>(({ class: class_, headings }) => {
  const scrollStarted = useSignal(false);
  const activeIndex = useSignal(-1);

  useOnDocument(
    "scroll",
    $(async () => {
      if (scrollStarted.value) return;

      // Wrap with object to avoid serialization errors
      const headingNodes = {
        value: document.querySelectorAll(
          headings.map((heading) => `#${heading.slug}`).join(", "),
        ),
      };

      const callback = (entries: IntersectionObserverEntry[]) => {
        const intersectingEntry = entries.findLast(
          (entry) => entry.isIntersecting,
        );

        if (!intersectingEntry) return;

        activeIndex.value = Array.from(headingNodes.value).findIndex(
          (headingNode) => headingNode.id === intersectingEntry.target.id,
        );
      };

      const observer = new IntersectionObserver(callback, {
        rootMargin: "0px 0px -84% 0px",
        threshold: 1,
      });

      for (const headingNode of headingNodes.value) {
        observer.observe(headingNode);
      }

      scrollStarted.value = true;
    }),
  );

  return (
    <>
      {headings.length > 0 ? (
        <section class={class_}>
          <SidebarSectionHeader>Table of Contents</SidebarSectionHeader>
          <ul>
            {headings.map((heading, index) => {
              const isActive = index === activeIndex.value;

              return (
                <li
                  class={css({
                    borderLeftWidth: "2px",
                  })}
                  style={{ paddingLeft: `${heading.depth + 1}rem` }}
                  key={heading.slug}
                >
                  {isActive ? (
                    <p class={css({ fontWeight: "bold" })}>{heading.text}</p>
                  ) : (
                    <a href={`#${heading.slug}`}>{heading.text}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </>
  );
});
