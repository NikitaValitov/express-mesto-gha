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
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(res.status(ERROR_CODE.UNAUTHORIZED).send({ message: 'Необходима авторизация.' }));
  }
  req.user = payload;
  next();
};
