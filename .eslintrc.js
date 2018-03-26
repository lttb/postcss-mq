'use strict'

module.exports = {
  extends: [
    'airbnb-base',
  ],

  rules: {
    'no-unused-expressions': 'off',
    'no-multi-assign': 'off',
    'no-restricted-syntax': 'off',
    semi: ['error', 'never'],
  },

  parserOptions: {
    sourceType: 'script',
  },

  env: {
    node: true,
    jest: true,
  },
}
