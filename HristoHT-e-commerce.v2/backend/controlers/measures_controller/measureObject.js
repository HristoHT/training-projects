const requiredParam = require('../../utils/requiredParam');
const ValidationError = require('../../utils/ValidationError');
const { toNumber, format } = require('../../utils/formatValue');

/**
 * Нормализира и валидира обект, превръщайки го в measure обект
 * 
 * @param {object} obj 
 */
const measureObject = ({
    name = requiredParam('име'),
    quantity = requiredParam('количество'),
    price = requiredParam('цена'),
}) => {
    if (name.length < 6 || name.length > 32) {
        ValidationError('Името на разфасовката трябва да е не по-малко от 6 символа, и не по-голямо от 32');
    }
    name = format(name, { type: 'String' });

    if (toNumber(quantity) <= 0) {
        ValidationError('Количеството трябва да е по-голямо от 0');
    }

    if (toNumber(price) <= 0) {
        ValidationError('Цената трябва да е по-голямо от 0');
    }

    return Object.freeze({
        name,
        quantity,
        price
    })
}

module.exports = measureObject;