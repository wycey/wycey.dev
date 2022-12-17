module.exports = {
    root: true,
    extends: ["wycey", "plugin:qwik/recommended"],
    parserOptions: {
        project: ["./tsconfig.json", "./functions/tsconfig.json"],
        tsconfigRootDir: __dirname,
    },
    rules: {
        "no-console": "warn",
    },
    overrides: [
        {
            files: ["src/routes/**/*.{j,t}s{,x}"],
            plugins: ["unicorn"],
            rules: {
                "unicorn/filename-case": [
                    "error",
                    {
                        case: "kebabCase",
                    },
                ],
            },
        },
        {
            files: ["src/components/**/*.{j,t}s{,x}"],
            plugins: ["unicorn"],
            rules: {
                "unicorn/filename-case": [
                    "error",
                    {
                        cases: {
                            pascalCase: true,
                            kebabCase: true,
                            camelCase: true,
                        },
                    },
                ],
            },
        },
    ],
};
