const Card = require('../models/card');

const { ERROR_VALIDATION, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    })
    .catch(err => {
      res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message });
    })
};

const createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then(card => {
      res.send(card)
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
      } else {
        res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message })
      }
    });
};

const removeCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.send({ message: `Карточка удалена` });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: `Переданные данные некорректны` });
      }
    })
    .catch((err) => {
      res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
    });
};

const putCardLike = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: `Переданные данные некорректны` });
      } else {
      res.send(card)
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message })
      } else {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
      }
    })
};

const removeCardLike = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: `Переданные данные некорректны` });
      } else {
      res.send(card)
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message })
      } else {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
      }
    })
};

module.exports = {
  getCards,
  createCard,
  removeCardById,
  putCardLike,
  removeCardLike
};