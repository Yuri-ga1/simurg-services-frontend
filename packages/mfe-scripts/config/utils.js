const prepareFederationName = (name) => {
  return name.replace(/-/g, '_');
};

module.exports = {
  prepareFederationName,
};
