var router = require('express').Router();
const Project = require('../../core/models/projects');
const logger = require('../../core/logging/logger');
const { prepareResponse } = require('../../core/middleware/baseMiddleware');
const { schemaErrorResponse, baseErrorResponse } = require('../errorHandling');
const { isStatusOk } = require('../../core/validation/statusValidation');

/**
 * Route: /projects GET
 * Fetches all documents from the 'projects' collection and puts them inside the payload object.
 * Data: Array of objects.
 */
router.get('/', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await Project.find({});
            logger.info(`Project data: ${JSON.stringify(data)}`);
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while trying to fetch project data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /projects/:projectId GET
 * Fetches a single document from the 'projects' collection that matches the given document ID.
 * Data: Array of objects.
 */
router.get('/:projectId', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await Project.findById(req.params.projectId);
            if (!data) {
                req.payloadInfo = baseErrorResponse(req.payloadInfo, 'No matching document was found for the given document ID.', 400);
            } else {
                logger.info(`Project data: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error occured while trying to fetch project data.');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Route: /projects POST
 * Creates new document for the 'projects' collection and saves it in the database.
 * Data: Object.
 */
router.post('/', async function (req, res, next) {
    const { title, description, startDate, endDate, users, tasks } = req.body;
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            const project = new Project(
                {
                    title,
                    description,
                    startDate,
                    endDate,
                    users,
                    tasks
                }
            );
            data = await project.save({});
            logger.info(`Inserted project with id ${data._id}`);
        } catch (err) {
            req.payloadInfo = schemaErrorResponse(req.payloadInfo, err, 'Error while inserting new project!');
        }

        req.payloadInfo = {
            ...req.payloadInfo,
            data
        };
    }

    next();

}, prepareResponse);

/**
 * Adds new user to project with given ID. 
 */
router.post('/:projectId/addUser', async function (req, res, next) {
    const { projectId } = req.params;
    const { id } = req.body;
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await Project.findByIdAndUpdate(projectId, {
                $push: { "users": id }
            });
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


/**
 * Route: /projects/:projectId
 * Deletes document from the 'projects' collection with the given document ID.
 * Data: Object.
 */
router.delete('/:projectId', async function (req, res, next) {
    const { projectId } = req.params;
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        try {
            data = await Project.findOneAndDelete({ _id: projectId });
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