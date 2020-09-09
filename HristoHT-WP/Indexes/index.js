console.log('File running...');

(async () => {
    try {
        const connection = await require('./database/postgres_connection')();
        await connection.connect();
        const actions = connection.actions;
        const tableName = 'test1';
        const isTest1Exist = await actions.checkIfTableExist(tableName);

        if(isTest1Exist){

        } else {
            throw new Error('Table test1 does not exist!');
        }
    } catch (e) {
        console.log(e);
    }
})()