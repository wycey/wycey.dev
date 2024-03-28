import { $, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const signal = useSignal(initialValue);

  useVisibleTask$(() => {
    try {
      const item = localStorage.getItem(key);

      signal.value = item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(error);

      signal.value = initialValue;
    }
  });

  const setValue$ = $((value: T) => {
    signal.value = value;

    if (window) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });

  return [signal, setValue$] as const;
};
