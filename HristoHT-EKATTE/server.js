const express = require('express');
const bodyParser = require('body-parser');
const actions = require('./pgConnection');
const app = express();
const PORT = 3000;

//MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

const server = app.listen(PORT, async (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is runing on port ${PORT}...`);
        await actions.connect();
        console.log('Postgres connected....');
    }
});

app.get('/', (req, res) => {
    res.sendFile('./public/index.html');
});

app.get('/search', async (req, res) => {
    try {
        const search = req.query.search || '';
        const searchResult = await actions.selectFromTable('gradove',
            ['ekatte', 'name', 'nameObstina', 'nameOblast'],
            ['INNER JOIN obstini ON obstini.obstina = gradove.obstina',
                'INNER JOIN oblasti ON oblasti.oblast = obstini.oblast',
                `WHERE name ~* '${search}'`,
                // `OR nameObstina ~* '${search}'`,
                // `OR nameOblast ~* '${search}'`,
                `ORDER BY name, nameOblast, nameObstina`
            ]);

        const obl = await actions.getRowsCount('oblasti');
        const obst = await actions.getRowsCount('obstini');
        const grad = await actions.getRowsCount('gradove');

        res.send({ searchResult, obl, obst, grad });
    } catch (e) {
        console.log(e.stack)
        return res.status(500).send(new Error('something go wrong...'));
    }
});

process.on('SIGINT', async () => {
    await actions.end();
    console.log('\nPostgres disconected...')
    process.exit(0);
});

process.on('SIGTERM', async() => {
    await actions.end();
    console.log('\nPostgres disconected...')
    process.exit(0);
});
