const logger = require('../logging/logger');
const Request = require('../models/requests');

async function initiateRequestProcess(req, res, next) {
    const url = req.originalUrl;
    const method = req.method;
    const currentTime = Date.now();
    logger.info(`Initiating HTTP request process at: ${currentTime}, target is: ${url}, method is: ${method}`);
    var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let requestInfo = new Request({
        initialized: {
            time: currentTime,
            data: req.body
        },
        ip: ip,
        finalized: undefined
    });

    await requestInfo.save();

    const payloadInfo = {
        requestId: requestInfo.id,
        status: 200
    };
    req.payloadInfo = payloadInfo;
    logger.info(`Request body is: ${JSON.stringify(req.body)}`);
    next();
}

/**
 * Middleware doing final checks before sending response.
 */
function prepareResponse(req, res, next) {
    var { status, data, msg } = req.payloadInfo;

    if (!msg) {
        if (status >= 200 && status <= 300) {
            msg = 'OK';
            status = 200;
        } else {
            msg = 'Error has occured while trying to process this request.';
        }
    }

    req.payloadInfo = {
        ...req.payloadInfo, msg, status, data
    };

    next();
}

async function finalizeRequestProcess(req, res, next) {
    const currentTime = Date.now();
    logger.info(`Finalizing HTTP request process at: ${currentTime}`);
    try {
        if (req && req.payloadInfo && req.payloadInfo.requestId) {
            await Request.findOneAndUpdate({ _id: req.payloadInfo.requestId }, {
                finalized: {
                    time: currentTime,
                    data: req.payloadInfo
                }
            });
            logger.info('Succesfully updated request data in database.');
        } else {
            throw "Payload info or request ID was not found.";
        }
    } catch (err) {
        logger.error(`Error has occured while trying to update request data! Error: ${err}`);
    }

    next();
}

async function sendResponse(req, res) {
    if (req.payloadInfo) {
        const { status, msg, data } = req.payloadInfo;
        res.status(status).send({ msg, data });
    } else {
        res.status(500).send('An error has occured while processing this request.');
    }
}




module.exports = {
    initiateRequestProcess,
    finalizeRequestProcess,
    prepareResponse,
    sendResponse
};