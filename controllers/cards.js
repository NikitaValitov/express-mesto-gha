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
    .catch(() => res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Карточка не найдена.' }));
};

module.exports.deleteCard = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!card) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Карточка не найдена.' });
      } else {
        res.status(ERROR_CODE.OK).send({ cards });
      }
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
    .then((cards) => {
      if (!card) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      } else {
        res.status(ERROR_CODE.OK).send({ cards });
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
    .then((cards) => {
      if (!card) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Передан несуществующий id карточки.' });
      } else {
        res.status(ERROR_CODE.OK).send({ cards });
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
