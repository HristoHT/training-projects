const throwError = require('../utils/CustomError');

const selectFromTable = (client, showQuery = false) =>
    async (tableName = throwError('tableName'),
        conditions = []) => {
        try {
            const query = `DELETE FROM ${tableName} ${conditions.join(' ')}`

            if (showQuery) {
                console.log(query);
            }

            const res = await client.query(query)
            console.log(res);

            return res.rows;
        } catch (e) {
            throw e;
        }
    }


module.exports = selectFromTable;