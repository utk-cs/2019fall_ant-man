const sqlite3 = require('better-sqlite3');

var sql = 'CREATE TABLE cookies(creation_utc INTEGER NOT NULL,host_key TEXT NOT NULL,name TEXT NOT NULL,value TEXT NOT NULL,path TEXT NOT NULL,expires_utc INTEGER NOT NULL,is_secure INTEGER NOT NULL,is_httponly INTEGER NOT NULL,last_access_utc INTEGER NOT NULL,has_expires INTEGER NOT NULL DEFAULT 1,is_persistent INTEGER NOT NULL DEFAULT 1,priority INTEGER NOT NULL DEFAULT 1,encrypted_value BLOB DEFAULT \'\',samesite INTEGER NOT NULL DEFAULT -1,UNIQUE (host_key, name, path))';
//const db0 = new sqlite3('backup.db', { verbose: console.log });
//console.log(db0.exec(sql));

function saveBackup(){
    const DBLOCAL = './cookies.db';
    const BACKUP = './backup.db';
    syncFromInto(DBLOCAL,BACKUP);
}

function syncFromInto(DBLOCAL, BACKUP) {
    var giver = new sqlite3(DBLOCAL);
    var receiver = new sqlite3(BACKUP);

    var rv = {
        changes: 0,
        lastInsertRowId: -1
    };
    try {
        var stmtSelect = giver.prepare("SELECT * FROM cookies");

        var stmtFind = receiver.prepare("SELECT EXISTS(SELECT 1 FROM cookies WHERE host_key=@host_key AND name=@name AND path=@path) AS Found");
        var stmtFindExact = receiver.prepare(
            "SELECT EXISTS(" +
                "SELECT 1 FROM cookies WHERE " +
                "host_key=@host_key AND " +
                "name=@name AND " +
                "path=@path AND " +
                "creation_utc=@creation_utc AND " +
                "host_key=@host_key AND " +
                "name=@name AND " +
                "value=@value AND " +
                "path=@path AND " +
                "expires_utc=@expires_utc AND " +
                "is_secure=@is_secure AND " +
                "is_httponly=@is_httponly AND " +
                "last_access_utc=@last_access_utc AND " +
                "has_expires=@has_expires AND " +
                "is_persistent=@is_persistent AND " +
                "priority=@priority AND " +
                "encrypted_value=@encrypted_value AND " +
                "samesite=@samesite" +
            ") AS Found"
        );
        
        
        var stmtUpdate = receiver.prepare(
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
        var stmtInsert = receiver.prepare(
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

        var cookie;
        var info;

        var rows = stmtSelect.all();
        for (cookie of rows) {
            
            info = stmtFindExact.get(cookie);   // Check if already synced

            if (info.Found === 0) { // Not synced
                info = stmtFind.get(cookie);    // Check if needs updating or inserting

                if (info.Found === 1) { // Update
                    info = stmtUpdate.run(cookie);
                } else {    // Insert
                    info = stmtInsert.run(cookie);
                }
            } else {
                continue;
            }

            rv.changes += info.changes;
            rv.lastInsertRowId = info.lastInsertRowid;
        }
    } catch(err) {
        giver.close();
        receiver.close();
    }

    giver.close();
    receiver.close();
    return rv;
}

