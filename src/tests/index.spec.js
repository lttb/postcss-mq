'use strict'

const postcss = require('postcss')
const stripIndent = require('strip-indent')
const mq = require('../')

const strip = strings => stripIndent(strings.raw[0]).trim()

const getProcessors = (options, css) => new Promise((resolve) => {
  postcss().process(css).then((result) => {
    resolve(mq.processFiles(options, result.root))
  })
})

const getRules = (options, css) => getProcessors(options, css)
  .then(processors => processors.map(({ rules }) => rules.toString().trim()))

describe('postcss-mq', () => {
  it('should smth', async () => {
    const rules = await getRules({
      targets: [
        { vw: 500 },
        { vw: 900 },
      ],
    }, strip`
      @media (min-width:250px) {
        .test1 {}
      }

      @media (min-width:250px) and (max-width:400px) {
        .test2 {}
      }

      @media (min-width:250px) and (max-width:600px) {
        .test3 {}
      }

      @media (min-width:600px) and (max-width:800px) {
        .test4 {}
      }

      @media (min-width:250px) and (max-width:1000px) {
        .test5 {}
      }
    `)

    expect(rules).toEqual([
      strip`
        @media (min-width:250px) {
          .test1 {}
        }

        @media (min-width:250px) and (max-width:400px) {
          .test2 {}
        }

        @media (min-width:250px) {
          .test3 {}
        }

        @media (min-width:250px) {
          .test5 {}
        }
      `,
      strip`
        .test1 {}

        @media (max-width:600px) {
          .test3 {}
        }

        @media (min-width:600px) and (max-width:800px) {
          .test4 {}
        }

        .test5 {}
      `,
    ])
  })
})
