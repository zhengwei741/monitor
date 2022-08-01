const fs = require('fs')
const path = require('path')
const { prompt } = require('enquirer')
const semver = require('semver')
const chalk = require('chalk')
const { step, run } = require('./utils')

const packages = fs
  .readdirSync(path.resolve(__dirname, '../packages'))

const currentVersion = require('../package.json').version

const versionIncrements = ['patch', 'minor', 'major']
const inc = v => semver.inc(currentVersion, v)

main().catch((e) => {
  updatePackage(currentVersion)
  console.log(
    chalk.red(e)
  )
})

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
  // step('jest')

  step('\nupdateVersions')
  await updateVersions(targetVersion)

  step('\n打包')
  await run('npm', ['run', 'build', '--release'])

  step('\nUpdating lockfile...')
  await run(`npm`, ['install', '--prefer-offline'])

  step('\n日志')
  await run(`npm`, ['run', 'changelog'])

  step('\n发布包至 npm')
  for (const packageName of packages) {
    await publishPackage(packageName, version)
  }

  // git add commit

  // 提交 github
}

async function updateVersions (version) {
  // 更新版本号
    // 1.更新主版本
  updatePackage(path.resolve(__dirname, '..'), version)
    // 2.更新所有包版本
  packages.forEach(package => updatePackage(package, version))
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
  const dep = pkg[depType]
  if (!dep) {
    return
  }
  Object.keys(dep).forEach(key => {
    if (key.startsWith('@monitor/')) {
      pkg[depType] = version
      console.log(
        chalk.yellow(`${pkg.name} -> ${depType} -> ${dep}@${version}`)
      )
    }
  })
}

async function publishPackage(packageName, version) {
  const packagePath = path.resolve(__dirname, '../packages', packageName)
  const pkgPath = path.resolve(packagePath, 'package.json')
  const pkg = require(pkgPath)
  if (pkg.private) return
  const pkgRoot = path.resolve(packagePath, 'dist')

  step(`发布 ${packageName} 中...`)

  try {
    await run(
      'npm',
      [
        'publish',
        '--new-version',
        version,
        '--access',
        'public',
        '--registry',
        'https://registry.npmjs.org'
      ],
      {
        cwd: pkgRoot,
        stdio: 'pipe'
      }
    )
    console.log(chalk.green(`发布成功 ${packageName}@${version}`))
  } catch (e) {
    console.log(`发布失败 ${packageName}@${version}`, error)
    throw error
  }
}
