// Workaround for https://github.com/radix-ui/primitives/issues/2580

import { onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

export const RadixPointerEventFix = () => {
  const listener = () => {};

  onMount(() => {
    if (isServer || !window.document?.body) return;

    window.document.body.addEventListener("pointerdown", listener, {
      passive: true,
    });
  });

  onCleanup(() => {
    if (isServer || !window.document?.body) return;

    window.document.body.removeEventListener("pointerdown", listener);
  });

  return null;
};
