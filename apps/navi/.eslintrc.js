/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@simurg-microfrontends/eslint-config/react.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
