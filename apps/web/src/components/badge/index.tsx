import { component$, Slot, useStyles$ } from "@builder.io/qwik";

import _styles, { BadgeBase, BadgeIcon } from "./badge.css";

import type { Component, QwikIntrinsicElements } from "@builder.io/qwik";

export interface BadgeProps {
  accent: string;
}

type Badge = Component<BadgeProps & QwikIntrinsicElements["a"]> & {
  Icon: typeof BadgeIcon;
};

export const Badge = component$(({ accent, children: _children, ...props }) => {
  useStyles$(_styles);

  return (
    <BadgeBase
      style={{
        "--accent-background": `var(--${accent}2)`,
        "--accent-border": `var(--${accent}7)`,
        "--accent-color": `var(--${accent}11)`,
        "--accent-hover-background": `var(--${accent}3)`,
        "--accent-hover-border": `var(--${accent}8)`,
      }}
      {...props}
    >
      <Slot />
    </BadgeBase>
  );
}) as Badge;

Badge.Icon = BadgeIcon;

export default Badge;
