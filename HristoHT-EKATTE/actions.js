const checkIfTableExist = require('./actions/checkIfTableExist');
const createTable = require('./actions/createTable');
const deleteTable = require('./actions/deleteTable');
const insertInTable = require('./actions/insertInTable');
const selectFromTable = require('./actions/selectFromTable');
const getRowsCount = require('./actions/getRowsCount');

const actions = (client, showQuery = true) => {
    return Object.freeze({
        checkIfTableExist: checkIfTableExist(client, showQuery),
        createTable: createTable(client, showQuery),
        deleteTable: deleteTable(client, showQuery),
        insertInTable: insertInTable(client, showQuery),
        selectFromTable: selectFromTable(client, showQuery),
        getRowsCount: getRowsCount(client, showQuery),
        connect: async () => await client.connect(),
        end: async () => await client.end()
    });
}

module.exports = actions;