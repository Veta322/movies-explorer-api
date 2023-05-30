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

app.use(requestLogger);
app.use(routes);
app.use('*', (req, res, next) => { next(new NotFound('Запрашиваемый адрес не найден :(')); });
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
