const throwError = require('../../utils/CustomError');

const selectFromTable = (client, showQuery = false) =>
    async (tableName = throwError('tableName'),
        columns = ['*'],
        conditions = [],
        distinct = false) => {
        try {
            const query = `SELECT ${distinct ? 'DISTINCT ' : ''}${columns.join(',')} FROM ${tableName} ${conditions.join(' ')}`

            if (showQuery) {
                console.log(query);
            }

            const res = await client.query(query)

            return res.rows;
        } catch (e) {
            throw e;
        }
    }


module.exports = selectFromTable;