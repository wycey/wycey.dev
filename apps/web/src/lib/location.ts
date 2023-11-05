import { useLocation } from "@builder.io/qwik-city";

export const useActiveLocation = (pathname: string) => useLocation().url.pathname.replaceAll(/\/+$/g, "") === pathname;
