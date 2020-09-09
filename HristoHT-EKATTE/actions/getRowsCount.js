const throwError = require('../utils/throwError');

const getRowsCount = (client, showQuery) =>
    async (tableName = throwError('tableName is required for action getRowsCount')) => {
        try{
            const query = `SELECT count(*) FROM ${tableName};`;
            const res = await client.query(query)

            if(showQuery){
                console.log(query);
            }

            return res.rows[0].count || 0;
        } catch(e) {
            throw e;
        }
    }


module.exports = getRowsCount;