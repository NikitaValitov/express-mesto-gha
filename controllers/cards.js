/* eslint-disable no-shadow */
const card = require('../models/card');
const { ERROR_CODE } = require('../constants/constants');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card
    .create({ name, link, owner })
    .then((cards) => res.status(ERROR_CODE.CREATED).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

module.exports.getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.status(ERROR_CODE.OK).send(cards))
    .catch(() => res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' }));
};

module.exports.deleteCard = (req, res) => {
  card
    .findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Карточка не найдена.' });
      } if (req.user._id !== card.owner.toString()) {
        res.status(ERROR_CODE.FORBIDDEN).send({ message: 'Нельзя удалять карточки других пользователей.' });
      } card.remove().then(() => {
        res.status(ERROR_CODE.OK).send({ message: 'Карточка удалена.' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  card
    .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      } else {
        res.status(ERROR_CODE.OK).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные при постановке лайка.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  card
    .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      } else {
        res.status(ERROR_CODE.OK).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};
