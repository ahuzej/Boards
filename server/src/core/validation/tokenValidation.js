const jwt = require('jsonwebtoken');
const secret = 'secretssh';

function isValidJwt(token) {
    let tokenData = false;
    if (token) {
        jwt.verify(token, secret, function (err, decoded) {
            if (!err) {
                tokenData = decoded;
            }
        });
    }
    return tokenData;
}

module.exports = {
    isValidJwt
};