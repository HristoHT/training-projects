const toNumber = (val) => (Number(val) || 0);
const getNumber = (val, dig = 2) => toNumber(toNumber(val).toFixed(dig));
const formatNumber = (val, dig = 2) => Number.parseFloat(val).toFixed(dig);

const format = (value = null, { type = 'string', ...opts } = { type: 'string' }) => {
    if (type === 'string') {
        return `'${String(value).trim()}'`;
    } else if (type.indexOf('number') !== -1) {
        if(type.split('-').length === 2){
            return formatNumber(value, toNumber(type.split('-')[1]) )
        }
        return toNumber(value);
    }
}

module.exports = format;