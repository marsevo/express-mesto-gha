const { ERROR_VALIDATION } = require('./errors');

class ErrorValidation extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_VALIDATION;
  }
}

module.exports = ErrorValidation;
