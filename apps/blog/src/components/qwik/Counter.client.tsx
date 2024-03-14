import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";

export const Counter = component$(() => {
  const count = useSignal(0);
  const message = useComputed$(() => `Count: ${count.value}`);
  const increment = $(() => count.value++);

  return (
    <>
      <button type="button" onClick$={increment}>
        {message}
      </button>
      <p>{count.value % 2 === 0 ? "Even" : "Odd"}</p>
      <p>{new Date().toISOString()}</p>
    </>
  );
});
