import { $, component$, Resource } from "@builder.io/qwik";
import { useQuery } from "qwik-urql";

import { AllArticlesDocument } from "../generated/graphql";

import type { DocumentHead } from "@builder.io/qwik-city";

export const Query = $(() => AllArticlesDocument);

export default component$(() => {
    const query = useQuery(Query, {});

    return <Resource value={query} onResolved={query => <>{JSON.stringify(query.data)}</>} />;
});

export const head: DocumentHead = {
    title: "わいしぃ uwu",
    meta: [
        {
            name: "description",
            content: "わいしぃへようこそ",
        },
    ],
};
