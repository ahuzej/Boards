var router = require('express').Router();
const User = require('./usersSchema');
const mongoose = require('mongoose');

router.get('/', function(req, res, next) {
    User.find({}, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            res.send(JSON.stringify(data));
            next();    
        }
    });
});
router.put('/', function(req, res, next) {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    });
    user.save({}, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log(`Inserted user with id ${data._id}`);
            res.send(JSON.stringify(user));    
        }
        next();    
    });
});
router.post('/', function(req, res, next) {
    console.log(req.body);
    User.findOneAndUpdate({_id: req.body._id}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    } ,function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log(`Updated user with id ${data._id}`);
            res.send(JSON.stringify(data));
            next();
        }
    });
});
router.delete('/', function(req, res, next) {
    User.findOneAndDelete(req.body._id, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log(`Deleted user with id ${data._id}`);
            res.send(JSON.stringify(data));
            next();
        }
    });
});

module.exports = router;