const jwt = require('jsonwebtoken');
const secret = 'secretssh';

function isValidJwt(token) {
    var isValid = false;
    if (token) {
        jwt.verify(token, secret, function (err, decoded) {
            if (!err) {
                isValid = true;
            }
        });
    }
    return isValid;
}

module.exports = {
    isValidJwt
};