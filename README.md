# 2019fall_ant-man

## Cookies

### Cookie Format
Chrome stores cookies in a local sqlite3 table with the following setup.
```
CREATE TABLE cookies(
    creation_utc INTEGER NOT NULL,
    host_key TEXT NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    path TEXT NOT NULL,
    expires_utc INTEGER NOT NULL,
    is_secure INTEGER NOT NULL,
    is_httponly INTEGER NOT NULL,
    last_access_utc INTEGER NOT NULL,
    has_expires INTEGER NOT NULL DEFAULT 1,
    is_persistent INTEGER NOT NULL DEFAULT 1,
    priority INTEGER NOT NULL DEFAULT 1,
    encrypted_value BLOB DEFAULT '',
    samesite INTEGER NOT NULL DEFAULT -1,

    UNIQUE (host_key, name, path)
);
```
**Example Cookie:**
```
{
    creation_utc: 13198689890368478,
    host_key: '.fandango.com',
    name: 'zip',
    value: '',
    path: '/',
    expires_utc: 13230225890000000,
    is_secure: 1,
    is_httponly: 0,
    last_access_utc: 13198690365647604,
    has_expires: 1,
    is_persistent: 1,
    priority: 1,
    encrypted_value: <Buffer 76 31 30 68 53 3e d1 61 10 31 d2 92 8f 3c 04 93 d8 eb 52>,
    samesite: -1
}
```
