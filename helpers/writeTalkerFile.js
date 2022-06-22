const { writeFile } = require('fs').promises;

const writeTalkerFile = async (data) => {
  await writeFile('./talker.json', JSON.stringify(data));
};

module.exports = writeTalkerFile;