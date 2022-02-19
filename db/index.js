const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./db.sqlite3', (err) => {
  if (err) {    
    return console.log('Failed to connect DB.');
  }

  console.log('DB connected.');
});

module.exports = db;