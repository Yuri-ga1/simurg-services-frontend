module.exports = {
  port: 9002,
  federation: {
    exposes: {
      './App': './src/app',
    },
  },
};
