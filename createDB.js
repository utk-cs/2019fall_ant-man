
 
// open database in memory
const Database = require('better-sqlite3');
const db = new Database('cookies.db', { verbose: console.log });


var sql = 'CREATE TABLE cookies(creation_utc INTEGER NOT NULL,host_key TEXT NOT NULL,name TEXT NOT NULL,value TEXT NOT NULL,path TEXT NOT NULL,expires_utc INTEGER NOT NULL,is_secure INTEGER NOT NULL,is_httponly INTEGER NOT NULL,last_access_utc INTEGER NOT NULL,has_expires INTEGER NOT NULL DEFAULT 1,is_persistent INTEGER NOT NULL DEFAULT 1,priority INTEGER NOT NULL DEFAULT 1,encrypted_value BLOB DEFAULT \'\',samesite INTEGER NOT NULL DEFAULT -1,UNIQUE (host_key, name, path))';
var sql2 = 'INSERT INTO cookies (creation_utc, host_key, name, value, path, expires_utc, is_secure, is_httponly, last_access_utc) VALUES (1, "hello", "hello", "hello", "hello", 1, 1, 1, 1)'
var sql3 = 'SELECT host_key Name FROM cookies'

console.log(db.exec(sql));
console.log(db.exec(sql2));
console.log(db.exec(sql3));


/*
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
});
*/
db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });