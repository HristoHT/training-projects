const checkIfTableExist = require('./checkIfTableExist');
const createTable = require('./createTable');
const deleteTable = require('./deleteTable');
const insertInTable = require('./insertInTable');
const selectFromTable = require('./selectFromTable');
const getRowsCount = require('./getRowsCount');
const updateTable = require('./updateTable');
const deleteFromTable = require('./deleteFromTable');

const actions = (client, showQuery = true) => {
    return Object.freeze({
        checkIfTableExist: checkIfTableExist(client, showQuery),
        createTable: createTable(client, showQuery),
        deleteTable: deleteTable(client, showQuery),
        insertInTable: insertInTable(client, showQuery),
        selectFromTable: selectFromTable(client, showQuery),
        getRowsCount: getRowsCount(client, showQuery),
        updateTable: updateTable(client, showQuery),
        deleteFromTable: deleteFromTable(client, showQuery),
    });
}

module.exports = actions;