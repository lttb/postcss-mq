'use strict'

const postcss = require('postcss')

const { prepareExpressions, buildParams } = require('./expressions')

const initTarget = options => Object.assign({}, options, { rules: postcss.root() })

const createProcessor = options => (target, prev = { vw: 0 }) => {
  const rules = postcss.root()

  const wrap = (params, transform) => {
    if (options.comments) {
      rules.append(postcss.comment({ text: `starts: ${params}` }))
    }

    transform()

    if (options.comments) {
      rules.append(postcss.comment({ text: `ends: ${params}` }))
    }
  }

  const processor = (node) => {
    if (!(node.type === 'atrule' && node.name === 'media')) {
      rules.append(node.clone())

      return
    }

    const variants = postcss.list.comma(node.params)

    for (const params of variants) {
      const expressions = prepareExpressions(params)

      const min = expressions['min-width'] || -Infinity
      const max = expressions['max-width'] || Infinity

      if (!(target.vw >= min && prev.vw <= max)) return

      if (prev.vw >= min) delete expressions['min-width']
      if (target.vw <= max) delete expressions['max-width']

      wrap(params, () => {
        const exprTotal = Object.keys(expressions).length

        if (!exprTotal || (exprTotal === 1 && 'all' in expressions)) {
          rules.append(...node.nodes.map(x => x.clone({ parent: null })))
        } else {
          rules.append(node.clone({ params: buildParams(expressions) }))
        }
      })
    }
  }

  return Object.assign(processor, { rules, target })
}

module.exports.initTarget = initTarget
module.exports.createProcessor = createProcessor
