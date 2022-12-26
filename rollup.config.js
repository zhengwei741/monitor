const json = require("rollup-plugin-json");
const resolve = require("rollup-plugin-node-resolve");
const ts = require("rollup-plugin-typescript2");
const commonjs = require("rollup-plugin-commonjs"); // commonjs模块转换插件
const clear = require("rollup-plugin-clear");
const size = require("rollup-plugin-sizes");
const { visualizer } = require("rollup-plugin-visualizer");
const { terser } = require("rollup-plugin-terser");

const path = require("path");

if (!process.env.TARGET) {
  throw new Error("缺少 TARGET");
}
const name = process.env.TARGET;
// packages 路径
const packagesDir = path.resolve(__dirname, "packages");
// packages 下包的路径
const packageDir = path.resolve(packagesDir, process.env.TARGET);
// 旧dist路径
const packageDirDist =
  process.env.LOCALDIR === "undefined"
    ? `${packageDir}/dist`
    : process.env.LOCALDIR;
// package.json
const pkgDir = path.resolve(packageDir, "./package.json");
const pkg = require(pkgDir);
// 是否生成申明文件
const isDeclaration = process.env.TYPES !== "false";

const filter = (keys = []) => keys.filter((key) => !key.startsWith("@monitor"));

const common = {
  input: `${packageDir}/src/index.ts`,
  external: [
    ...filter(Object.keys(pkg.dependencies || {})),
    ...filter(Object.keys(pkg.peerDependencies || {})),
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    // 打包大小
    size(),
    // 打包分析
    visualizer(),
    json(),
    commonjs({
      exclude: "node_modules",
    }),
    ts({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      // 就是用来编译 TypeScript 文件，useTsconfigDeclarationDir
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: isDeclaration, // 是否自动创建类型声明文件
          declarationMap: isDeclaration, // 是否生成.map文件
          // 声明文件路径
          declarationDir: `${packageDirDist}`,
          module: "ES2015",
        },
      },
      include: ["*.ts+(|x)", "**/*.ts+(|x)", "../**/*.ts+(|x)"],
    }),
    clear({
      targets: [packageDirDist],
    }),
  ],
  output: {
    name: "MONITOR",
    globals: {
      "crypto-js": "CryptoJS",
    },
  },
};

const esmPackage = {
  ...common,
  output: {
    file: `${packageDirDist}/${name}.esm.js`,
    format: "es",
    sourcemap: true,
    ...common.output,
  },
  plugins: [
    ...common.plugins,
    clear({
      targets: [packageDirDist],
    }),
  ],
};

const cjsPackage = {
  ...common,
  external: [],
  output: {
    file: `${packageDirDist}/${name}.js`,
    format: "cjs",
    sourcemap: true,
    minifyInternalExports: true,
    ...common.output,
  },
  plugins: [...common.plugins],
};

const iifePackage = {
  ...common,
  // external: [...common.external],
  external: [],
  output: {
    file: `${packageDirDist}/${name}.min.js`,
    format: "iife",
    ...common.output,
  },
  plugins: [...common.plugins, terser()],
};

const umdPackage = {
  ...common,
  // external: [...common.external],
  external: [],
  output: {
    file: `${packageDirDist}/${name}.umd.js`,
    format: "umd",
    ...common.output,
  },
  plugins: [...common.plugins],
};

const total = {
  esmPackage,
  cjsPackage,
  iifePackage,
  umdPackage,
};
let result = total;

export default [...Object.values(result)];
