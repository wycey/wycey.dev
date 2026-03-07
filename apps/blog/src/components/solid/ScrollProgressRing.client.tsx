/* @jsxImportSource solid-js */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type JSX, onCleanup, onMount } from "solid-js";

const RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SVG_SIZE = 34;
const CENTER = SVG_SIZE / 2;

export const ScrollProgressRing = (props: { children: JSX.Element }) => {
  let progressRef!: SVGCircleElement;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.fromTo(
      progressRef,
      { attr: { "stroke-dashoffset": CIRCUMFERENCE } },
      {
        attr: { "stroke-dashoffset": 0 },
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.2,
        },
      },
    );

    onCleanup(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  });

  return (
    <span class="relative inline-flex items-center justify-center size-[1em]">
      <svg
        class="absolute left-1/2 top-1/2 pointer-events-none"
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        fill="none"
        style={{ transform: "translate(-50%, -50%) rotate(-90deg)" }}
      >
        <title>スクロール進捗</title>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="currentColor"
          stroke-width="1.5"
          class="opacity-15"
        />
        <circle
          ref={progressRef}
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-dasharray={`${CIRCUMFERENCE}`}
          stroke-dashoffset={`${CIRCUMFERENCE}`}
        />
      </svg>
      {props.children}
    </span>
  );
};
