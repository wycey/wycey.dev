/* @jsxImportSource solid-js */

import { type ComponentProps, children, createSignal, Show } from "solid-js";

export const SquareButton = ({
  class: className,
  ...props
}: ComponentProps<"button">) => {
  const nodes = children(() => props.children);

  return (
    <button
      type="button"
      text="primary-10 lg"
      transition="300"
      p="4"
      rounded="2"
      bg="primary-bg hover:primary-bg-hover active:primary-bg-active disabled:primary-bg-disabled"
      cursor="disabled:not-allowed"
      class={className}
      {...props}
    >
      {nodes()}
    </button>
  );
};

export const ShareButton = ({
  class: className,
  shareTitle,
  ...props
}: ComponentProps<"button"> & { shareTitle: string }) => {
  const [copied, setCopied] = createSignal(false);

  return (
    <SquareButton
      aria-label="このページを共有"
      onClick={() => {
        const shareData: ShareData = {
          title: shareTitle,
          url: window.location.href,
        };
        if (navigator.share && navigator.canShare(shareData)) {
          navigator.share(shareData).catch((error) => {
            console.error("Error sharing:", error);
          });
        } else {
          navigator.clipboard
            .writeText(location.href)
            .then(() => {
              setCopied(true);

              setTimeout(() => {
                setCopied(false);
              }, 2000);
            })
            .catch((error) => {
              console.error("Error copying to clipboard:", error);
            });
        }
      }}
      class={className}
      {...props}
    >
      <Show
        when={copied}
        fallback={<span class="i-lucide:share lg:i-lucide:copy block" />}
      >
        <span class="i-lucide:check block" />
      </Show>
    </SquareButton>
  );
};
