import { component$, useStyles$ } from "@builder.io/qwik";

import _styles, { FooterBase, FooterLink } from "./footer.css";

const Footer = component$(() => {
    useStyles$(_styles);

    return (
        <FooterBase>
            <p>&copy; 2022 Wycey</p>
            <div />
            <p>
                Powered by <FooterLink href="https://qwik.builder.io">Qwik</FooterLink> and{" "}
                <FooterLink href="https://pages.cloudflare.com">Cloudflare Pages</FooterLink>
            </p>
        </FooterBase>
    );
});

export default Footer;
