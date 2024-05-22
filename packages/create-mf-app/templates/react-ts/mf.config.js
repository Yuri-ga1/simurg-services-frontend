module.exports = {
  port: 9001,
  federation: {
    exposes: {
      './App': './src/app',
    },
  },
};
