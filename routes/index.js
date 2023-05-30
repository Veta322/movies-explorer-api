const routes = require('express').Router();
const cors = require('cors');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { validateRegister, validateLogin } = require('../utils/validators');

routes.use('*', cors());

routes.post('/signup', validateRegister, createUser);
routes.post('/signin', validateLogin, login);

routes.use(auth);

routes.use('/users', require('./users'));
routes.use('/movies', require('./movies'));

module.exports = { routes };
