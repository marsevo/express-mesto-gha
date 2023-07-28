const router = require('express').Router();
const {
  validateCreateCard, validateRemoveCardById, validateRemoveCardLike, validatePutCardLike,
} = require('../utils/regex');

const {
  getCards, createCard, removeCardById, removeCardLike, putCardLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);

router.delete('/:cardId', validateRemoveCardById, removeCardById);

router.delete('/:cardId/likes', validateRemoveCardLike, removeCardLike);

router.put('/:cardId/likes', validatePutCardLike, putCardLike);

module.exports = router;
