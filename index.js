/**
 * Очень примитивная программа, которая имеет всего 2 операции
 * Главная задача этой программы - быть шаблоном на будущее
 */

// TODO проверить программу на известные ошибки

require('dotenv').config();

const {PrismaClient} = require('@prisma/client');
const express = require('express');
const {createClient} = require('redis');

const {DbController} = require('./db.class');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

(async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  console.log('Prisma database was connected successfully!');

  const redis = await createClient({
    url: process.env.REDIS_URL,
  });
  await redis.connect();

  const DbControllerInited = new DbController(prisma, redis);

  Object.freeze(DbControllerInited);
  global.DbController_ = DbControllerInited;

  app.listen(port, console.log(`App is running on port: ${port}`));
})();

app.post('/add', async (req, res) => {
  try {
    const body = req.body;
    if (!body) {
      res.sendCode(403);
      return;
    }
    const result = await DbController_.addToDb(body);

    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.get('/get/:product_name', async (req, res) => {
  try {
    const name = req.params.product_name;

    const result = await DbController_.getFromDb(name);

    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

