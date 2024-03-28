import { hasProperty } from "hast-util-has-property";
import { headingRank } from "hast-util-heading-rank";
import { toString as hastToString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

import type { MarkdownHeading } from "astro";
import type { Root } from "hast";

export interface ExtractHeadingsConfig {
  startingRank?: number;
  headings: MarkdownHeading[];
}

export const rehypeExtractHeadings = ({
  startingRank = 2,
  headings,
}: ExtractHeadingsConfig) => {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      const rank = headingRank(node);

      if (rank && rank >= startingRank && hasProperty(node, "id")) {
        headings.push({
          depth: rank - startingRank,
          slug: node.properties.id.toString(),
          text: hastToString(node),
        });
      }
    });
  };
};
