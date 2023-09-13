const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./messages.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT
    )
  `);
});

module.exports = db;
