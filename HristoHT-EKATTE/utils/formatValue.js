const format = (value = null, { type = 'string', ...opts } = { type: 'string' }) => {
    if (type === 'string') {
        return `'${String(value)}'`;
    } else if (type === 'number') {
        return Number(value) || 0;
    }
}

module.exports = format;