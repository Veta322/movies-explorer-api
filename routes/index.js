const { errors } = require('celebrate');
const routes = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { validateRegister, validateLogin } = require('../utils/validators');
const { handleError } = require('../middlewares/errorHandler');
const NotFound = require('../utils/errors/NotFound');
const { requestLogger, errorLogger } = require('../middlewares/logger');

routes.use(requestLogger);

routes.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

routes.post('/signup', validateRegister, createUser);
routes.post('/signin', validateLogin, login);

routes.use(auth);

routes.use('/users', require('./users'));
routes.use('/movies', require('./movies'));


routes.all('*', (req, res, next) => { next(new NotFound('Запрашиваемый адрес не найден :( ')); });

routes.use(errorLogger);

routes.use(errors());

routes.use(handleError);

module.exports = { routes };
