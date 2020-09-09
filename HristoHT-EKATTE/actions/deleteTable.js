const throwError = require('../utils/throwError');

const deleteTable = (client, showQuery) =>
    async (tableName = throwError('tableName is required for function deleteTable')) => {
        try{
            const query = `DROP TABLE ${tableName}`;
            const res = await client.query(query)

            if(showQuery){
                console.log(query);
            }

            return true;
        } catch(e) {
            throw e;
        }
    }


module.exports = deleteTable;