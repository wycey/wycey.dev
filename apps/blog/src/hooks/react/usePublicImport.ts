import { useEffect, useState } from "react";

type UseDynamicImportState<T> =
  | { status: "idle"; module: null; error: null }
  | { status: "loading"; module: null; error: null }
  | { status: "success"; module: T; error: null }
  | { status: "error"; module: null; error: unknown };

export function usePublicImport<T>(modname: string) {
  const [state, setState] = useState<UseDynamicImportState<T>>({
    status: "idle",
    module: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    setState((s) =>
      s.status === "idle"
        ? { status: "loading", module: null, error: null }
        : s,
    );

    import(/* @vite-ignore */ `${window.location.origin}${modname}`)
      .then((mod) => {
        if (!cancelled)
          setState({ status: "success", module: mod, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: "error", module: null, error: err });
      });

    return () => {
      cancelled = true;
    };
  }, [modname]);

  return state;
}
