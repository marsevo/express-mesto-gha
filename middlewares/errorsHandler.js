const { ERROR_DEFAULT } = require('../errors/errors');

const errorsHandler = (err, req, res, next) => {
  const { statusCode = ERROR_DEFAULT } = err;
  const message = statusCode === ERROR_DEFAULT ? 'Произошла ошибка на сервере' : err.message;

  res.status(statusCode).send({ message });
  next();
};

module.exports = errorsHandler;
