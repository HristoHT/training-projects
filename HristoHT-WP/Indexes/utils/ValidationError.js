const CustomError = require('../utils/CustomError');

// 409 - е статуса за валидационна грешка
const ValidationError = (message) => {throw new CustomError(409, message)};

module.exports = ValidationError;