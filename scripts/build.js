const { allTargets } = require("./utils");
const execa = require("execa");
const chalk = require("chalk");
const minimist = require("minimist");
const argv = minimist(process.argv.slice(2));

let buildTypes = true;
let rollupWatch = false;
let LOCALDIR = "";
let package = "";
run();
// 获取参数
// 获取所有package的路径
// 利用execa 执行
async function run() {
  LOCALDIR = argv.local;
  buildTypes = argv.types !== "false";
  rollupWatch = argv.watch === "true";
  package = argv.package || "all";
  buildAll();
}

async function buildAll() {
  let _allTargets = allTargets;
  if (package !== "all") {
    _allTargets = allTargets.filter((target) => target === package);
  }
  runParallel(_allTargets, rollupBuild);
}

async function runParallel(sources, iteratorFn) {
  const ret = [];
  for (const item of sources) {
    ret.push(Promise.resolve().then(() => iteratorFn(item)));
  }
  return Promise.all(ret);
}

async function rollupBuild(source) {
  const target = source;
  console.log(chalk.bold(chalk.yellow(`打包开始 ${target}...`)));

  try {
    const args = [
      "-c",
      "--environment",
      [`TARGET:${target}`, `TYPES:${buildTypes}`, `LOCALDIR:${LOCALDIR}`]
        .filter(Boolean)
        .join(","),
    ];
    rollupWatch && args.push("--watch");
    await execa("rollup", args, { stdio: "inherit" });
    console.log(chalk.bold(chalk.green(`打包完成 ${target}...`)));
  } catch (e) {
    console.log(chalk.bold(chalk.red(`打包失败 ${target}...`)));
  }
}
