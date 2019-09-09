const aes = require('aes-js');
const pbkdf2 = require('pbkdf2');

const iv = Buffer.from('                ', 'utf-8');
const salt = 'saltysalt';
const keylen = 16;

const password = 'peanuts';
const iterations = 1;

const key = pbkdf2.pbkdf2Sync('peanuts', 'saltysalt', 1, 16);


function strip(buf) {
    return buf.slice(
        0,
        -1 * buf[buf.length-1]  // Get the last value in buf, and exclude that number of elements from the slice.
    );
}

function decrypt(ctext) {
    var cipher;
    var buf;
    var mtext;

    cipher = new aes.ModeOfOperation.cbc(key, iv);  // Must define cipher in function because js is stupid.
                                                    // Probably decrypt is getting called before cipher is made or something.

    ctext = ctext.slice(3);
    buf = Buffer.from(cipher.decrypt(ctext));
    buf = strip(buf);
    mtext = buf.toString();
    
    return mtext;
}

module.exports = {
    decrypt
}