const { ERROR_VALIDATION, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../errors/errors');
const Card = require('../models/card');

// Общая логика для обработки ошибок при выполнении операций с карточками
const handleCardOperation = (req, res, operation) => {
  const { cardId } = req.params;
  operation(cardId)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданные данные некорректны' });
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла неизвестная ошибка', err: err.message });
      }
    });
};

// Контроллер для получения всех карточек
const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(ERROR_DEFAULT).send({ message: 'Произошла неизвестная ошибка', err: err.message });
    });
};

// Контроллер для создания новой карточки
const createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданные данные некорректны' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла неизвестная ошибка', err: err.message });
      }
    });
};

// Контроллер для удаления карточки по ID
const removeCardById = (req, res) => {
  handleCardOperation(req, res, (cardId) =>
  Card.findByIdAndRemove(cardId).orFail(() => new Error('Not Found')));
};

// Контроллер для установки лайка на карточке
const putCardLike = (req, res) => {
  handleCardOperation(req, res, (cardId) =>
    Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error('Not Found'))
  );
};

// Контроллер для удаления лайка с карточки
const removeCardLike = (req, res) => {
  handleCardOperation(req, res, (cardId) =>
    Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error('Not Found'))
  );
};

module.exports = {
  getCards,
  createCard,
  removeCardById,
  putCardLike,
  removeCardLike,
};
