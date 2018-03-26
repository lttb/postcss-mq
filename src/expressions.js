'use strict'

const postcss = require('postcss')

const parseParams = (params) => {
  const expressions = []

  postcss.list.space(params).forEach((param) => {
    let [key, value] = postcss.list.split(param.replace(/^\(|\)$/g, ''), [':'])

    if (key.includes('(')) {
      expressions.push(...parseParams(key))

      return
    }

    if (key === 'and') return

    if (value && Number.isNaN(value) && !value.endsWith('px')) {
      key += `:${value}`
      value = undefined
    }

    expressions.push({ key, value })
  })

  return expressions
}

const handlers = {
  'min-width': (a, b = -Infinity) => Math.max(a, b),
  'max-width': (a, b = Infinity) => Math.min(a, b),
}

const prepareExpressions = params => parseParams(params)
  .reduce((acc, { key, value }) => {
    if (!(key in handlers)) {
      acc[key] = value

      return acc
    }

    const num = Number.parseInt(value, 10)

    if (key in acc) {
      console.error(`There are some duplicates with ${key} in`, params)
    }

    acc[key] = handlers[key](num, acc[key])

    return acc
  }, {})


const isKeyword = key => (key === 'not' || key === 'only')

const buildParams = expressions => Object
  .entries(expressions)
  .reduce((acc, [key, value]) => {
    if (isKeyword(key)) return acc.concat(key)

    let expr

    if (!value) {
      expr = key
    } else if (typeof value === 'number') {
      expr = `(${key}:${value}px)`
    } else {
      expr = `(${key}:${value})`
    }

    const last = acc[acc.length - 1]

    if (!last || isKeyword(last)) return acc.concat(expr)

    return acc.concat('and', expr)
  }, [])
  .join(' ')


module.exports.prepareExpressions = prepareExpressions
module.exports.buildParams = buildParams
