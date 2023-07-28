const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const router = require('./routes');
const errorsHandler = require('./middlewares/errorsHandler');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Ограничение на 100 запросов с одного IP-адреса в течение 15 минут
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов за 15 минут
});

app.use(limiter);

app.use(router);
app.use(errors());
app.use(errorsHandler);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Успешное подключение к базе данных');
  app.listen(PORT, () => {
    console.log(`Слушаю порт ${PORT}`);
  });
}).catch((error) => {
  console.error('Ошибка подключения к базе данных:', error);
});
