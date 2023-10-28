const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '653b9ac210905f22c819239b',
  };

  next();
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(router);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
