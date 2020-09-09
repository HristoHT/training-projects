const { Client, Pool } = require('pg');
const actions = require('./actions/actions');

const client = new Pool({
  database: 'ecommerce',
  user: 'postgres',
  password: 'hristo',
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
