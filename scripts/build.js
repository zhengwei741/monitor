const { allTargets } = require('./utils')
const fs = require('fs-extra')
const execa = require('execa')
const chalk = require('chalk')

run()

// 获取参数
// 获取所有package的路径
// 利用execa 执行
async function run () {
  buildAll()
}

async function buildAll() {
  runParallel(allTargets, rollupBuild)
}

async function runParallel(sources, iteratorFn) {
  const ret = []
  for (const item of sources) {
    ret.push(
      Promise.resolve().then(() => iteratorFn(item))
    )
  }
  return Promise.all(ret)
}

async function rollupBuild(source) {
  const target = source
  console.log(
    chalk.bold(chalk.yellow(`打包开始 ${target}...`))
  )
  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `TARGET:${target}`,
      ]
        .filter(Boolean)
        .join(',')
    ],
    { stdio: 'inherit' }
  )
  console.log(
    chalk.bold(chalk.yellow(`打包完成 ${target}...`))
  )
}