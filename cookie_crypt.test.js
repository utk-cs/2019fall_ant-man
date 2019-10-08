const CC = require('./cookie_crypt');

test('Testing encryption', () => {
    var cipher = new CC.ChromeCrypt();
    var message = "test";
    expect(cipher.encrypt(message)).not.toBe(message);
});

test('Testing decryption', () => {
    var cipher = new CC.ChromeCrypt();
    var message = "test";
    expect(cipher.decrypt(cipher.encrypt(message))).toBe(message);
});