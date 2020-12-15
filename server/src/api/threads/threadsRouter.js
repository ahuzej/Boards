var router = require('express').Router();
const logger = require('../../core/logging/logger');
const { prepareResponse } = require('../../core/middleware/baseMiddleware');
const { schemaErrorResponse, baseErrorResponse } = require('../errorHandling');
const { isStatusOk } = require('../../core/validation/statusValidation');
const mongoose = require('mongoose');
const { model: Board } = require('../../core/models/boards');
const { model: Comment } = require('../../core/models/comments');
const { model: Thread } = require('../../core/models/threads');
const { model: Rating } = require('../../core/models/rating');
const { ObjectId } = mongoose.Types;

/**
 * Route: /threads/:threadId GET
 * Fetches a single nested thread document from the 'boards' collection that matches the given document ID.
 * Data: Array of objects.
 */
router.get('/:threadId', async function (req, res, next) {
    logger.info('Entered threadsRouter.js get /:threadId');
    const { status } = req.payloadInfo;

    var data = undefined;
    const { threadId } = req.params;

    if (isStatusOk(status)) {
        try {
            data = await Board.aggregate([
                {
                    $match: {
                        'threads._id': new ObjectId(threadId)
                    },
                },
                {
                    $unwind: '$threads'
                },
                {
                    $match: {
                        'threads._id': new ObjectId(threadId)
                    }
                },
                {
                    $project: {
                        threads: 1
                    }
                },
                {
                    $unwind: '$threads.commentList'
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { 'comment': '$threads.commentList' },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$comment.author']
                                }
                            }
                        }],
                        as: 'threads.commentList.author'
                    }
                },
                {
                    $unwind: '$threads.commentList.author'
                },
                {
                    $replaceRoot: {
                        newRoot: '$threads'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        commentList: { $push: '$commentList' },
                        title: { $first: '$title' },
                        text: { $first: '$text' },
                        sticky: { $first: '$sticky' },
                        locked: { $first: '$locked' },
                        owner: { $first: '$owner' },
                        dateTime: { $first: '$dateTime' },
                        comments: { $first: '$comments' },
                    }
                }
            ]);
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                if (!Array.isArray(data) || data.length <= 0) { // this shouldn't happen, so prevent any faulty data being sent.
                    throw "No data found."
                }
                data = data[0];
                console.log(`Thread data: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while trying to fetch thread data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /threads/:threadId/comments GET
 * Fetches an array of documents from the 'comments' collection that matches the given document ID.
 * Data: Array of objects.
 */
router.get('/:threadId/comments', async function (req, res, next) {
    logger.info('Entered threadsRouter.js get /:threadId/comments');
    const { status } = req.payloadInfo;

    var data = undefined;
    const { threadId } = req.params;

    if (isStatusOk(status)) {
        const { id } = req.payloadInfo.tokenData;

        try {
            data = await Comment.aggregate([
                {
                    $match: {
                        'thread': new ObjectId(threadId)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                {
                    $unwind: '$author'
                },
                {
                    $lookup: {
                        from: 'ratings',
                        let: { commentId: '$_id', thread: '$thread', ratedBy: new ObjectId(id) },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$comment', '$$commentId'] },
                                            { $eq: ['$thread', '$$thread'] },
                                            { $eq: ['$ratedBy', '$$ratedBy'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    type: 1,
                                    _id: 0
                                }
                            }
                        ],
                        as: 'userRating'
                    }
                },
                {
                    $unwind: {
                        path: '$userRating',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'ratings',
                        let: { commentId: '$_id', thread: '$thread', ratedBy: new ObjectId(id) },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$comment', '$$commentId'] },
                                            { $eq: ['$thread', '$$thread'] },
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: '$type',
                                    count: { $sum: 1 }
                                }
                            },
                            {
                                $project: {
                                    result: {
                                        $cond: [
                                            { $eq: ['$_id', 'upvote'] },
                                            { 'upvotes': '$count' },
                                            { 'downvotes': '$count' }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: '$$thread',
                                    totalUpvotes: { $sum: "$result.upvotes" },
                                    totalDownvotes: { $sum: "$result.downvotes" }
                                }
                            },
                            {
                                $addFields: {
                                    total: {
                                        $subtract: ['$totalUpvotes', '$totalDownvotes']
                                    }
                                }
                            }
                        ],
                        as: 'rating'
                    }
                },
                {
                    $unwind: {
                        path: '$rating',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        'userRating': '$userRating.type',
                        'rating.totalUpvotes': {
                            $ifNull: ['$rating.totalUpvotes', 0]
                        },

                        'rating.totalDownvotes': {
                            $ifNull: ['$rating.totalDownvotes', 0]
                        },
                        'rating.total': {
                            $ifNull: ['$rating.total', 0]
                        }
                    }
                }
            ]);
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                if (!Array.isArray(data) || data.length <= 0) { // this shouldn't happen, so prevent any faulty data being sent.
                    throw "No data found."
                }
            }
        } catch (err) {
            logger.error(err);
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while trying to fetch thread data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);


/**
 * Route: /threads/user/:userId GET
 * Fetches a single nested thread document from the 'boards' collection that matches the given document ID.
 * Data: Array of objects.
 */
router.get('/user/:userId', async function (req, res, next) {
    logger.info('Entered threadsRouter.js get /user/:userId');
    const { status } = req.payloadInfo;

    var data = undefined;
    const { userId } = req.params;
    console.log(userId);
    if (isStatusOk(status)) {
        try {
            data = await Board.aggregate([{
                $match: {
                    users: new ObjectId(userId)
                }
            }]);
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                if (!Array.isArray(data) || data.length <= 0) { // this shouldn't happen, so prevent any faulty data being sent.
                    throw ('No data found');
                }
                data = data[0];
                console.log(`Thread data: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while trying to fetch thread data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);


/**
 * Route: /threads/ POST
 * Creates new document for the 'threads' collection and saves it in the database.
 * Data: Object.
 */
router.post('/', async function (req, res, next) {

    const { title, text, sticky, locked, boardId } = req.body;
    const { status } = req.payloadInfo;
    let data = undefined;

    if (isStatusOk(status)) {
        try {
            const { id } = req.payloadInfo.tokenData;
            const currentDate = Date.now();

            const thread = new Thread(
                {
                    title,
                    text,
                    sticky: sticky ? sticky : false,
                    locked: locked ? locked : false,
                    owner: id,
                    board: boardId,
                    commentList: [],
                    dateTime: currentDate
                }
            );
            data = await thread.save({});

            const comment = new Comment({
                text,
                upVotes: 0,
                downVotes: 0,
                author: id,
                dateTime: currentDate,
                thread: data._id
            }
            );
            await comment.save();
            logger.info(`Inserted thread with id ${data._id}`);
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error while inserting new thread!');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /threads/:threadId/comments/create POST
 * Updates document 'threads' array from the 'boards' collection that matches the given document id and saves it in the database.
 * Data: Object.
 */
router.post('/:threadId/comments/create', async function (req, res, next) {
    logger.info('Entered threadsRouter.js post /threads/:threadId/comments/create');

    const { text } = req.body;
    const { threadId } = req.params;
    const { status } = req.payloadInfo;
    let data = undefined;
    if (isStatusOk(status)) {

        try {
            const { id } = req.payloadInfo.tokenData;
            const comment = new Comment({
                text: text,
                author: id,
                thread: threadId,
                dateTime: Date.now()
            });
            data = await comment.save({});
            await data.populate('author', 'username boards').execPopulate();

            data = data.toObject();
            data.rating = {
                totalUpvotes: 0,
                totalDownvotes: 0,
                total: 0
            };
            logger.info(`Added comment to thread id ${threadId}, comment ${data}`);
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while adding new tasks!');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    logger.info('Exiting threadsRouter.js post /threads/:threadId/comments/create');
    next();

}, prepareResponse);

/**
 * Route: /threads/:threadId/changeThreadState POST
 * Updates threads collection that matches the given document id and saves it in the database.
 * Data: Object.
 */
router.post('/:threadId/changeThreadState', async function (req, res, next) {
    logger.info('Entered threadsRouter.js post /threads/:threadId/changeThreadState');

    const { locked, sticky } = req.body;
    const { threadId } = req.params;
    const { status } = req.payloadInfo;
    let data = undefined;
    if (isStatusOk(status)) {

        try {
            const thread = await Thread.findById(threadId);
            logger.info(`Thread JSON: ${JSON.stringify(thread)}`);

            if(thread) {
                if(typeof locked === 'boolean') {
                    thread.locked = locked;
                }
                if(typeof sticky === 'boolean') {
                    thread.sticky = sticky;
                }
                await thread.save();
                logger.info(`Thread ${threadId} updated.`);
                data = thread;
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'An error has occured while updating!');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    logger.info('Exiting threadsRouter.js post /threads/:threadId/changeThreadState');
    next();

}, prepareResponse);

/**
 * Route: /threads/:threadId/comments/rate POST
 * Creates new document for the 'rating' collection and saves it in the database.
 * Data: Object.
 */
router.post('/:threadId/comments/rate', async function (req, res, next) {
    console.log(req.body);
    const { type, comment, rated } = req.body;
    const { threadId: thread } = req.params;
    const { status } = req.payloadInfo;
    let data = undefined;
    console.log(thread);
    if (isStatusOk(status)) {
        try {
            const { id } = req.payloadInfo.tokenData;
            // When processing rating request, need to first check if the comment was already rated by this user (no duplicates)
            let currentRating = await Rating.findOne({ comment: new ObjectId(comment), ratedBy: new ObjectId(id), thread: new ObjectId(thread) });
            if (currentRating) {
                logger.info('Rating already exists...');
                currentRating.type = type;
                currentRating.dateTime = Date.now();

                data = await currentRating.save();

                data = type;

            } else {
                logger.info(`User ${id} rating ${comment} (thread ${thread}) for the first time...`);
                // first time rating
                const rating = new Rating({
                    type,
                    thread,
                    rated,
                    ratedBy: id,
                    comment,
                    dateTime: Date.now()
                });

                data = await rating.save({});

                data = type;
            }

            logger.info(JSON.stringify(data));
            logger.info(`Added ${type} rating to comment id ${comment}`);

        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while adding new tasks!');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);




/**
 * Route: /threads/:threadId
 * Deletes document from the 'threads' array field in 'boards' collection with the given document ID.
 * Data: Object.
 */
router.delete('/:threadId', async function (req, res, next) {
    const { threadId } = req.params;
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await Board.findOneAndDelete({ 'threads._id': threadId });
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err);
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);


module.exports = router;