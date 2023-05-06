import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import { useArticleList } from "../../layout";

export const usePostData = routeLoader$(async () => {
    return JSON.stringify({});
});

export default component$(() => {
    const data = useArticleList();

    return <p>{JSON.stringify(data.value)}</p>;
});
