const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
const cors = require("cors");
const database = require("./database/postgres_connection");
const controllers_connection = require('./controlers/controllers_connection');
const { initialLoad } = require('./initialLoad');
require('dotenv').config();

const PORT = process.env.PORT || 8080;
var database_connection;

database().then(async (connection) => {
    database_connection = connection;
    await initialLoad(connection.actions);
    app.locals.controllers = controllers_connection(connection.actions);

    http.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
})

app.use(cors({
    origin: 'http://localhost:3000', // create-react-app dev server
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // extended = true is depricated

app.use('/api', require('./api/api.js'));

const shutDown = async () => {
    console.log('\nExit...')
    await database_connection.end();
    process.exit();
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
process.on('uncaughtException', (err) => {
    console.log(" UNCAUGHT EXCEPTION ");
    console.log("[Inside 'uncaughtException' event] " + err.stack || err.message);
    shutDown();
});