'use babel'

const fs = require('fs')
const path = require('path')
const CompositeDisposable = require('atom').CompositeDisposable
const deprecationChecker = require('./deprecation-checker')

class DeprecationNotice {
  static activate (state) {
    const {project} = atom.workspace
    project.rootDirectories.forEach(dir => {
      const dirPkgPath = path.resolve(dir.path, './package.json')
      fs.stat(dirPkgPath, (err, stat) => {
        if (err || !stat || !stat.isFile()) return
        const pkg = require(dirPkgPath)
        if (!pkg || !pkg.deprecated) return
        for (let fileName in pkg.deprecated) {
          if (typeof  this.deprecatedFiles === 'undefined') {
            this.deprecatedFiles = []
          }
          this.deprecatedFiles.push({
            fileName,
            replacement: pkg.deprecated[fileName]
          })
        }
      })
    })
    // console.log('activated')
  }
  static provideLinter () {
    return {
      name: 'Deprecation Notice',
      grammarScopes: ['source.js', 'source.jsx', 'source.js.jsx'],
      scope: 'file',
      lintOnFly: true,
      lint: textEditor => (
        deprecationChecker(textEditor.getText(), this.deprecatedFiles, textEditor.getPath())
      )
    }
  }
}

module.exports = DeprecationNotice
