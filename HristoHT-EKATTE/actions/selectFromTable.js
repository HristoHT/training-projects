const throwError = require('../utils/throwError');
const tableNameError = () => throwError('tableName is required for action selectFromTable');

const selectFromTable = (client, showQuery = false) =>
    async (tableName = tableNameError(),
        columns = ['*'],
        conditions = []) => {
        try {
            const query = `SELECT ${columns.join(',')} FROM ${tableName} ${conditions.join(' ')}`

            if(showQuery){
                console.log(query);
            }

            const res = await client.query(query)

            return res.rows;
        } catch (e) {
            throw e;
        }
    }


module.exports = selectFromTable;