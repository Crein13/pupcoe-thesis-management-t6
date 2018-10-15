const { Client } = require('pg')
const config = require('./../config.js');

const client = new Client(config.db)
// connect to database
client.connect()
  .then(function () {
    console.log('connected to database!');
  })
  .catch(function (err) {
    console.log('cannot connect to database!', err);
  });

module.exports = {
	query: (text, callback) => {
  return client.query(text, callback)
  }
}