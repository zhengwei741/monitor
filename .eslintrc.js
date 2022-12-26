const path = require("path");
const resolve = (_path) => path.resolve(__dirname, _path);

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: resolve("./"),
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-explicit-any": ["off"],
  },
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"],
    },
  ],
};
