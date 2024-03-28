/* @jsxImportSource solid-js */

import { queryClient } from "@/lib/client.ts";
import { getPreviewArticle } from "@/resources/content.ts";
import { createQuery } from "@tanstack/solid-query";
import deepEqual from "fast-deep-equal";
import { createEffect, createSignal, onCleanup, splitProps } from "solid-js";

interface Props {
  id: string;
  key: string;
}

export const ArticleRefresher = (_props: Props) => {
  const [{ id, key }, _] = splitProps(_props, ["id", "key"]);
  const [content, setContent] =
    createSignal<Awaited<ReturnType<typeof getPreviewArticle> | null>>(null);

  const query = createQuery(
    () => ({
      queryKey: ["previewArticle"],
      queryFn: async () => getPreviewArticle(id, key),
    }),
    () => queryClient,
  );

  createEffect(() => {
    const article = query.data;

    if (!article) return;

    if (content() === null) {
      setContent(article);
    } else if (!deepEqual(content(), article)) {
      location.reload();
    }
  });

  createEffect(() => {
    const callback = () => query.refetch();

    window.addEventListener("focus", callback);

    onCleanup(() => {
      window.removeEventListener("focus", callback);
    });
  });

  return <></>;
};
