const ErrorValidation = require('../errors/errorValidation');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorForbidden = require('../errors/errorForbidden');
const Card = require('../models/card');

// Функция для обработки ошибок при работе с карточками
const handleCardError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return next(new ErrorValidation('Переданные данные некорректны'));
  } if (err.name === 'CastError') {
    return next(new ErrorValidation('Переданные данные некорректны'));
  } if (err.name === 'DocumentNotFoundError') {
    return next(new ErrorNotFound('Карточка не найдена'));
  }
  return next(err);
};

// Функция для создания новой карточки
const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => handleCardError(err, req, res, next));
};

// Функция для удаления карточки по ID
const removeCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new ErrorNotFound('Карточка для удаления не найдена'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        card.deleteOne(card)
          .then((cards) => res.send(cards))
          .catch((err) => handleCardError(err, req, res, next));
      } else {
        throw new ErrorForbidden('Чужую карточку удалить нельзя');
      }
    })
    .catch((err) => handleCardError(err, req, res, next));
};

// Функция для установки лайка на карточке
const putCardLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      } else {
        res.send(card);
      }
    })
    .catch((err) => handleCardError(err, req, res, next));
};

// Функция для удаления лайка с карточки
const removeCardLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      } else {
        res.send(card);
      }
    })
    .catch((err) => handleCardError(err, req, res, next));
};

// Контроллер для получения всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  removeCardById,
  putCardLike,
  removeCardLike,
};
