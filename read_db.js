const sqlite3 = require('sqlite3').verbose();
const cc = require('./cookie_crypt');
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


// var h = Math.floor(d / 3600);
// const epoch = Date.now();
// epoch = epoch * .001

// var d = new Date(0);
// d.setUTCSeconds(utcSeconds);
// console.log(d)
});


//side note - session cookies are essentially non-tracking. They are necessary for standard web-browsing.

var cookie_type = (row) => {
    // console.log("yeet")

    //Google analytics - tracking
    if(row.name === "_ga" || row.name === "__utma" || row.name === "__utmz" || row.name === "_gcl_au") {
        console.log("Google Analytics ", "|", "tracking ","|",row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", row.expires_utc, "|", decryptor.decrypt(row.encrypted_value), "|");
    }

    //quantcast tracking
    else if(row.name === "__qca") {
        console.log("Quantcast ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }

    //adobe analytics cookie
    else if(row.name === "s_ecid") {
        console.log("Adobe Analytics ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //adobe analytics cookie
    else if(row.name === "s_vi") {
        console.log("Adobe Analytics ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", row.expires_utc, "|", decryptor.decrypt(row.encrypted_value), "|");
        // console.log(row.name.padEnd(20));
    }
    //adobe analytics cookie
    else if(row.name === "s_cc" || row.name === "s_sq") {
        console.log("Adobe Analytics ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
            // console.log(row.name.padEnd(20));
    }

    //adobe analytics cookie
    else if(row.name === "s_fid") {
        console.log("Adobe Analytics ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }

    //adobe analytics cookie
    else if(row.name === "adcloud") {
        console.log("Adobe Analytics ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }

    //adobe analytics cookie
    else if(row.name.startsWith("ev_sync")) {
        console.log("Adobe Analytics ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //adobe analytics cookie
    else if(row.name.startsWith("everest_")) {
        console.log("Adobe Analytics ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //adobe analytics cookie
    else if(row.name.startsWith("everest_")) {
        console.log("Adobe Analytics ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }

    //Siebel cookie
    else if(row.name == "_sn") {
        console.log("Oracle (Siebel) ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //Rakuten Marketing cookie
    else if(row.name == "rat_v") {
        console.log("Rakuten Marketing", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }

    //Rakuten Marketing cookie
    else if(row.name == "Rp") {
        console.log("Rakuten Marketing ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    
    //Crazy egg Marketing cookie
    else if(row.name == "_ceir" || row.name == "_ceg.s" || row.name == "_ceg.u") {
        console.log("Crazy Egg analytics ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }


    //Clicky cookie     don't personally have these cookies on my system so someone else has to run this with their cookies
    else if(row.name == "clicky_custom") {
        console.log("Clicky ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    else if(row.name == "utm_custom" || row.name == "_ceg.s" || row.name == "_ceg.u") {
        console.log("Crazy Egg analytics ", "|", "tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }


    /*** NON TRACKING STARTS HERE */

    //cloud fare non tracking
    else if(row.name === "__cfduid") {
        console.log("Cloudflare ", "|", "non-tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", row.expires_utc, "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //Google analytics non tracking (surprising I know)
    else if(row.name === "__utmb" || row.name === "__utmv") {
        console.log("Google Analytics ", "|", "non-tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //keeps track of php sessions - non-tracking
    else if(row.name === "PHPSESSID") {
            console.log("PHP Server Indicator ", "|", "non-tracking ","|",row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", row.expires_utc, "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //keeps track of J2EE sessions - non-tracking
    else if(row.name === "JSESSIONID") {
        console.log("J2EE Server Indicator ", "|", "non-tracking ","|",row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", row.expires_utc, "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //sticky session cookie - used for optmizing and improving user experience.
    else if(row.name === "PLAY_SESSION") {
        console.log("Play framework session ", "|", "non-tracking ","|",row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", row.expires_utc, "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //session cookie for apps using play framework 
    else if(row.name === "AWSALB") {
        console.log("AWS sticky sessions ", "|", "non-tracking ","|",row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", row.expires_utc, "|", decryptor.decrypt(row.encrypted_value), "|");
    }
    //log everything else as unknown until more research is done
    else {
        var utcSeconds = row.expires_utc;
        var d = new Date(0);
        d.setUTCSeconds(utcSeconds);

        if(utcSeconds === 0) {
            console.log("Unknown ", "|", "non-tracking ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
        }
        else {
            console.log("Unknown ", "|", "Unknown ","|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
        }
    }
}




// close the db
db.close();
