'use babel'

const REQUIRE_PATTERN = /require\((\'|\")(.||..)*?([a-z0-9A-Z\/\.]+)(\'|\")\)/g
const CLEANUP_REQUIRE_PATTERN = /(require\(|\)|\'|\")/g

module.exports = (text, deprecatedFiles, filePath) => {
  return new Promise((resolve, reject) => {
    return resolve(
      (text || '')
        .split(/\n/)
        .map((text, line) => {
          const requireStatments = (text || '').match(REQUIRE_PATTERN);
          return {
            line,
            length: text.length - 1,
            moduleImport: requireStatments ?
                requireStatments.map(s => (s || '').replace(CLEANUP_REQUIRE_PATTERN, ''))[0]:
                null
          }
        })
        .filter(s => s.moduleImport)
        .map(({
          line,
          length,
          moduleImport
        }) => {
          const deprecation = deprecatedFiles.filter(dpFiles => {
            return moduleImport
                .split(/\//)
                .pop()
                .match(new RegExp(dpFiles.fileName, 'gi'))
          })[0];
          if (!deprecation) return
          return {
            type: 'Warning',
            text: `${moduleImport} is deprecated ${deprecation.replacement ? `please use ${deprecation.replacement}`: ''}`,
            range: [[line, 0], [line, length]],
            filePath
          }
        })
        .filter(d => d)
    )
  })
}
