/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { validationLogin, validationCreateUser } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(auth, router);
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
