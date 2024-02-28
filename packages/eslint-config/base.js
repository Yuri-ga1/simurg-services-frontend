const inherit = require('./inherit.js');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...inherit,
  extends: ['airbnb-base', 'airbnb-typescript/base', 'plugin:prettier/recommended'],
};
