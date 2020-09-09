const requiredParam = require('../utils/requiredParam');
const ValidationError = require('../utils/ValidationError');
const stringNormalization = require('../utils/StringNormalization');
const format = require('../utils/formatValue');

const toItem = ({ name = requiredParam('име'),
    brand = requiredParam('марка'),
    description = requiredParam('описание'),
    price = requiredParam('цена'),
    img = null }) => {
    try {
        if (name.length < 3) {
            ValidationError('Полето име трябва да е най-малко 3 символа');
        }

        if (brand.length < 3) {
            ValidationError('Полето марка трябва да е най-малко 3 символа');
        }

        if (isNaN(format(price, { type: 'number-2' }))) {
            ValidationError('Полето цена трябва да съдържа валидна цена');
        }

        return {
            name: stringNormalization(name),
            brand: stringNormalization(brand),
            description,
            price: format(price, { type: 'number-2' }),
            img
        }
    } catch (e) {
        throw e;
    }
}

const searchQuery = ({ search = null, priceFrom = null, priceTo = null, brands = null } = { search: null, priceFrom: null, priceTo: null, brands: null }) => {
    let conditions = [], flag = false;

    if (search || priceTo || priceFrom) {
        conditions.push('WHERE');
    }

    if (search) {
        conditions.push(`(name ~* '${search}' OR brand ~* '${search}' OR description ~* '${search}')`);
        flag = true;
    }

    if (priceFrom) {
        if (flag) {
            conditions.push('AND');
        }

        conditions.push(`price >= ${priceFrom}`);
        flag = true;
    }

    if (priceTo) {
        if (flag) {
            conditions.push('AND');
        }

        conditions.push(`price <= ${priceTo}`);
        flag = true;
    }

    if (brands) {
        if (flag) {
            conditions.push('AND');
        }

        conditions.push(`(${brands.split(',').map(brand => (`brand='${brand}'`)).join(' OR ')})`);
        flag = true;
    }

    return conditions;
}

module.exports = { toItem, searchQuery };