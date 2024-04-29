module.exports = {
  port: 9002,
  federation: {
    exposes: {
      './Module': './src/remote-entry.ts',
    },
  },
};
