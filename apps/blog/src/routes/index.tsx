import { component$ } from "@builder.io/qwik";

import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => (
    <>
        <h1>わいしぃのブログ</h1>
        <p>建設中</p>
    </>
));

export const head: DocumentHead = {
    title: "わいしぃ uwu",
    meta: [
        {
            name: "description",
            content: "わいしぃへようこそ",
        },
    ],
};
