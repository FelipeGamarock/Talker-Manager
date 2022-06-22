const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const readTalkerFile = require('./helpers/readTalkerFile');
const writeTalkerFile = require('./helpers/writeTalkerFile');
const loginMiddlewareVadition = require('./middlewares/loginValidation');
const authorizationMiddleware = require('./middlewares/authorization');
const { nomeMiddlewareVadition,
  ageMiddlewareVadition,
  talkMiddlewareVadition,
  watchedAtMiddlewareVadition,
  rateMiddlewareVadition } = require('./middlewares/postTalkerValidation');

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

app.post('/login', loginMiddlewareVadition, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(HTTP_OK_STATUS).send({ token });
});

app.post('/talker',
  authorizationMiddleware,
  nomeMiddlewareVadition,
  ageMiddlewareVadition,
  talkMiddlewareVadition,
  watchedAtMiddlewareVadition,
  rateMiddlewareVadition,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = await readTalkerFile();
    const newTalker = { id: talkers.length + 1, name, age, talk };
    talkers.push(newTalker);
    writeTalkerFile(talkers);
    res.status(201).send(newTalker);
});

app.put('/talker/:id',
  authorizationMiddleware,
  nomeMiddlewareVadition,
  ageMiddlewareVadition,
  talkMiddlewareVadition,
  watchedAtMiddlewareVadition,
  rateMiddlewareVadition,
  async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talkers = await readTalkerFile();
  const index = talkers.findIndex((talker) => talker.id === Number(id));
  if (index === -1) {
    return res.status(401).json({ message: 'Talker não encontrado' });
  }
  talkers[index] = { ...talkers[index], name, age, talk };
  writeTalkerFile(talkers);
  res.status(HTTP_OK_STATUS).send(talkers[index]);
});

app.delete('/talker/:id', authorizationMiddleware, async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalkerFile();
  const index = talkers.findIndex((talker) => talker.id === Number(id));
  if (index === -1) {
    return res.status(401).json({ message: 'Talker não encontrado' });
  }
  talkers.splice(index, 1);
  writeTalkerFile(talkers);
  res.status(204).send();
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
