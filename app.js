const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const router = require('./routes');
const errorsHandler = require('./middlewares/errorsHandler');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(router);
app.use(errors());
app.use(errorsHandler);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
}).then(() => {
  console.log('Успешное подключение к базе данных');
  app.listen(PORT, () => {
    console.log(`Слушаю порт ${PORT}`);
  });
}).catch((error) => {
  console.error('Ошибка подключения к базе данных:', error);
});
