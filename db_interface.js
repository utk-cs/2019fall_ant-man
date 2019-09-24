const sqlite3 = require('better-sqlite3');
const homedir = require('os').homedir();

var DBPATH;
if (process.platform === "linux") {
    DBPATH = `${homedir}/.config/google-chrome/Default/Cookies`;
} else if (process.platform === "darwin") {
    DBPATH = `${homedir}/Library/Application Support/Google/Chrome/Default/Cookies`;
}

var db = new sqlite3(DBPATH);

class ChromeDB {
    static getCookieChrome(cookie) {
        var stmt = db.prepare("SELECT * FROM cookies WHERE host_key=? AND name=? AND path=?");
        var rv = stmt.get(cookie.host_key, cookie.name, cookie.path);
        
        return rv;
    }
}
