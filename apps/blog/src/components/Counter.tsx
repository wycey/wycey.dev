import { css } from "@shadow-panda/styled-system/css";

const useCounter = () => {
  const count = $signal(0);

  $(console.log("Current count:", count));

  return $refSignal(count);
}

export const Counter = () => {
  let count = $derefSignal(useCounter());

  const message = $(`Count: ${count}`);
  const increment = () => count++;

  return (
    <>
      <button type="button" onClick={increment} class={css({ color: count % 2 === 0 ? "red" : "blue" })}>
        {message}
      </button>
      <Show when={count % 2 === 0} fallback={<p>Odd</p>}>
        <p>Even</p>
      </Show>
    </>
  );
}

