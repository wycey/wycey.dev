// Workaround for https://github.com/radix-ui/primitives/issues/2580

import { createEventListener } from "@solid-primitives/event-listener";
import { onMount } from "solid-js";
import { isServer } from "solid-js/web";

export const RadixPointerEventFix = () => {
  onMount(() => {
    if (isServer || !window.document?.body) return;

    createEventListener(window.document.body, "pointerdown", () => {});
  });

  return null;
};
