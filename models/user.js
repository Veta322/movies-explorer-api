const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Unauthorized = require('../utils/errors/Unauthorized'); // 401

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Олег',
    minlength: [2, 'минимальная длина поля "name" - 2'],
    maxlength: [30, 'максимальная длина поля "name" - 30'],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль :( '));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильные почта или пароль :( '));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
