module.exports = {
  plugins: [
    require("postcss-lightningcss")({
      browsers: [">= 0.25%", "not dead"],
    }),
    require("@pandacss/dev/postcss")(),
  ],
};
