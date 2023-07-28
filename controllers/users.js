const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');

const ErrorValidation = require('../errors/errorValidation');
const ErrorConflict = require('../errors/errorConflict');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorAuth = require('../errors/errorAuth');

const User = require('../models/user');

// Функция для обработки ошибок при работе с пользователями
const handleUserError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return next(new ErrorValidation('Переданные данные некорректны'));
  } if (err.name === 'CastError') {
    return next(new ErrorValidation('Переданные данные некорректны'));
  } if (err.name === 'DocumentNotFoundError') {
    return next(new ErrorNotFound('Пользователь не найден'));
  } if (err.code === 11000) {
    return next(new ErrorConflict('Такой e-mail уже зарегистрирован'));
  }
  return next(err);
};

// Функция для обработки создания нового пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      name, about, avatar, email, password: hashedPassword,
    }))
    .then((user) => res.send(user.toJSON()))
    .catch((err) => handleUserError(err, req, res, next));
};

// Функция для обработки запроса всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// Функция для обработки запроса пользователя по ID
const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => handleUserError(err, req, res, next));
};

// Функция для обработки входа пользователя
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password').orFail(() => new ErrorAuth('Пользователь не найден'));
    const isValidUser = await bcrypt.compare(password, user.password);
    if (isValidUser) {
      const jwt = jsonWebToken.sign({ _id: user._id }, 'SECRET');
      res.cookie('jwt', jwt, {
        maxAge: 360000,
        httpOnly: true,
        sameSite: true,
      });
      res.send(user);
    } else {
      throw new ErrorAuth('Неправильный пароль');
    }
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы вышли из аккаунта' });
};

// Функция для обработки запроса информации о пользователе по ID
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new ErrorNotFound('Нет пользователя с указанным id'))
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, req, res, next));
};

// Функция для обновления профиля пользователя
const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, req, res, next));
};

// Функция для обновления аватара пользователя
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, req, res, next));
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  login,
  logout,
  getUserInfo,
};
