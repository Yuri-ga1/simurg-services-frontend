/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['apps/**', 'packages/**'],
  extends: ['@repo/eslint-config/node'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
