const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const authenticationMiddleware = require('./authenticationMiddleware');
const secret = 'secretssh';

router.post('/', authenticationMiddleware);

module.exports = router;