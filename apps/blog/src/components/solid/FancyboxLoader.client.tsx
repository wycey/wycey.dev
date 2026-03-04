/* @jsxImportSource solid-js */

import type { FancyboxOptions } from "@fancyapps/ui";
import { onMount } from "solid-js";

import "@fancyapps/ui/dist/fancybox/fancybox.css";

export const FancyboxLoader = () => {
  let Fancybox: typeof import("@fancyapps/ui").Fancybox | undefined;

  onMount(async () => {
    const fancyboxSelectors: string[] = [];
    const fancyboxSelector = "[data-fancybox]" as const;

    const hasImages = document.querySelector(fancyboxSelector);

    if (!hasImages) {
      return;
    }

    if (fancyboxSelectors.length > 0) {
      return;
    }

    if (!Fancybox) {
      const fancyboxModule = await import("@fancyapps/ui");

      Fancybox = fancyboxModule.Fancybox;
    }

    Fancybox.bind(fancyboxSelector, {
      Carousel: {
        Toolbar: {
          display: {
            left: ["counter"],
            middle: ["zoomIn", "zoomOut", "reset"],
            right: ["thumbs", "close"],
          },
        },
        // biome-ignore lint/suspicious/noExplicitAny: Fancybox is too difficult to type
        formatCaption: (_carouselRef: any, slide: any) => {
          return slide.triggerEl?.nextElementSibling || "";
        },
      },
      hideScrollbar: false,
    } as unknown as FancyboxOptions);
    fancyboxSelectors.push(fancyboxSelector);
  });
};
