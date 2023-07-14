const { ERROR_VALIDATION, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../errors/errors');
const User = require('../models/user');

// Общая логика для обновления данных пользователя
const updateUser = (req, res, updateData) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданные данные некорректны' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла неизвестная ошибка', err: err.message });
      }
    });
};

// Контроллер для обновления профиля пользователя
const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about });
};

// Контроллер для обновления аватара пользователя
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar });
};

// Функция-декоратор для получения всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка при получении пользователей', err: err.message });
    });
};

// Функция-декоратор для создания нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданные данные некорректны' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла неизвестная ошибка', err: err.message });
      }
    });
};

// Функция-декоратор для получения пользователя по ID
const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданные данные некорректны' });
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.status(ERROR_DEFAULT).send({ message: 'Произошла неизвестная ошибка', err: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
