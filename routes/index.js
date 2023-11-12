const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { ERROR_CODE } = require('../constants/constants');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res
    .status(ERROR_CODE.NOT_FOUND)
    .send({ message: 'Страница не найдена.' });
});

module.exports = router;
