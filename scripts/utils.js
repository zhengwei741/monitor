const fs = require('fs')
const chalk = require('chalk')
const execa = require('execa')

// packages 下所有包名
// browser core ...
exports.allTargets = fs.readdirSync('packages').filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false
  }
  const pkg = require(`../packages/${f}/package.json`)
  if (pkg.private) {
    return false
  }
  return true
})

exports.step = msg => console.log(chalk.cyan(msg))

exports.run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })