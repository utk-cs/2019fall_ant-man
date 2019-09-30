const sqlite3 = require('better-sqlite3');
const homedir = require('os').homedir();
const cc = require('./cookie_crypt');

var DBPATH;
if (process.platform === "linux") {
    DBPATH = `${homedir}/.config/google-chrome/Default/Cookies`;
} else if (process.platform === "darwin") {
    DBPATH = `${homedir}/Library/Application Support/Google/Chrome/Default/Cookies`;
}

class ChromeDB {
    static getCookieChrome(cookie) {
        var db = new sqlite3(DBPATH);

        try {
            var stmt = db.prepare(
                "SELECT * FROM cookies WHERE " +
                    "host_key=@host_key AND " +
                    "name=@name AND " +
                    "path=@path"
            );
            var rv = stmt.get(cookie);
        } catch {
            db.close();
        }

        return rv;
    }

    static addCookieChrome(cookie) {
        if (cookie.value.length !== 0) {
            cookie.encrypted_value = ChromeDB.cipher.encrypt(cookie.value);
            cookie.value = '';
        }

        var db = new sqlite3(DBPATH);

        try {
            var stmt = db.prepare(
                "INSERT INTO cookies (" +
                    "creation_utc, " +
                    "host_key, " +
                    "name, " +
                    "value, " +
                    "path, " +
                    "expires_utc, " +
                    "is_secure, " +
                    "is_httponly, " +
                    "last_access_utc, " +
                    "has_expires, " +
                    "is_persistent, " +
                    "priority, " +
                    "encrypted_value, " +
                    "samesite" +
                ") VALUES (" +
                    "@creation_utc, " +
                    "@host_key, " +
                    "@name, " +
                    "@value, " +
                    "@path, " +
                    "@expires_utc, " +
                    "@is_secure, " +
                    "@is_httponly, " +
                    "@last_access_utc, " +
                    "@has_expires, " +
                    "@is_persistent, " +
                    "@priority, " +
                    "@encrypted_value, " +
                    "@samesite" +
                ")"
            );
            var rv = stmt.run(cookie);
        } catch {
            db.close();
        }
     
        return rv;
    }

    static modifyCookieChrome(cookie) {
        var db = new sqlite3(DBPATH);

        try {
            var stmt = db.prepare(
                "UPDATE cookies SET " +
                    "creation_utc = @creation_utc, " +
                    "host_key = @host_key, " +
                    "name = @name, " +
                    "value = @value, " +
                    "path = @path, " +
                    "expires_utc = @expires_utc, " +
                    "is_secure = @is_secure, " +
                    "is_httponly = @is_httponly, " +
                    "last_access_utc = @last_access_utc, " +
                    "has_expires = @has_expires, " +
                    "is_persistent = @is_persistent, " +
                    "priority = @priority, " +
                    "encrypted_value = @encrypted_value, " +
                    "samesite = @samesite " +
                "WHERE " +
                    "host_key = @host_key AND " +
                    "name = @name AND " +
                    "path = @path"
            );
            var rv = stmt.run(cookie);
        } catch {
            db.close();
        }

        return rv;
    }

    static deleteCookieChrome(cookie) {
        var db = new sqlite3(DBPATH);

        try {
            var stmt = db.prepare(
                "DELETE FROM cookies WHERE " +
                    "host_key = @host_key AND " +
                    "name = @name AND " +
                    "path = @path"
            );
            var rv = stmt.run(cookie);
        } catch {
            db.close();
        }

        return rv;
    }
}
ChromeDB.cipher = new cc.ChromeCrypt();
