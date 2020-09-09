const throwError = require('../../utils/requiredParam');
const { format } = require('../../utils/formatValue');

const insertInTable = (client, showQuery) =>
    async (tableName = throwError('tableName'),
        columns = throwError('columns'),
        rows = throwError('rows'),
        insertOnConflict = false) => {
        try {
            const query = `
            INSERT INTO ${tableName}
            ( ${Object.keys(columns).map(key => key).join(',')} )
            VALUES ${
                rows.map(row =>
                    `( ${Object.keys(columns).map(col =>
                        format(row[col], columns[col])
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