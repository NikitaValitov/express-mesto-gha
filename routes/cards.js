const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validationCreateCard, validationCardBuId } = require('../middlewares/validation');

cardRouter.get('/', getCards);
cardRouter.post('/', validationCreateCard, createCard);
cardRouter.delete('/:cardId', validationCardBuId, deleteCard);
cardRouter.put('/:cardId/likes', validationCardBuId, likeCard);
cardRouter.delete('/:cardId/likes', validationCardBuId, dislikeCard);

module.exports = cardRouter;
