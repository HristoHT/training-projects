const fs = require('fs');
const { parsegradove, parseobstini, parseoblastis } = require('./parseXSLFiles');
const actions = require('./pgConnection');

async function init(actions) {
    try {
        if (!await actions.checkIfTableExist('oblasti')) {
            await actions.createTable('oblasti', {
                nameоblast: 'TEXT',
                oblast: 'TEXT PRIMARY KEY'
            });
        }

        if (!await actions.checkIfTableExist('obstini')) {
            await actions.createTable('obstini', {
                nameоbstina: 'VARCHAR(25)',
                obstina: 'TEXT PRIMARY KEY',
                oblast: 'TEXT REFERENCES oblasti (oblast)',
            });
        }

        if (!await actions.checkIfTableExist('gradove')) {
            await actions.createTable('gradove', {
                name: 'TEXT',
                ekatte: 'TEXT PRIMARY KEY',
                // oblast: 'VARCHAR(3) REFERENCES oblasti (oblast)',
                obstina: 'TEXT REFERENCES obstini (obstina)',
            });
        }

        // await actions.deleteTable('gradove');
        // await actions.deleteTable('obstini');
        // await actions.deleteTable('oblasti');
    } catch (e) {
        console.log(e.stack)
    }
}

async function populate(actions) {
    try {
        (await actions.insertInTable('oblasti', {
            nameOblast: { type: 'string' },
            oblast: { type: 'string' }
        }, parseoblastis()));

        (await actions.insertInTable('obstini', {
            nameObstina: { type: 'string' },
            oblast: { type: 'string' },
            obstina: { type: 'string' }
        }, parseobstini()));

        (await actions.insertInTable('gradove', {
            name: { type: 'string' },
            obstina: { type: 'string' },
            ekatte: { type: 'string' }
        }, parsegradove()));

    } catch (e) {
        console.log(e);
    }
}

async function visualize(actions){
    const oblasti = await actions.selectFromTable('oblasti');
    const obstini = await actions.selectFromTable('obstini');
    const gradove = await actions.selectFromTable('gradove');

    fs.writeFile('./EKATTE/EK-obl_databse.txt', oblasti.map(row => JSON.stringify(row)).join('\n'), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File saved from database!');
        }
    });

    fs.writeFile('./EKATTE/EK-obst_databse.txt', obstini.map(row => JSON.stringify(row)).join('\n'), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File saved from database!');
        }
    });

    fs.writeFile('./EKATTE/EK-atte_databse.txt', gradove.map(row => JSON.stringify(row)).join('\n'), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File saved from database!');
        }
    });
}

(async () => {
    await actions.connect()
    await init(actions);
    await populate(actions);
    await visualize(actions);

    await actions.end()
})()