const { readFileSync } = require('fs');

const readFile = () => {
  const talker = readFileSync('./talker.json');
  return talker;
};

module.exports = readFile;