const sqlite3 = require('sqlite3').verbose();
const cc = require('./cookie_crypt.js');

const DBPATH = "/home/isaac/.config/google-chrome/Default/Cookies";

// open the database
let db = new sqlite3.Database(DBPATH);
 
let sql = 'SELECT * FROM cookies ORDER BY name';
 
db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    
    rows.forEach((row) => {
        console.log("|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", cc.decrypt(row.encrypted_value), "|");
    });
});
 
// close the db
db.close();
