import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { css } from "@shadow-panda/styled-system/css";

export const Counter = component$(() => {
  const count = useSignal(0);
  const message = useComputed$(() => `Count: ${count.value}`);
  const increment = $(() => count.value++);

  return (
    <>
      <button
        type="button"
        onClick$={increment}
        class={css({ color: count.value % 2 === 0 ? "red" : "blue" })}
      >
        {message}
      </button>
      <p>{count.value % 2 === 0 ? "Even" : "Odd"}</p>
      <p>{new Date().toISOString()}</p>
    </>
  );
});
