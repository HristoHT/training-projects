const throwError = require('../utils/requiredParam');

const createTable = (client, showQuery) =>
    async (tableName = throwError('tableName'), columns = throwError('columns')) => {
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