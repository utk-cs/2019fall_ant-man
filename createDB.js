const sqlite3 = require('sqlite3').verbose();
 
// open database in memory
let db = new sqlite3.Database(':memory:',sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

var sql = 'CREATE TABLE cookies (name, int)';
var sql2 = 'INSERT INTO cookies (name) VALUES (1)'
var sql3 = 'SELECT name Name FROM cookies'
db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    db.all(sql2, [], (err, rows) => {
        if (err) {
          throw err;
        }
    });
    db.all(sql3, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.Name);
        });
    });
    //rows.forEach((row) => {
      //console.log(row.name);
    //});
});

db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });