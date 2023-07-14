const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { ERROR_NOT_FOUND } = require('./errors/errors');

 const { PORT = 3000 } = process.env;

 const app = express();
 app.use(express.json());

 /**временное решение авторизации */

 app.use((req, res, next) => {
  req.user = {
    _id: '64aed3396545bebab401013f' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

 app.use(router);
 app.use('/', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Что-то пошло не так...'});
  });

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
