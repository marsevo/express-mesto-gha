const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

const ErrorNotFound = require('../errors/errorNotFound');
const { validateCreateUser, validateLogin } = require('../utils/regex');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);
router.get('/signout', logout);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res, next) => {
  next(new ErrorNotFound('Нет такого маршрута'));
});

module.exports = router;
