/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes');
const { validationLogin, validationCreateUser } = require('./middlewares/validation');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { centralizedErrorHandler } = require('./middlewares/centralizedErrorHandler');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use(auth, router);
app.use(errors());
app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
