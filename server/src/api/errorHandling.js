const baseErrorMessage = 'Error has occured while processing your request.';
const logger = require('../core/logging/logger');

function schemaErrorResponse(payloadInfo, err, defaultMessage = baseErrorMessage) {
    msg = err && err.message ? err.message : defaultMessage;
    logger.error(msg);
    status = 500;
    return {
        ...payloadInfo,
        status,
        msg
    };
}

function baseErrorResponse(payloadInfo, err, defaultMessage = baseErrorMessage, statusCode = 500) {
    msg = err && err.message ? err.message : defaultMessage;
    logger.error(msg);
    status = statusCode;
    return {
        ...payloadInfo,
        status,
        msg
    };
}

function baseErrorResponse(payloadInfo, err, statusCode = 500, defaultMessage = baseErrorMessage) {
    msg = err && err.message ? err.message : defaultMessage;
    logger.error(msg);
    status = statusCode;
    return {
        ...payloadInfo,
        status,
        msg
    };
}

function baseErrorResponse(payloadInfo, defaultMessage = baseErrorMessage, statusCode = 400) {
    msg = defaultMessage;
    logger.error(msg);
    status = statusCode;
    return {
        ...payloadInfo,
        status,
        msg
    };
}

module.exports = {
    schemaErrorResponse,
    baseErrorResponse
};