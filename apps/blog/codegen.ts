import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "https://api-ap-northeast-1.hygraph.com/v2/clergv2wt1g3x01uehrr70w9n/master",
    documents: "src/graphql/**/*.graphql",
    generates: {
        "src/generated/graphql.ts": {
            plugins: ["typescript", "typescript-operations", "typescript-urql"],
        },
        "src/generated/graphql.schema.json": {
            plugins: ["urql-introspection"],
        },
    },
};

export default config;
