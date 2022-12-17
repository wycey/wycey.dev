import { component$, useStyles$ } from "@builder.io/qwik";

import { Badge } from "@/components/badge";

import NavigationLink from "./elements/navigation-link";
import _styles, { HeaderBase, Logo, LogoImage, NavigationArea, NavigationList } from "./header.css";

export default component$(() => {
    useStyles$(_styles);

    return (
        <HeaderBase>
            <Logo>
                <a href="/">
                    <LogoImage src="/images/wycey-full-dark.svg" alt="Logo" />
                </a>
            </Logo>
            <NavigationArea>
                <NavigationList>
                    <li>
                        <NavigationLink href="/about">About</NavigationLink>
                    </li>
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
                            <Badge.Icon src="/icons/mido.png" alt="Mido" />
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
                            <Badge.Icon src="/icons/misskey.png" alt="Misskey" />
                            Misskey
                        </Badge>
                    </li>
                </NavigationList>
            </NavigationArea>
        </HeaderBase>
    );
});
