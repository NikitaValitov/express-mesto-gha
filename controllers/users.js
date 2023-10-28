const user = require('../models/user');
const { ERROR_CODE } = require('../constants/constants');

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.status(ERROR_CODE.OK).send(users))
    .catch((err) => res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
};

module.exports.getUserById = (req, res) => {
  user
    .findById(req.params.id)
    .then((user) => res.status(ERROR_CODE.OK).send(user))
    .catch((err) => res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Пользователь не найден' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user
    .create({ name, about, avatar })
    .then((users) => res.status(ERROR_CODE.CREATED).send(users))
    .catch((err) => res.status(ERROR_CODE.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.status(ERROR_CODE.OK).send(user))
    .catch((err) => res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные в метод обновления профиля' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  user
    .findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.status(ERROR_CODE.OK).send(user))
    .catch((err) => res.status(ERROR_CODE.BAD_REQUEST).send({ message: 'Переданы некорректные данные в метод обновления аватара пользователя' }));
};