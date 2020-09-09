const { Client } = require('pg');
const pgActions = require('./actions');

const client = new Client({
    // host: 'database.server.com',
    database: 'ecommerce',
    // port: 3211,
    user: 'postgres',
    password: 'hristo',
  });

module.exports = pgActions(client);