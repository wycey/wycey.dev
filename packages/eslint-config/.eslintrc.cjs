module.exports = {
    extends: ["./index.cjs"],
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
    },
};
