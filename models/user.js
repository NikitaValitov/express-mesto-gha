const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле является обязательным'],
    minlength: [2, 'минимальная длина 2 символа'],
    maxlength: [30, 'максимальаня длина 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Поле является обязательным'],
    minlength: [2, 'минимальная длина 2 символа'],
    maxlength: [30, 'максимальаня длина 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле является обязательным'],
  },
});

module.exports = mongoose.model('user', userSchema);
