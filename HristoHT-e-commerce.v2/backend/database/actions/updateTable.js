const throwError = require('../../utils/CustomError');
const {format} = require('../../utils/formatValue');

const updateTable = (client, showQuery = false) =>
    async (tableName = throwError('tableName'),
        tableSchema = throwError('tableSchema'),
        updates = {},
        conditions = []) => {
        try {
            const query = `UPDATE ${tableName} 
            SET ${Object.keys(updates).map(key => `${key} = ${format(updates[key], tableSchema[key])}`).join(',')} 
             ${conditions.join(' ')};`

            if (showQuery) {
                console.log(query);
            }

            const res = await client.query(query)

            return res.rowCount;
        } catch (e) {
            throw e;
        }
    }


module.exports = updateTable;