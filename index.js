const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const readTalkerFile = require('./helpers/readTalkerFile');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOTFOUND_STATUS = 404;
const PORT = '3000';

app.get('/talker', async (_req, res) => {
    const talkers = await readTalkerFile();
    res.status(HTTP_OK_STATUS).send(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalkerFile();
  const talkerFound = talkers.find((talker) => talker.id === Number(id));
  if (talkerFound) return res.status(HTTP_OK_STATUS).send(talkerFound);
  return res.status(HTTP_NOTFOUND_STATUS).send({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(HTTP_OK_STATUS).send({ token });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
