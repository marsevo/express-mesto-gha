const ErrorValidation = require('../errors/errorValidation');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorForbidden = require('../errors/errorForbidden.js');
const Card = require('../models/card');

// Функция для обработки операций с карточками
const handleCardOperation = (operation) => (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  operation(cardId, userId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrorValidation(`Переданные данные некорректны`));
      } else if (err.name === 'NotFoundError') {
        next(new ErrorNotFound(err.message));
      } else if (err.name === 'ForbiddenError') {
        next(new ErrorForbidden(err.message));
      } else {
        next(err);
      }
    });
};

// Функция для создания новой карточки
const createCard = (name, link, owner) => {
  return Card.create({ name, link, owner });
};

// Функция для удаления карточки по ID
const removeCardById = (cardId, userId) => {
  return Card.findById(cardId)
    .orFail(() => new Error('Карточка для удаления не найдена'))
    .then((card) => {
      if (card.owner.toString() === userId) {
        return card.deleteOne();
      } else {
        throw new Error('Чужую карточку удалить нельзя');
      }
    });
};

// Функция для установки лайка на карточке
const putCardLike = (cardId, userId) => {
  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => new Error('Карточка не найдена'));
};

// Функция для удаления лайка с карточки
const removeCardLike = (cardId, userId) => {
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => new Error('Карточка не найдена'));
};

// Контроллер для получения всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

// Контроллер для создания новой карточки
const createCardController = handleCardOperation((cardId, userId) => {
  const { name, link } = req.body;
  return createCard(name, link, userId);
});

// Контроллер для удаления карточки по ID
const removeCardByIdController = handleCardOperation((cardId, userId) => {
  return removeCardById(cardId, userId);
});

// Контроллер для установки лайка на карточке
const putCardLikeController = handleCardOperation((cardId, userId) => {
  return putCardLike(cardId, userId);
});

// Контроллер для удаления лайка с карточки
const removeCardLikeController = handleCardOperation((cardId, userId) => {
  return removeCardLike(cardId, userId);
});

module.exports = {
  getCards,
  createCard: createCardController,
  removeCardById: removeCardByIdController,
  putCardLike: putCardLikeController,
  removeCardLike: removeCardLikeController,
};
