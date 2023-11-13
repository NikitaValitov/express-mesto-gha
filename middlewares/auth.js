/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { ERROR_CODE } = require('../constants/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(ERROR_CODE.UNAUTHORIZED).send({ message: 'Необходима авторизация.' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(res.status(ERROR_CODE.UNAUTHORIZED).send({ message: 'Необходима авторизация.' }));
    return;
  }
  req.user = payload;
  next();
};
