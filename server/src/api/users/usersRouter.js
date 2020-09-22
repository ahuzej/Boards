var router = require('express').Router();
const User = require('../../core/models/users');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const logger = require('../../core/logging/logger');
const { prepareResponse } = require('../../core/middleware/baseMiddleware');
const { baseErrorResponse, schemaErrorResponse  } = require('../errorHandling');
const { isStatusOk } = require('../../core/validation/statusValidation');
const secret = 'secretssh';

/**
 * Route: /users GET
 * Fetches all documents from the 'users' collection and puts them inside the payload object.
 * Data: Array of objects.
 */
router.get('/', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await User.find({});
            logger.info(`User data: ${JSON.stringify(data)}`);
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, 'Error occured while trying to fetch user data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }
    next();


}, prepareResponse);

/**
 * Route: /users/:userId GET
 * Fetches a single document from the 'users' collection that matches the given document ID.
 * Data: Array of objects.
 */
router.get('/:userId', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await User.findById(req.params.userId);

            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                logger.info(`User data: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while trying to fetch user data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }


    next();

}, prepareResponse);

/**
 * Route: /users POST
 * Creates new document for the 'users' collection and saves it in the database.
 * Data: Object.
 */
router.post('/', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                password: req.body.password
            });
            data = await user.save({});

            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                logger.info(`Inserted user with id ${data._id}`);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err.message, 'Error while inserting new user!');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };

    }
    next();

});


/**
 * Route: /users/:userId
 * Updates document from the 'users' collection that matches the given document ID.
 * Data: Object.
 */
router.put('/:userId', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await User.findOneAndUpdate({ _id: req.params.userId }, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                password: req.body.password
            }, { new: true });
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                logger.info(`User data: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, 'Error occured while trying to update user!', 500);
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /users/:userId
 * Deletes document from the 'users' collection with the given document ID.
 * Data: Object.
 */
router.delete('/:userId', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await User.findOneAndDelete({ _id: req.params.userId });
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                logger.info(`User data: ${JSON.stringify(data)}`);
            }

        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, 'Error occured while trying to delete user!', 500);
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

module.exports = router;