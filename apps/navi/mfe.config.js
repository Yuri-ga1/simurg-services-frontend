module.exports = {
  devPort: 9001,
  exposes: {
    './Module': './src/remote-entry.ts',
  },
};
