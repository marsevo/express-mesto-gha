const router = require('express').Router();

 const { getCards, createCard, removeCardById, removeCardLike, putCardLike } = require('../controllers/cards');

 router.get('/', getCards);
 router.post('/', createCard);
 router.delete('/:cardId', removeCardById);
 router.delete('/:cardId/likes', removeCardLike);
 router.put('/:cardId/likes', putCardLike);

 module.exports = router;