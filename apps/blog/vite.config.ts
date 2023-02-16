import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import { vanillaExtractPlugin } from "styled-vanilla-extract/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
    return {
        plugins: [qwikCity(), qwikVite(), tsconfigPaths(), vanillaExtractPlugin()],
        server: {
            port: 6174,
            strictPort: true,
        },
        preview: {
            headers: {
                "Cache-Control": "public, max-age=600",
            },
        },
    };
});
