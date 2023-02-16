import { component$, useStyles$ } from "@builder.io/qwik";

import { Badge } from "@/components/badge";

import _styles, { HeaderBase, Logo, NavigationArea, NavigationList } from "./header.css";

export default component$(() => {
    useStyles$(_styles);

    return (
        <HeaderBase>
            <Logo>
                <a href="/">
                    <img class="w-34 h-full py-1" src="https://wycey.dev/images/wycey-full-dark.svg" alt="Logo" />
                </a>
            </Logo>
            <NavigationArea>
                <NavigationList>
                    <li></li>
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
            </NavigationArea>
        </HeaderBase>
    );
});
