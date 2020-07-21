var router = require('express').Router();
const Project = require('./projectsSchema');
const mongoose = require('mongoose');

router.get('/', function(req, res, next) {
    Project.find({}, function(err, data) {
        if(err) {
            console.log(err);
            res.status(500).send('Error occured while trying to process this request.');
        } else {
            res.status(200).send(JSON.stringify(data));
        }
    });
});

router.put('/', function(req, res, next) {
    const project = new Project(
        {
            title: req.body.title,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        }
    );
    project.save({}, (err, data) => {
        if(err) {
            req.report = {
                status: 500,
                err: err,
                msg: 'Error occured while trying to process this request.',
                data: data
            };
        } else {
            req.report = {
                status: 200,
                err: err,
                msg: 'Project has been created.',
                data: data
            };
        }
        next();
    });
});

/**
 * Gets project with the given ID.
 */
router.get('/:id', function(req, res, next) {
    Project.find({_id: req.body.id}, function(err, data) {
        if(err) {
            console.log(err);
            res.status(500).send('Error occured while trying to process this request.');
        } else {
            res.status(200).send(JSON.stringify(data));
            next();
        }
    });
});

/**
 * Adds new user to project with given ID. 
 */
router.post('/addUser', function(req, res, next) {
});

/**
 * Adds task to project with given ID.
 */
router.post('/addTask', function(req, res, next) {

});

/**
 * Deletes project with given ID. 
 */
router.delete('/', function(req, res, next) {

});

/**
 * Deletes task with given ID.
 */
router.delete('/removeTask', function(req, res, next) {

});


module.exports = router;