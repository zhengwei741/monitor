/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require("./package.json")
const resolve = require("rollup-plugin-node-resolve")
const json = require("rollup-plugin-json")
const path = require('path')

const extensions = [
  '.js'
]

export default {
  input: path.resolve(__dirname, 'src/index.js'),
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
      name: "monitorWeb", // 注入window对象名
      sourcemap: true
    },
  ],
  plugins: [
    resolve(extensions),
    json()
  ]
}