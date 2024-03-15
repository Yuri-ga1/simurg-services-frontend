/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [require.resolve('./react.js')],
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
