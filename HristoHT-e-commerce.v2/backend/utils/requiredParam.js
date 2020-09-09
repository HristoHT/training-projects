const CustomError = require('./CustomError');

const requiredParam = (param) => {
    throw new CustomError(409, `Полето ${param} е задължително`);
}

module.exports = requiredParam;