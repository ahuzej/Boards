var router = require('express').Router();
const logger = require('../../core/logging/logger');
const { prepareResponse } = require('../../core/middleware/baseMiddleware');
const { schemaErrorResponse, baseErrorResponse } = require('../errorHandling');
const { isStatusOk } = require('../../core/validation/statusValidation');
const mongoose = require('mongoose');
const { model: Board, visitor: boardVisitor } = require('../../core/models/boards');
const { model: BoardVisitor } = boardVisitor;
const { model: Thread } = require('../../core/models/threads');
const { model: Comment } = require('../../core/models/comments');
const { model: User } = require('../../core/models/users');
const { ObjectId } = mongoose.Types;

/**
 * Route: /boards GET
 * Fetches all documents from the 'boards' collection and puts them inside the payload object.
 * Data: Array of objects.
 */
router.get('/', async function (req, res, next) {
    const { status } = req.payloadInfo;
    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await Board.find({});
            logger.info(`Project data: ${JSON.stringify(data)}`);
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while trying to fetch board data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /boards/:boardId GET
 * Fetches a single document from the 'boards' collection that matches the given document ID.
 * Data: Object.
 */
router.get('/:boardId', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await Board.findById(req.params.boardId, 'name description');
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                logger.info(`Project data: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while trying to fetch board data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /boards/:boardId/users GET
 * Fetches an array of 'user' documents that match the given document ID.
 * Data: Array of objects.
 */
router.get('/:boardId/users', async function (req, res, next) {
    const { status } = req.payloadInfo;
    const { boardId } = req.params;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await User.find({boards: boardId});
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                logger.info(`Array of people fetched for board id ${boardId}`);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while trying to fetch board data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /boards/:boardId/threads GET
 * Fetches an array of thread documents that matches the given board ID.
 * Data: Array of objects.
 */
router.get('/:boardId/threads', async function (req, res, next) {
    const { status } = req.payloadInfo;
    const { boardId } = req.params;

    logger.info(`Fetching threads for board id ${boardId}`);
    var data = undefined;

    if (isStatusOk(status)) {

        try {
            const { id } = req.payloadInfo.tokenData;
            data = await Thread.aggregate([
                {
                    $match: { board: new ObjectId(boardId) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'owner',
                        foreignField: '_id',
                        as: 'owner'
                    }
                },
                {
                    $unwind: '$owner'
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'thread',
                        as: 'commentList'
                    }
                },
                {
                    $unwind: '$commentList'
                },
                {
                    $lookup: {
                        from: 'ratings',
                        let: { commentId: '$commentList._id', thread: '$_id', ratedBy: new ObjectId(id) },
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
                            }
                        ],
                        as: 'commentList.userRating'
                    }
                },
                {
                    $lookup: {
                        from: 'ratings',
                        let: { commentId: '$commentList._id', thread: '$_id', ratedBy: new ObjectId(id) },
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
                        as: 'commentList.rating'
                    }
                },
                {
                    $unwind: {
                        path: '$commentList.rating',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        'commentList.rating.totalUpvotes': {
                            $ifNull: ['$commentList.rating.totalUpvotes', 0]
                        },

                        'commentList.rating.totalDownvotes': {
                            $ifNull: ['$commentList.rating.totalDownvotes', 0]
                        },
                        'commentList.rating.total': {
                            $ifNull: ['$commentList.rating.total', 0]
                        }
                    }
                },
                {
                    $unwind: {
                        path: '$commentList.userRating',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'commentList.author',
                        foreignField: '_id',
                        as: 'commentList.author'
                    }
                },
                {
                    $unwind: '$commentList.author'
                },
                {
                    $group: {
                        _id: '$_id',
                        root: { $first: "$$ROOT" },
                        commentList: { $push: '$commentList' },
                    }
                },
                {
                    $addFields: { "root.commentList": "$commentList" },
                },
                {
                    $replaceRoot: { newRoot: "$root" },
                },
                {
                    $addFields: { "comments": { $size: '$commentList' }, 'lastComment': { $last: '$commentList' } },
                },
                {
                    $sort: { 'sticky': -1 }
                }
            ]);
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                if (!Array.isArray(data) || data.length <= 0) { // this shouldn't happen, so prevent any faulty data being sent.
                    data = [];
                }
                logger.info(`Threads data fetched!`);
                const visit = new BoardVisitor({
                    board: boardId,
                    user: id,
                    dateTime: Date.now()
                });
                await visit.save();
                logger.info(`Board ${boardId} visit saved for user ${id}!`);
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
 * Route: /boards/user/:userId GET
 * Fetches all documents from the 'boards' collection that matches the given user ID.
 * Data: Array of objects.
 */
router.get('/user/:userId', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await User.findById({ '_id': new ObjectId(req.params.userId) }).populate('boards');
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                data = data['boards'];
                logger.info(`Project data: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while trying to fetch board data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /boards POST
 * Creates new document for the 'boards' collection and saves it in the database.
 * Data: Object.
 */
router.post('/', async function (req, res, next) {

    const { name, description } = req.body;
    const { status } = req.payloadInfo;
    let data = undefined;

    if (isStatusOk(status)) {
        try {
            const { id } = req.payloadInfo.tokenData;

            const board = new Board(
                {
                    name,
                    description,
                    dateTime: Date.now()
                }
            );
            data = await board.save({});
            logger.info(`Inserted board with id ${data._id}`);

            const user = await User.findById(id);
            console.log(user);
            if (!user.boards) user.boards = [];
            user.boards.push(data._id);
            await user.save({});

        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error while inserting new board!');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /boards/:boardId/threads/create POST
 * Updates document 'threads' array from the 'boards' collection that matches the given document id and saves it in the database.
 * Data: Object.
 */
router.post('/:boardId/threads/create', async function (req, res, next) {

    const { boardId } = req.params;
    const { title, text, sticky, locked } = req.body;
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
                    commentList: [],
                    dateTime: currentDate
                }
            );
            const comment = new Comment({
                text,
                upVotes: 0,
                downVotes: 0,
                author: id,
                dateTime: currentDate
            }
            );
            thread.commentList.push(comment);

            const board = await Board.findById(boardId);
            if (board) {
                board.threads.push(thread);
                data = await board.save({});
                logger.info(`Added thread to board id ${data._id}`);
                logger.info(`board.save returns ${data}`);
            } else {
                throw "Exception has occured!";
            }
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
 * Adds new user to board with given ID. 
 */
router.post('/:boardId/addUser', async function (req, res, next) {
    const { boardId } = req.params;
    const { users } = req.body;
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await User.find({'_id': {
                $in: users
            }}).update({
                $push: { 'boards': boardId }
            });
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err);
        }
        console.log(data);
        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /boards/:boardId
 * Deletes document from the 'boards' collection with the given document ID.
 * Data: Object.
 */
router.delete('/:boardId', async function (req, res, next) {
    const { boardId } = req.params;
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await Project.findOneAndDelete({ _id: boardId });
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