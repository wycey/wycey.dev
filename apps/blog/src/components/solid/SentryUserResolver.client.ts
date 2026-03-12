import * as Sentry from "@sentry/astro";
import { onMount } from "solid-js";

const STORAGE_KEY = "sentry-user-id";

export const SentryUserResolver = () => {
  onMount(() => {
    const getOrCreateAnonymousId = () => {
      let id = localStorage.getItem(STORAGE_KEY);

      if (
        !id &&
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
      ) {
        id = crypto.randomUUID();

        localStorage.setItem(STORAGE_KEY, id);
      }

      return id;
    };

    const anonId = getOrCreateAnonymousId();

    if (anonId) {
      Sentry.setUser({ id: anonId });
    }
  });

  return null;
};
