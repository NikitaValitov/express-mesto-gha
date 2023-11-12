/* eslint-disable no-shadow */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const { ERROR_CODE } = require('../constants/constants');

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.status(ERROR_CODE.OK).send(users))
    .catch(() => res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' }));
};

module.exports.getCurrentUser = (req, res) => {
  user
    .findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((users) => res.status(ERROR_CODE.OK).send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Передан невалидный ID.' });
      } if (err.message === 'NotFound') {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  user
    .findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((users) => res.status(ERROR_CODE.OK).send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Передан невалидный ID.' });
      } if (err.message === 'NotFound') {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(ERROR_CODE.CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } if (err.code === 11000) {
        res.status(ERROR_CODE.CONFLICT).send({ message: 'Такой пользователь уже существует.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return user.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден.' });
      } else {
        res.status(ERROR_CODE.OK).send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  user
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден.' });
      } else {
        res.status(ERROR_CODE.OK).send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};
