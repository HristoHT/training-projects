const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
const cors = require("cors");
const actions = require('./pgConnection');
const { initialLoad } = require('./initialLoad')
require('dotenv').config();

const PORT = process.env.PORT || 8080;

actions.connect().then(async res => {
    console.log('Postgres connected....');
    app.locals.io = io;
    app.locals.dbActions = actions;
    await initialLoad(actions);
    http.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))
});

/**
 * Дава достъп на фронтенда до апито
 */
app.use(cors({
    origin: 'http://localhost:3000', // create-react-app dev server
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // extended = true is depricated

app.use('/api', require('./api/api.js'));

const shutDown = async () => {
    console.log('Exit...')
    await app.locals.dbActions.end();
    process.exit();
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
process.on('uncaughtException', shutDown);