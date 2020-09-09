const throwError = require('../utils/throwError');
const customThrow = () => throwError('tableName and columns are required for action createTable')

const createTable = (client, showQuery) =>
    async (tableName = customThrow(), columns = customThrow()) => {
        try {
            const query = `
                CREATE TABLE ${tableName} ( 
                    ${Object.keys(columns).map(field => `${field} ${columns[field]}`).join(',')}
                );
              `

            if (showQuery) {
                console.log(query);
            }

            const res = await client.query(query);

            return true;
        } catch (e) {
            throw e;
        }
    }

module.exports = createTable;