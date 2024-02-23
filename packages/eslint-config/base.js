const _base = require('./_base.js');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ..._base,
  extends: ['airbnb-base', 'airbnb-typescript/base', 'plugin:prettier/recommended'],
};
