/* eslint-disable no-shadow */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const { ERROR_CODE } = require('../constants/constants');
// const { NotFoundError } = require('../constants/NotFoundError');
const { BadRequestError } = require('../constants/BadRequestError');

module.exports.getUsers = (req, res, next) => {
  user
    .find({})
    .then((users) => res.status(ERROR_CODE.OK).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  user
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден.' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорретный Id'));
        return;
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  user
    .findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((users) => res.status(ERROR_CODE.OK).send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Передан невалидный ID.' });
      } if (err.message === 'NotFound') {
        res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден.' });
      } else next(err);
    });
};

module.exports.createUser = (req, res, next) => {
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
      } else next(err);
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

module.exports.updateUser = (req, res, next) => {
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
      } else next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
      } else next(err);
    });
};
