const aes = require('aes-js');
const pbkdf2 = require('pbkdf2');

function aesDecryptor(password, salt, iterations, keylen, iv) {
    var key = pbkdf2.pbkdf2Sync(password, salt, iterations, keylen);

    return (ctext) => {
        var cipher;
        var buf;
        var mtext;

        cipher = new aes.ModeOfOperation.cbc(key, iv);    // Must define cipher in function because js is stupid.
                                                                    // Probably decrypt is getting called before cipher is made or something.

        ctext = ctext.slice(3);
        buf = Buffer.from(cipher.decrypt(ctext));
        buf = 
            buf.slice(
                0,
                -1 * buf[buf.length-1]
            );
        mtext = buf.toString();
        
        return mtext;
    };
}

class ChromeCrypt {
    constructor() {
        if (process.platform === "win32") {
            // TODO: Windows
        } else {
            this.iv = Buffer.from('                ', 'utf-8');
            this.salt = 'saltysalt';
            this.keylen = 16;

            if (process.platform === "darwin") {
                const keychain = require('keychain');

                this.iterations = 1003;
                keychain.getPassword(
                    {account: 'Chrome Safe Storage', service: 'Chrome'},
                    function(err, pass) {
                        if (err) {
                            throw err;
                        }

                        console.log("!!!!!!!!", pass);
                        this.decrypt = aesDecryptor(pass, this.salt, this.iterations, this.keylen, this.iv);
                    }
                );
            } else { // process.platform === "linux", "freebsd", "sunos"
                this.password = 'peanuts';
                this.iterations = 1;
                
                this.decrypt = aesDecryptor(this.password, this.salt, this.iterations, this.keylen, this.iv);
            }
        }
    }
}

module.exports = {
    ChromeCrypt
}