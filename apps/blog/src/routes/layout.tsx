import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import Footer from "@/components/footer";
import Header from "@/components/header";

export const useArticleList = routeLoader$(async () => {
    return {};
});

export default component$(() => (
    <>
        <Header />
        <main>
            <section>
                <Slot />
            </section>
        </main>
        <Footer />
    </>
));
