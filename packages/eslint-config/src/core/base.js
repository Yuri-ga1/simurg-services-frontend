const path = require('node:path');

const project = path.resolve(process.cwd(), 'tsconfig.json');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: { browser: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prefer-arrow-functions'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ['dist', 'node_modules', '*.js', '*.cjs', 'templates'],
  rules: {
    curly: ['error', 'all'],
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-destructuring': 'off',
    'no-duplicate-imports': 'error',
    'max-classes-per-file': 'off',
    'no-restricted-exports': 'off',
    'prefer-arrow-functions/prefer-arrow-functions': [
      'error',
      {
        returnStyle: 'implicit',
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroups: [
          {
            group: 'internal',
            pattern: '~/**',
            position: 'before',
          },
        ],
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-absolute-path': 'off',
    '@typescript-eslint/promise-function-async': 'error',
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
  },
};
