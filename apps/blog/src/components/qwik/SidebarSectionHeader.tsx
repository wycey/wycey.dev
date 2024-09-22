import { Slot, component$ } from "@builder.io/qwik";

export const SidebarSectionHeader = component$(() => (
  <h2 data-section={true}>
    <Slot />
  </h2>
));
