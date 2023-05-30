const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const Conflict = require('../utils/errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден :( ');
      }
      return res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.send({
        _id: userObject._id,
        name: userObject.name,
        email: userObject.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Данная почта уже зарегистрирована :( '));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании пользователя :( '));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFound('Пользователь с данным _id не найден :(');
      }
      return res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Данная почта уже зарегистрирована :( '));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при обновлении профиля :('));
      } else {
        next(err);
      }
    });
};
