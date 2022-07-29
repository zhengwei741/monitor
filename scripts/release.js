const fs = require('fs')
const path = require('path')
const { prompt } = require('enquirer')
const semver = require('semver')

const currentVersion = require('../package.json').version

const versionIncrements = ['patch', 'minor', 'major']
const inc = v => semver.inc(currentVersion, v)

main()

async function main() {
  // prompt 选择发布版本
  const { release } = await prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(i => `${i} (${inc(i)})`)
  })

  const targetVersion = release.match(/\((.*)\)/)[1]

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`
  })

  if (!yes) {
    return
  }

  // jest 测试用例

  await updateVersions(targetVersion)
}

async function updateVersions (version) {
  // 更新版本号
    // 1.更新主版本
  updatePackage()
    // 2.更新所有包版本
}

function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  updateDeps(pkg, 'dependencies', version)
  updateDeps(pkg, 'peerDependencies', version)
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function updateDeps(pkg, depType, version) {

}


// 打包
// 日志
// update pnpm-lock.yaml
// git add commit
// 发布包至 npm
// 提交 github