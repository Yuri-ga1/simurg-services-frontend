const fs = require('fs');

const prepareFederationName = (name) => name.replace(/-/g, '_');

const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

const mergeDeep = (target, ...sources) => {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

const formatMfManifest = (mfManifestPath, { isDev }) => {
  try {
    const rawData = fs.readFileSync(mfManifestPath, 'utf8');
    const data = JSON.parse(rawData);
    const formattedData = data.map((entry) => ({
      ...entry,
      url: isDev ? entry.url[0] : entry.url[1],
    }));
    return JSON.stringify(formattedData, null, 2);
  } catch (error) {
    console.error('Error reading or parsing mf-manifest.json:', error);
  }
};

const createFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File created at: ${filePath}`);
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
};

const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
    console.log(`File deleted: ${filePath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`File not found, skipping deletion: ${filePath}`);
    } else {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};

module.exports = {
  prepareFederationName,
  isObject,
  mergeDeep,
  formatMfManifest,
  createFile,
  deleteFile,
};
