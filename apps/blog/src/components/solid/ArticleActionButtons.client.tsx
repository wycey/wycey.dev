/* @jsxImportSource solid-js */

import { createEventListener } from "@solid-primitives/event-listener";
import { createSignal, onMount, Show } from "solid-js";
import { ScrollProgressRing } from "@/components/solid/ScrollProgressRing.client";
import {
  ShareButton,
  SquareButton,
} from "@/components/solid/SquareButton.client";

export interface ArticleActionButtonsProps {
  classList?: { [key: string]: boolean };
  shareTitle: string;
  shareText: string;
  shareUrl: string;
}

const InnerActionButtons = (
  props: ArticleActionButtonsProps & {
    applyShadow: boolean;
    showScrollToTop: boolean;
    onClickScrollToTop?: () => void;
  },
) => {
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${props.shareText.trim()}\n`)}&url=${encodeURIComponent(props.shareUrl.trim())}`;

  return (
    <>
      <SquareButton
        href="#article"
        aria-label="一番上へ戻る"
        onClick={props.onClickScrollToTop}
        classList={{
          "shadow-lg": props.applyShadow,
          "shadow-none": !props.applyShadow,
          "lg:shadow-none": true,
          "invisible pointer-events-none": !props.showScrollToTop,
          ...props.classList,
        }}
      >
        <ScrollProgressRing>
          <span class="block i-lucide:chevron-up" />
        </ScrollProgressRing>
      </SquareButton>
      <ShareButton
        shareTitle={props.shareTitle}
        shareText={props.shareText}
        shareUrl={props.shareUrl}
        aria-label="このページを共有"
        classList={{
          "shadow-lg": props.applyShadow,
          "shadow-none": !props.applyShadow,
          "lg:shadow-none": true,
          ...props.classList,
        }}
      />
      <SquareButton
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="このページをTwitterで共有"
        classList={{
          "hidden lg:block": true,
          "shadow-lg": props.applyShadow,
          "shadow-none": !props.applyShadow,
          "lg:shadow-none": true,
          ...props.classList,
        }}
      >
        <span class="block i-lucide:twitter" />
      </SquareButton>
    </>
  );
};

const isAtBottom = () =>
  window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;

export const ArticleActionButtons = (props: ArticleActionButtonsProps) => {
  const [enableTransition, setEnableTransition] = createSignal(false);
  const [showFooter, setShowFooter] = createSignal(false);
  const [applyButtonShadow, setApplyButtonShadow] = createSignal(false);
  const [showScrollToTop, setShowScrollToTop] = createSignal(false);

  let suppressScrollFooter = false;

  const onClickScrollToTop = () => {
    setShowFooter(false);

    suppressScrollFooter = true;
  };

  let footerRef!: HTMLDivElement;
  let lastScrollY!: number;

  onMount(() => {
    const updateScrollability = () => {
      setShowScrollToTop(
        document.documentElement.scrollHeight > window.innerHeight,
      );
    };

    updateScrollability();
    createEventListener(window, "resize", updateScrollability);

    // - 縦にスクロールできない場合は常にフッターを表示
    // - 最初からスクロール位置が下端付近にある場合はフッターを表示
    if (window.innerHeight >= document.body.offsetHeight || isAtBottom()) {
      setShowFooter(true);

      setApplyButtonShadow(false);
    } else {
    }

    setTimeout(() => {
      // 初期アニメーションを防止するため、ページ読み込み後にtransitionクラスを追加
      setEnableTransition(true);
    });

    const clearSuppressScrollFooter = () => {
      suppressScrollFooter = false;
    };

    createEventListener(window, "wheel", clearSuppressScrollFooter);
    createEventListener(window, "touchstart", clearSuppressScrollFooter);
    createEventListener(window, "pointerdown", clearSuppressScrollFooter);
    createEventListener(window, "keydown", clearSuppressScrollFooter);

    lastScrollY = window.scrollY;

    createEventListener(window, "scroll", () => {
      if (window.scrollY === lastScrollY) {
        return;
      }

      if (!suppressScrollFooter) {
        if (window.scrollY <= lastScrollY || isAtBottom()) {
          // スクロールアップ・下端付近に到達 - フッターを表示
          setShowFooter(true);
        } else {
          // スクロールダウン - フッターを隠す
          setShowFooter(false);
        }

        if (window.scrollY <= 100) {
          // 上端付近に到達 - フッターを隠す
          setShowFooter(false);
        }
      }

      if (!footerRef) {
        throw new Error("footerRef is not assigned");
      }

      // フッターがstickyで張り付いたら影をつける
      const footerRect = footerRef.getBoundingClientRect();

      if (
        footerRect.top <= window.innerHeight &&
        footerRect.bottom >= window.innerHeight
      ) {
        setApplyButtonShadow(true);
      } else {
        setApplyButtonShadow(false);
      }

      lastScrollY = window.scrollY;
    });
  });

  return (
    <>
      <footer
        ref={footerRef}
        sticky
        flex
        flex-row-reverse
        m="t-8 -b-8"
        pb="8"
        gap="4"
        z="36"
        print="hidden"
        lg="hidden"
        classList={{
          "sticky inset-b-0 origin-c": true,
        }}
      >
        <InnerActionButtons
          applyShadow={applyButtonShadow()}
          showScrollToTop={showScrollToTop()}
          onClickScrollToTop={onClickScrollToTop}
          classList={{
            transition: enableTransition(),
            "duration-200": enableTransition(),
            "scale-0": !showFooter(),
            "opacity-0": !showFooter(),
          }}
          {...props}
        />
      </footer>
      <aside
        absolute
        h="full"
        flex-col
        gap="4"
        items="end"
        class="top-2 right--16 hidden lg:flex print:hidden!"
      >
        <section sticky flex flex-col gap="4" class="top-4">
          <InnerActionButtons
            applyShadow={applyButtonShadow()}
            showScrollToTop={showScrollToTop()}
            classList={{
              transition: true,
            }}
            {...props}
          />
        </section>
      </aside>
    </>
  );
};
