/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base', 'plugin:prettier/recommended'],
  env: { node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['dist', 'node_modules', '**/*.js'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: true,
        allowNamedExports: false,
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { caughtErrors: 'all', args: 'all', argsIgnorePattern: '^_' },
    ],
    curly: ['error', 'all'],
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-destructuring': 'off',
    'no-duplicate-imports': 'error',
    'max-classes-per-file': 'off',
  },
};
