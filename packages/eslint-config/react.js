/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [require.resolve('./base.js'), 'airbnb', 'airbnb/hooks', 'airbnb-typescript'],
  env: { browser: true },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
  },
};
