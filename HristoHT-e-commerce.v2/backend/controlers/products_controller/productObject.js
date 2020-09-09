const requiredParam = require('../../utils/requiredParam');
// const stringNormalization = require('../../utils/StringNormalization');
const validationError = require('../../utils/ValidationError');
const CustomError = require('../../utils/CustomError');
const ValidationError = require('../../utils/ValidationError');
const { toNumber } = require('../../utils/formatValue');
/**
 * Normalizing and validating object and transforming it in product object
 * 
 * @param {object} param0 
 */
const productObject = ({
    name = requiredParam('име'),
    // tags = ValidationError('Нужен е поне един таг'),
    measures = ValidationError('Нужен е поне едина разфасовка'),
    description = requiredParam('описание'),
    image = null,
}) => {
    // console.log('name=', product_name.length)
    if (name.length < 6 || name.length > 32) {
        ValidationError('Името на продукта трябва да е не по-малко от 6 символа, и не по-голямо от 32');
    }

    // if (!tags || tags.length === 0) {
    //     ValidationError('Изберете поне един таг');
    // }

    if (!measures || measures.length === 0) {
        ValidationError('Изберете поне една разфасовка');
    }

    return Object.freeze({
        product: Object.freeze({
            name,
            description,
            image,
            visable:false
        }),
        
        measures: Object.freeze([
            ...measures,
        ])
    })
}

module.exports = productObject;