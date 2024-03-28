import { Slot } from "@builder.io/qwik";

export const SidebarSectionHeader = () => (
  <h2 data-section={true}>
    <Slot />
  </h2>
);
