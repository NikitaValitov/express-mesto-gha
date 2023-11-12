/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(router);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
