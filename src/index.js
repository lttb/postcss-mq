'use strict'

const fs = require('fs')
const path = require('path')

const postcss = require('postcss')

const { createProcessor } = require('./processor')

const out = ({ output, plugins = [] }, processors) => {
  processors.forEach(({ target, rules }) => {
    postcss(plugins)
      .process(rules)
      .then((result) => {
        fs.writeFile(path.join(output, target.file), result.css, (err) => {
          if (err) {
            throw new Error(err)
          }
        })
      })
  })
}

const processFiles = (options, ast) => {
  const processNode = createProcessor(options)

  const processors = options.targets
    .map((target, i, targets) => processNode(target, targets[i - 1]))

  ast.each(node => processors.forEach(fn => fn(node)))

  return processors
}

const plugin = options => ast => out(options, processFiles(options, ast))

const postcssPlugin = postcss.plugin('postcss-mq', plugin)

module.exports = postcssPlugin
module.exports.processFiles = processFiles
