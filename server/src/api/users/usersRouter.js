var router = require('express').Router();
const logger = require('../../core/logging/logger');
const { prepareResponse } = require('../../core/middleware/baseMiddleware');
const { baseErrorResponse, schemaErrorResponse } = require('../errorHandling');
const { isStatusOk } = require('../../core/validation/statusValidation');
const mongoose = require('mongoose');
const { model: User } = require('../../core/models/users');
const { current: fileUploader } = require('../fileUploader');
const { ObjectId } = mongoose.Types;
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


/**
 * Route: /users GET
 * Fetches all documents from the 'users' collection and puts them inside the payload object.
 * Data: Array of objects.
 */
router.get('/', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {

        let { username } = req.query;
        try {
            let query = {};
            if (username && username.length < 3) {
                data = [];

            } else {
                if (username) {
                    query.username = { $regex: username };
                }
                data = await User.find(query);
                logger.info(`User data: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            logger.info(err);
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
 * Route: /users/:userId/contacts GET
 * Fetches an array of contacts from a single document from the 'users' collection that matches the given document ID.
 * Data: Array of objects.
 */
router.get('/:userId/contacts', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            console.log(req.params.userId);
            data = await User.aggregate([
                {
                    $match: {
                        _id: { $ne: new ObjectId(req.params.userId) }
                    }
                },
                {
                    $lookup: {
                        from: 'boards',
                        let: { userId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $in: [
                                                    '$$userId', '$users'
                                                ]
                                            },
                                            {
                                                $in: [
                                                    new ObjectId(req.params.userId), '$users'
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'boards'
                    }
                },
                {
                    $match: {
                        'boards.0': { $exists: true }
                    }
                }
            ]).exec();
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
                email: req.body.email,
                password: req.body.password,
                registrationDate: Date.now()
            });
            data = await user.save({});

            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                logger.info(`New user account registered with id ${data._id}`);
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
    const { userId } = req.params;
    const { username, password } = req.body;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await User.findOneAndUpdate({ _id: userId }, {
                username,
                password,
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
 * Route: /users/:userId/uploadAvatar
 * Uploads image and updates avatar url field from the 'users' collection that matches the given document ID.
 * Data: Object.
 */
router.put('/:userId/uploadAvatar', upload.single('avatarImg'), async function (req, res, next) {
    const { status } = req.payloadInfo;
    const { userId } = req.params;
    const avatarImg = req.file;
    console.log(req.file);
    var data = undefined;

    if (isStatusOk(status)) {
        try {
            if (avatarImg) { // do file upload
                let avatarUrl = null;

                avatarUrl = await fileUploader.upload(avatarImg, userId);
                data = await User.findOneAndUpdate({ _id: userId }, {
                    avatarUrl
                }, { new: true });
            }
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                logger.info(`User data: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, 'Error occured while trying to update avatar image!', 500);
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