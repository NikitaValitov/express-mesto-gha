/* eslint-disable no-undef */
const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isURL } = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    required: [true, 'Поле является обязательным'],
    minlength: [2, 'минимальная длина 2 символа'],
    maxlength: [30, 'максимальаня длина 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    required: [true, 'Поле является обязательным'],
    minlength: [2, 'минимальная длина 2 символа'],
    maxlength: [30, 'максимальаня длина 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: [true, 'Поле является обязательным'],
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле является обязательным'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле является обязательным'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильная почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
