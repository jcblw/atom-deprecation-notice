'use babel'

const REQUIRE_PATTERN = /require\((\'|\")(.||..)*?([a-z0-9A-Z\/\.]+)(\'|\")\)/g
const CLEANUP_REQUIRE_PATTERN = /(require\(|\)|\'|\")/g

module.exports = (text, deprecatedFiles, filePath) => {
  return Promise.resolve(
    (text || '')
      .split(/\n/)
      .map((lineText, line) => {
        const requireStatment = ((lineText || '').match(REQUIRE_PATTERN) || [])[0]
        const requireStart = lineText.indexOf(requireStatment)
        const requireEnd = requireStart + (requireStatment || '').length
        return {
          line,
          range: [requireStart, requireEnd],
          moduleImport: requireStatment?
            requireStatment.replace(CLEANUP_REQUIRE_PATTERN, ''):
            null
        }
      })
      .filter(s => s.moduleImport)
      .map(({
        line,
        range,
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
          range: [[line, range[0]], [line, range[1]]],
          filePath
        }
      })
      .filter(d => d)
  )
}
