module.exports = {
  port: 9003,
  federation: {
    exposes: {
      './App': './src/app',
    },
  },
};
