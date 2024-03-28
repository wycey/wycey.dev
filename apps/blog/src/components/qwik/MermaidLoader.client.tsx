import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import mermaid from "mermaid";

type Props = {
  content: string;
};

export const MermaidLoader = component$<Props>(({ content }) => {
  const mermaidContainerRef = useSignal<HTMLPreElement>();

  useVisibleTask$(async () => {
    if (!mermaidContainerRef.value) return;

    await mermaid.init({}, mermaidContainerRef.value);
  });

  return (
    <pre ref={mermaidContainerRef} class="mermaid">
      {content.trim()}
    </pre>
  );
});
