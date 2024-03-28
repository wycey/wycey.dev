declare module "@myriaddreamin/rehype-typst" {
  import type { Root } from "rehype-slug/lib";

  export default function rehypeTypst(): (type: Root) => undefined;
}
