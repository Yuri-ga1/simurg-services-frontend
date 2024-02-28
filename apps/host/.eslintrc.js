/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@internal/eslint-config/react.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  rules: {
    'react-refresh/only-export-components': 'off',
  },
};
