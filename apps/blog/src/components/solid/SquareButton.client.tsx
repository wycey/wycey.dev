/* @jsxImportSource solid-js */

import {
  type ComponentProps,
  children,
  createSignal,
  Show,
  splitProps,
} from "solid-js";

export type SquareButtonProps =
  | ({ href?: never } & ComponentProps<"button">)
  | ({ href: string } & ComponentProps<"a">);

export const SquareButton = (props: SquareButtonProps) => {
  const [local, rest] = splitProps(props, ["href", "classList"]);
  const nodes = children(() => props.children);

  return local.href ? (
    <a
      href={local.href}
      inline-flex=""
      items="center"
      justify="center"
      text="primary-10 lg"
      p="4"
      rounded="2"
      bg="primary-bg hover:primary-bg-hover active:primary-bg-active disabled:primary-bg-disabled"
      cursor="disabled:not-allowed"
      classList={local.classList}
      {...(rest as ComponentProps<"a">)}
    >
      {nodes()}
    </a>
  ) : (
    <button
      type="button"
      inline-flex=""
      items="center"
      justify="center"
      text="primary-10 lg"
      p="4"
      rounded="2"
      bg="primary-bg hover:primary-bg-hover active:primary-bg-active disabled:primary-bg-disabled"
      cursor="disabled:not-allowed"
      classList={local.classList}
      {...(rest as ComponentProps<"button">)}
    >
      {nodes()}
    </button>
  );
};

export const ShareButton = (
  props: ComponentProps<"button"> & {
    shareTitle: string;
    shareText: string;
    shareUrl: string;
  },
) => {
  const [local, rest] = splitProps(props, [
    "shareTitle",
    "shareText",
    "shareUrl",
    "class",
    "classList",
  ]);

  const [copied, setCopied] = createSignal(false);

  return (
    <SquareButton
      aria-label="このページを共有"
      onClick={() => {
        const shareData: ShareData = {
          title: local.shareTitle,
          text: local.shareText,
          url: local.shareUrl,
        };
        if (navigator.share && navigator.canShare(shareData)) {
          navigator.share(shareData).catch((error) => {
            console.error("Error sharing:", error);
          });
        } else {
          navigator.clipboard
            .writeText(local.shareUrl)
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
      class={local.class}
      classList={local.classList}
      {...rest}
    >
      <Show
        when={copied()}
        fallback={<span class="block i-lucide:share lg:i-lucide:copy" />}
      >
        <span class="block i-lucide:check" />
      </Show>
    </SquareButton>
  );
};
