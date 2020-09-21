const logger = require('../../core/logging/logger');
const { isValidJwt } = require('../validation/tokenValidation');

function validateToken(req, res, next) {
    let token = req.token ? req.token.value : undefined;
    logger.info(`Validating user token! Token submitted: ${token}`);
    let isValid = isValidJwt(token);
    logger.info(`Is valid token: ${isValid}`);
    if (!isValid) {
        req.payloadInfo = {
            ...req.payloadInfo,
            status: 400,
            msg: 'Token is not valid.'
        };
    }
    next();
}

function fetchToken(req, res, next) {
    var type = undefined;
    var value = undefined;
    if (req.cookies && req.cookies.token) {
        type = 'Cookie';
        value = req.cookies.token;
    } else {
        if (req.headers && req.headers.authorization) {
            var tokenLine = req.headers.authorization.split(' ');
            logger.info(`Parsed authorization header token line is: ${JSON.stringify(tokenLine)}`);
            if (tokenLine.length === 2) {
                type = tokenLine[0];
                value = tokenLine[1];
            }
        }
    }
    logger.info(`Fetching token from ${type} value is: ${value}`);
    req.token = {
        value,
        type
    };
    next();
}

module.exports = {
    validateToken,
    fetchToken
};