import { component$, useStyles$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";

import { RouterHead } from "./components/router-head";
import globalStyles from "./global.scss?inline";

export default component$(() => {
    /**
     * The root of a QwikCity site always start with the <QwikCityProvider> component,
     * immediately followed by the document's <head> and <body>.
     *
     * Dont remove the `<head>` and `<body>` elements.
     */
    useStyles$(globalStyles);

    return (
        <QwikCityProvider>
            <head>
                <meta charSet="utf-8" />
                <RouterHead />
            </head>
            <body>
                <div class="theme-provider dark-theme">
                    <RouterOutlet />
                </div>
                <ServiceWorkerRegister />
            </body>
        </QwikCityProvider>
    );
});
