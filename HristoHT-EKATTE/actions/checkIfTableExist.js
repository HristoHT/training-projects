const throwError = require('../utils/throwError');


const checkIfTableExist = (client, showQuery) =>
    async (tableName = throwError('tableName is required for function deleteTable')) => {
        try {
            const query = `SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name   = '${tableName}'
                );`;
            const res = await client.query(query)

            if (showQuery) {
                console.log(query);
            }

            return res.rows[0].exists;
        } catch (e) {
            throw e;
        }
    }


module.exports = checkIfTableExist;