import config from "./index.js";

const ignores = ["**/node_modules/*"];

export default [
  ...config,
  {
    ignores,
  },
];
