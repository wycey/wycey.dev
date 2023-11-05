import { component$ } from "@builder.io/qwik";

import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => (
  <>
    <h1>わいしぃへようこそ</h1>
    <p>
      わいしぃのトップページに迷い込んでしまったようです。わいしぃ関連の他のサイトをお探しの方はナビゲーションバーからどうぞ。
    </p>
    <h2>あんたらだれ</h2>
    <p>友人の集まりです。深い意味も特にありません。</p>
    <h2>書くことも</h2>
    <p>ない</p>
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
