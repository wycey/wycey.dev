import { component$, useStyles$ } from "@builder.io/qwik";

import { Badge } from "@/components/badge";

import _styles, { Logo } from "./header.css";

import type { QwikIntrinsicElements } from "@builder.io/qwik";

export const NavigationList = (props: QwikIntrinsicElements["ul"]) => (
    <ul class="inline-flex flex-row items-center" {...props}></ul>
);

export default component$(() => {
    useStyles$(_styles);

    return (
        <header class="mb-8 grid w-screen grid-cols-[auto,1fr] items-center px-8 pt-2">
            <Logo class="relative m-0 block cursor-default select-none p-1 pb-0 before:absolute before:inset-0 before:-z-10 before:block before:origin-bottom-right before:scale-x-0 before:transition before:duration-300 before:ease-in-out before:content-['_'] before:hover:origin-bottom-left before:hover:scale-x-100">
                <a href="/">
                    <img class="h-full w-[8.5rem] py-1" src="https://wycey.dev/images/wycey-full-dark.svg" alt="Logo" />
                </a>
            </Logo>
            <nav class="grid w-full grid-cols-[auto,1fr,auto] pl-[5%]">
                <NavigationList>
                    <li>abcdefggggggggggggggggggggggg</li>
                </NavigationList>
                <div />
                <NavigationList>
                    <li>
                        <Badge
                            accent="indigo"
                            href="https://mido.wycey.dev"
                            aria-label="Go to the website by Mido"
                            target="_blank"
                        >
                            <Badge.Icon src="https://wycey.dev/icons/mido.png" alt="Mido" />
                            Mido
                        </Badge>
                    </li>
                    <li>
                        <Badge
                            accent="green"
                            href="https://mi.wycey.dev"
                            aria-label="Go to Misskey managed by Wycey"
                            target="_blank"
                        >
                            <Badge.Icon src="https://wycey.dev/icons/misskey.png" alt="Misskey" />
                            Misskey
                        </Badge>
                    </li>
                </NavigationList>
            </nav>
        </header>
    );
});
