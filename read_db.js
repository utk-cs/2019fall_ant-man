const sqlite3 = require('sqlite3').verbose();
const cc = require('./cookie_crypt.js');
const homedir = require('os').homedir();

const decryptor = new cc.ChromeCrypt();

if (process.platform === "linux") {
    var DBPATH = `${homedir}/.config/google-chrome/Default/Cookies`;
} else if (process.platform === "darwin") {
    var DBPATH = `${homedir}/Library/Application Support/Google/Chrome/Default/Cookies`;
}

// open the database
let db = new sqlite3.Database(DBPATH);
 
let sql = 'SELECT * FROM cookies ORDER BY name';
 
db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    
    rows.forEach((row) => {
        // console.log("|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
        cookie_type(row)
        
    });
});



var cookie_type = (row) => {
    // console.log("yeet")

    //Google analytics - tracking
    if(row.name === "_ga" || row.name === "__utma" || row.name === "__utmz" || row.name === "_gcl_au") {
        console.log("Google Analytics ", "|", "tracking ","|",row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //quantcast tracking
    else if(row.name === "__qca") {
        console.log("Quantcast ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //cloud fare non tracking
    else if(row.name === "__cfduid") {
        console.log("Cloudflare ", "|", "non-tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //Google analytics non tracking (surprising I know)
    else if(row.name === "__utmb" || row.name === "__utmv") {
        console.log("Google Analytics ", "|", "non-tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //log everything else as unknown until more research is done
    else {
        console.log("Unknown ", "|", "Unknown ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }



}


// close the db
db.close();
