const fs = require('fs')
const path = require('path')

var filename = path.join(__dirname, 'package.json')
var pkg = JSON.parse(fs.readFileSync(filename))
pkg.main = 'lib/' + pkg.name
pkg.version = pkg.version.replace(/-?\d+$/, function(value) {
  return parseInt(value) + 1
})

fs.writeFileSync(filename, JSON.stringify(pkg, null, '  '))

var bower_filename = path.join(__dirname, 'bower.json')
var bower_package = JSON.parse(fs.readFileSync(bower_filename))
bower_package.name = pkg.name
bower_package.description = pkg.description
bower_package.keywords = pkg.keywords
bower_package.version = pkg.version
bower_package.author = pkg.author
fs.writeFileSync(bower_filename, JSON.stringify(bower_package, null, '  '))
