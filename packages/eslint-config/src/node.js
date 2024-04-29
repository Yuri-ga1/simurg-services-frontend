const base = require('./core/base');
const { mergeDeep } = require('./core/utils');

/** @type {import('eslint').Linter.Config} */
module.exports = mergeDeep(
  { ...base },
  {
    extends: ['airbnb-base', 'airbnb-typescript/base', 'plugin:prettier/recommended'],
  },
);
