declare module "@myriaddreamin/rehype-typst" {
  export default function rehypeTypst(): (
    type: import("rehype-slug/lib").Root,
  ) => undefined;
}

declare module "*?base64" {
  const dataUri: string;
  export default dataUri;
}
