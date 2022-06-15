import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import pkg from "../package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
    {
      file: pkg.jsdelivr,
      format: "umd",
      name: "monitor", // 注入window对象名
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    json(),
    babel({
      extensions: [".js", ".ts"],
      exclude: "node_modules/**",
    }),
  ],
};
