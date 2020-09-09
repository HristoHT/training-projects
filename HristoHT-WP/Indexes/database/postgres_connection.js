const { Client, Pool } = require('pg');
const actions = require('./actions/actions');

const client = new Pool({
  database: 'indexes',
  user: 'postgres',
  password: '1234',
  host: '192.168.1.116',
  port: 5432
});

module.exports = async () => {
  console.log('Postgres connected...');
  console.log('Actions created...');

  return Object.freeze({
    actions: actions(client),
    connect: async () => await client.connect(),
    end: async () => await client.end(),
    client: client,
  });
}
