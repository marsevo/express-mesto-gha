const jwt = require('jsonwebtoken');
const ErrorAuth = require('../errors/errorAuth');

const auth = (req, res, next) => {
  let token;
  try {
    token = req.cookies.jwt;
  } catch (err) {
    throw new ErrorAuth('Необходимо авторизоваться');
  }
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    throw new ErrorAuth('Необходимо авторизоваться');
  }
  req.user = payload;
  next();
};
module.exports = auth;
