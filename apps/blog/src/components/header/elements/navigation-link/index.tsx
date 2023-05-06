import { component$, Slot, useStyles$ } from "@builder.io/qwik";

import { useActiveLocation } from "@/lib/location";

import _styles, { NavigationLinkAnchor } from "./navigation-link.css";

export interface NavigationLinkProps {
    href: string;
}

const NavigationLink = component$(({ href }: NavigationLinkProps) => {
    useStyles$(_styles);

    const isActive = useActiveLocation(href);

    return (
        <NavigationLinkAnchor
            class="m-0 my-2 inline-block select-none rounded-md px-2 py-3 transition"
            href={href}
            data-active={isActive ? true : undefined}
        >
            <Slot />
        </NavigationLinkAnchor>
    );
});

export default NavigationLink;
