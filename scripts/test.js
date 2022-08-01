const fs = require('fs')
const path = require('path')
const packages = fs
  .readdirSync(path.resolve(__dirname, '../packages'))

console.log(packages)

packages.forEach(package => {
  console.log(
    path.resolve(__dirname, '../packages', package)
  )
})

