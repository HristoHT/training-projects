const requiredParam = require('../../utils/requiredParam');
// const stringNormalization = require('../../utils/StringNormalization');
const validationError = require('../../utils/ValidationError');
const CustomError = require('../../utils/CustomError');
const ValidationError = require('../../utils/ValidationError');
const { toNumber } = require('../../utils/formatValue');
/**
 * Normalizing and validating object and transforming it in cart object
 * 
 * @param {object} param0 
 */
const cartObject = ({
    user_id = requiredParam('user_id'),
    product_id = requiredParam('item_id'),
    measure_id = requiredParam('measure_id'),
    quantity = requiredParam('quantity')
}) => {
    if (toNumber(quantity) <= 0) {
        ValidationError('Въведете валидно количество');
    }

    return Object.freeze({
        user_id,
        product_id,
        measure_id,
        quantity
    })
}

module.exports = cartObject;