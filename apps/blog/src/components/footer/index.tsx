import { component$, useStyles$ } from "@builder.io/qwik";

import _styles, { FooterLink } from "./footer.css";

const Footer = component$(() => {
    useStyles$(_styles);

    return (
        <footer class="m-0 mt-12 grid w-screen grid-cols-[auto_1fr_auto] content-center px-12 pb-4">
            <p>&copy; 2023 Wycey</p>
            <div />
            <p>
                Powered by{" "}
                <FooterLink href="https://qwik.builder.io" target="_blank">
                    Qwik
                </FooterLink>{" "}
                and{" "}
                <FooterLink href="https://pages.cloudflare.com" target="_blank">
                    Cloudflare Pages
                </FooterLink>
            </p>
        </footer>
    );
});

export default Footer;
