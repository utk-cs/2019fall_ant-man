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
                // Get password from OSX Keychain
                const spawnSync = require('child_process').spawnSync;
                let keychain = spawnSync('/usr/bin/security', ['find-generic-password', '-s', 'Chrome Safe Storage', '-a', 'Chrome', '-g']);

                // Extract password from output format of:
                // password: "${PASSWORD}"
                this.password = keychain.stderr.toString().match(/password: "(.*?)"/)[1];
                console.log(this.password); // testing. Might still need to decode password from base64, but that shouldn't be too hard at all
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

                // If ctext begins with v10, remove it
                if (Buffer.from("v10").equals(ctext.slice(0, 3))) {
                    ctext = ctext.slice(3);
                }

                buf = Buffer.from(cipher.decrypt(ctext));

                // Remove padding
                buf = 
                    buf.slice(
                        0,
                        -1 * buf[buf.length-1]
                    );
                mtext = buf.toString();
                
                return mtext;
            };

            this.encrypt = (mtext) => {
                var cipher;
                var ctext;
                var padding;
                var padn;

                cipher = new aes.ModeOfOperation.cbc(this.key, this.iv);    // Must define cipher in function because js is stupid.
                                                                            // Probably decrypt is getting called before cipher is made or something.
                
                // Convert mtext to buffer if not already
                if (typeof(mtext) === "string") {
                    mtext = Buffer.from(mtext);
                }

                // Pad buffer to multiple of 16 bytes
                padn    = 16 - (mtext.length % 16);
                padding = Buffer.alloc(padn);
                padding.fill(padn);
                mtext = Buffer.concat([mtext, padding]);

                ctext = cipher.encrypt(mtext);

                // Append v10 to buffer
                ctext = Buffer.concat([Buffer.from("v10"), ctext]);
                
                return ctext;
            };
        }
    }
}

module.exports = {
    ChromeCrypt
}
