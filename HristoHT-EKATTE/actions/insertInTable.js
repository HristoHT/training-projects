const throwError = require('../utils/throwError');
const format = require('../utils/formatValue');
const tableNameError = () => throwError('tableName is required for function insertInTable');
const columnsError = () => throwError('columns is requiered for action insertInTable');
const rowsError = () => throwError('rows is requiered for action insertInTable');

const insertInTable = (client, showQuery) =>
    async (tableName = tableNameError(),
        columns = columnsError(),
        rows = rowsError(),
        insertOnConflict = false) => {
        try {
            const query = `
            INSERT INTO ${tableName}
            ( ${Object.keys(columns).map(key => key).join(',')} )
            VALUES ${
                rows.map(row =>
                    `( ${Object.keys(columns).map(col =>
                        format(row[col].trim(), columns[col])
                    ).join(',')
                    } )`)
                }
                 ${!insertOnConflict ? 'ON CONFLICT DO NOTHING' : ''}
            `;

            if (showQuery) {
                console.log(query);
            }

            const res = await client.query(query);

            return true;
        } catch (e) {
            throw e;
        }
    }


module.exports = insertInTable;