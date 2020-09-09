const requiredParam = require('../../utils/requiredParam');
const ValidationError = require('../../utils/ValidationError');
const { toNumber, format } = require('../../utils/formatValue');

const toUser = ({
    name = requiredParam('потребителско име'),
    password = requiredParam('парола'),
    email = requiredParam('е-маил адрес'),
    confirmPassword = requiredParam('потвърди парола'),
}) => {
    try {
        if (name.length < 3) {
            ValidationError('Потребителското име трябва да е с дължина по-голяма от 2 символа');
        }

        if (email < 6) {
            ValidationError('Въведете валиден е-маил адрес');
        }

        if (password !== confirmPassword) {
            ValidationError('Паролите не съвпадат');
        }

        return {
            name,
            password,
            email,
        }
    } catch (e) {
        throw e;
    }
};

const toUserLogin = ({
    name = requiredParam('потребителско име'),
    password = requiredParam('парола'),
}) => {
    return {
        name,
        password,
    }
};

module.exports = { toUser, toUserLogin };