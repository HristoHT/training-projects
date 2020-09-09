const toNumber = (val) => (Number(val) || 0);
const getNumber = (val, dig = 2) => toNumber(toNumber(val).toFixed(dig));
const formatNumber = (val, dig = 2) => Number.parseFloat(val).toFixed(dig);

const format = (value = null, { type = 'string', ...opts } = { type: 'string' }) => {
    if (type === 'string') {
        return `'${String(value).trim()}'`;
    } else if (type === 'String') {
        return stringNormalization(value);
    } else if (type.indexOf('number') !== -1) {
        if (type.split('-').length === 2) {
            return formatNumber(value, toNumber(type.split('-')[1]))
        }
        return toNumber(value);
    } else if (type === 'boolean'){
        return (value == 'true');
    }

    return value;
}

const stringNormalization = (str = "") => {
    return `${str[0].toUpperCase()}${str.slice(1, str.length).toLowerCase()}`;
}

module.exports = { format, toNumber, getNumber, formatNumber };