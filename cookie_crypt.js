const aes = require('aes-js');
const pbkdf2 = require('pbkdf2');

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
                this.password = keychain.getPassword(
                    {account: 'Chrome', service: 'Chrome Safe Storage'},
                    function(err, pass) {
                        if (err) {
                            throw err;
                        }

                        return pass;
                    }
                );

                console.log(this.password);
                this.iterations = 1003;
            } else { // process.platform === "linux", "freebsd", "sunos"
                this.password = 'peanuts';
                this.iterations = 1;
            }

            this.key = pbkdf2.pbkdf2Sync(this.password, this.salt, this.iterations, this.keylen);

            this.decrypt = (ctext) => {
                var cipher;
                var buf;
                var mtext;

                cipher = new aes.ModeOfOperation.cbc(this.key, this.iv);    // Must define cipher in function because js is stupid.
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
    }
}

module.exports = {
    ChromeCrypt
}