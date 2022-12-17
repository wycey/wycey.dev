import { useLocation } from "@builder.io/qwik-city";

export const useActiveLocation = (pathname: string) => useLocation().pathname.replace(/\/+$/g, "") === pathname;
