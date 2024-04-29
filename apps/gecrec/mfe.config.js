module.exports = {
  port: 9003,
  federation: {
    exposes: {
      './Module': './src/remote-entry.ts',
    },
  },
};
