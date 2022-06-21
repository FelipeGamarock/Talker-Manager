const { readFile } = require('fs').promises;

const readTalkerFile = async () => {
  const talker = await readFile('./talker.json', 'utf8');
  return JSON.parse(talker);
};

module.exports = readTalkerFile;