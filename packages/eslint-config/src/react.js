const base = require('./core/base');
const { mergeDeep } = require('./core/utils');

/** @type {import('eslint').Linter.Config} */
module.exports = mergeDeep(
  { ...base },
  {
    extends: ['airbnb', 'airbnb/hooks', 'airbnb-typescript', 'plugin:prettier/recommended'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
      'react/state-in-constructor': 'off',
      'react/destructuring-assignment': 'off',
      'react/function-component-definition': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
    },
  },
);
