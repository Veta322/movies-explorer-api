const cors = require('cors');
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const NotFound = require('./utils/errors/NotFound');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'https://domain.veta.diploma.nomoredomains.work',
  'http://domain.veta.diploma.nomoredomains.work',
];

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (allowedCors.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.options('*', cors());
app.use(requestLogger);
app.use(routes);
app.use('*', (req, res, next) => { next(new NotFound('Запрашиваемый адрес не найден :(')); });
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
