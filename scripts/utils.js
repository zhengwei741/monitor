const fs = require('fs')
const chalk = require('chalk')

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