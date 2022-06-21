const { readFile } = require('fs').promises;

const readFiles = async () => {
  const talker = await readFile('./talker.json', 'utf8');
  return talker;
};

module.exports = readFiles;