/** biome-ignore-all lint/suspicious/noExplicitAny: Uses untyped keys to store original nodes */

import { exec } from "node:child_process";
import { loadDefaultJapaneseParser } from "budoux";
import type * as hast from "hast";
import { h } from "hastscript";
import type * as mdast from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import type { Plugin } from "unified";
import { EXIT, visit } from "unist-util-visit";

const budouxParser = loadDefaultJapaneseParser();

export const remarkHeading1ToTitle: Plugin<[], mdast.Root> =
  () =>
  (tree, { data }) => {
    visit(tree, "heading", (node, index, parent) => {
      if (node.depth === 1) {
        const title = mdastToString(node);

        if (!data.astro) {
          data.astro = {};
        }

        if (!data.astro.frontmatter) {
          data.astro.frontmatter = {};
        }

        data.astro.frontmatter.title = title;

        // Remove the original H1 heading from the content
        if (parent && index !== undefined) {
          parent.children.splice(index, 1);
        }

        return EXIT;
      }
    });
  };

export const remarkLastModified: Plugin<[], mdast.Root> =
  () => async (_, file) => {
    if (!file.data.astro?.frontmatter) {
      return;
    }

    const filepath = file.history[0];
    const command = `git log -1 --pretty="format:%cI" "${filepath}"`;

    file.data.astro.frontmatter.lastModified = await new Promise(
      (resolve, reject) =>
        exec(command, (error, stdout) => {
          if (error) {
            const contextualError = new Error(
              `Failed to retrieve last modified date via git log for file "${filepath}": ${error.message}`,
            );

            (contextualError as any).cause = error;

            reject(contextualError);
          } else {
            resolve(stdout.trim());
          }
        }),
    );
  };

export interface RemarkRevertTextDirectiveOptions {
  allowedNames?: string[];
}

export const remarkRevertTextDirective: Plugin<
  [RemarkRevertTextDirectiveOptions],
  mdast.Root
> =
  ({ allowedNames = [] }) =>
  (tree) => {
    visit(tree, "textDirective", (node, index, parent) => {
      if (allowedNames.includes(node.name) || index === undefined || !parent)
        return;

      parent.children.splice(index, 1, {
        type: "text",
        value: `:${node.name}`,
      });
    });
  };

export const rehypeFancybox: Plugin<[], hast.Root> = () => (tree) => {
  visit(tree, "element", (node, _, parent) => {
    if (node.tagName !== "img") return;
    if (
      parent?.type === "element" &&
      (parent.tagName === "a" || parent.tagName === "p")
    ) {
      return;
    }

    node.properties = {
      ...node.properties,
      "data-fancybox": "article-gallery",
    };
  });
};

export const rehypeTypstMathDisplay: Plugin<[], hast.Root> = () => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName !== "svg" ||
        !(node.properties?.className as string[])?.includes("typst-doc")
      ) {
        return;
      }

      if (index === undefined) return;
      if (!parent || parent.type !== "element") return;
      if (parent.tagName !== "p") return;
      if (parent.children.length !== 1) return;

      node.properties = {
        ...node.properties,
        dataMathDisplay: true,
      };
    });
  };
};

export const rehypeRecordHeadings: Plugin<[], hast.Root> = () => {
  return (tree, file) => {
    const slugs: string[] = [];

    visit(tree, "element", (node) => {
      if (/^h[1-6]$/.test(node.tagName) && node.properties?.id) {
        slugs.push(String(node.properties.id));
      }
    });

    if ((file.data as any).astro?.frontmatter) {
      (file.data as any).astro.frontmatter.validHeadingSlugs = slugs;
    }
  };
};

export interface RehypeBudouxOptions {
  include?: string[];
}

export const rehypeBudoux: Plugin<[RehypeBudouxOptions], hast.Root> = ({
  include = [],
}) => {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (node.value.trim().length === 0) return;
      if (index === undefined) return;
      if (!parent || parent.type !== "element") return;
      if (!include.includes(parent.tagName)) return;

      const parsedNode = budouxParser
        .parse(node.value)
        .flatMap((value, i) => [
          ...(i > 0 ? [h("wbr")] : []),
          { type: "text" as const, value },
        ]);

      parent.children.splice(index, 1, ...parsedNode);

      if (parsedNode.length > 1) {
        parent.properties ??= {};
        parent.properties.dataBudoux = true;
      }
    });
  };
};
