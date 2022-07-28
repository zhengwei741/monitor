const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const ts = require('rollup-plugin-typescript2')
// const { eslint } = require('rollup-plugin-eslint')
const commonjs = require('rollup-plugin-commonjs') // commonjs模块转换插件
const clear = require('rollup-plugin-clear')
const path = require('path')

if (!process.env.TARGET) {
  throw new Error('缺少 TARGET')
}
// packages 路径
const packagesDir = path.resolve(__dirname, 'packages')
// packages 下包的路径
const packageDir = path.resolve(packagesDir, process.env.TARGET)
// 旧dist路径
const packageDirDist = path.resolve(packagesDir, 'dist')
// package.json
const pkgDir = path.resolve(packageDir, './package.json')
const pkg = require(pkgDir)

export default {
  input: `${packageDir}/src/index.ts`,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: pkg.jsdelivr,
      format: 'umd',
      name: 'monitor', // 注入window对象名
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    json(),
    commonjs({
      exclude: 'node_modules'
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    clear({
      targets: [packageDirDist]
    })
  ],
}

// const path = require('path')
// const packagesDir = path.resolve(__dirname, 'packages', 'core')
// const pkgDir = path.resolve(packagesDir, './package.json')
// const pkg = require(pkgDir)
// console.log(pkg)