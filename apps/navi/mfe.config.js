module.exports = {
  port: 9001,
  federation: {
    exposes: {
      './Module': './src/remote-entry.ts',
    },
  },
};
