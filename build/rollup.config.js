const json = require("rollup-plugin-json")
const resolve = require("rollup-plugin-node-resolve")
const pkg = require("../package.json")
const ts = require("rollup-plugin-typescript2")
const { eslint } = require("rollup-plugin-eslint")
const commonjs = require("rollup-plugin-commonjs") // commonjs模块转换插件

const path = require("path")

const getPath = _path => path.resolve(__dirname, _path);

const extensions = [
  '.js',
  '.ts'
]

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
    resolve(extensions),
    json(),
    commonjs(),
    eslint({
      throwOnError: true,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/**', 'lib/**']
    }),
    ts({
      tsconfig: getPath('../tsconfig.json'), // 导入本地ts配置
      extensions
    })
  ],
};
