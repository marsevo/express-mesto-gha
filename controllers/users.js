const User = require('../models/user')

const { ERROR_VALIDATION, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(err => {
      res.status(ERROR_DEFAULT).send({ message: `Произошла ошибка при получении пользователей`, err: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => {
      res.send(user)
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
      } else {
        res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message })
      }
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь с указанным ID не найден ` });
      }
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message });
      } else {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id; // Получаем _id пользователя из объекта req.user

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь не найден` });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
      } else {
        res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message })
      }
    })
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id; // Получаем _id пользователя из объекта req.user
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь не найден` });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
      } else {
        res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message })
      }
    })
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};