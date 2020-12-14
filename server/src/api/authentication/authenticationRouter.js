const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const logger = require('../../core/logging/logger');
const secret = 'secretssh';
const { prepareResponse } = require('../../core/middleware/baseMiddleware');
const { model: User } = require('../../core/models/users');
const { isStatusOk } = require('../../core/validation/statusValidation');
const { baseErrorResponse } = require('../errorHandling');

//router.post('/', authenticationMiddleware);

router.post('/signIn', function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        passport.authenticate('login', { session: false }, async (err, user, info) => {
            logger.info('Starting passport login strategy for authentication.');
            if (err || !user) {
                logger.error(err);
                req.payloadInfo = baseErrorResponse(req.payloadInfo, info, 400);
            } else {
                req.login(user, { session: false }, async (error) => {
                    if (error) {
                        req.payloadInfo = baseErrorResponse(req.payloadInfo, err, 400);
                    } else {
                        const body = { id: user.id, username: user.username };
                        logger.info(`Logging in user ID ${user.id} username ${user.username}.`);
                        const token = jwt.sign(body, secret, {
                            expiresIn: '1h'
                        }
                        );
                        logger.info(`Generated JWT ${token}.`);
                        res.cookie('token', token);
                        data = {
                            token,
                            username: user.username,
                            id: user.id,
                            loggedIn: true
                        };
                    }
                });
            }

            req.payloadInfo = {
                ...req.payloadInfo,
                data
            };
            next();

        })(req, res, next);
    } else {
        next();
    }



}, prepareResponse);


router.post('/signUp', async function (req, res, next) {
    const { status } = req.payloadInfo;

    var data = undefined;

    if (isStatusOk(status)) {
        let dbUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        console.log(dbUser);
        if (!dbUser) {
            let user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                registrationDate: Date.now()
            });
            data = await user.save({});

            passport.authenticate('login', { session: false }, async (err, user, info) => {
                logger.info('Starting passport login strategy for authentication.');

                if (err || !user) {
                    req.payloadInfo = baseErrorResponse(req.payloadInfo, info, 400);
                } else {
                    req.login(user, { session: false }, async (error) => {
                        if (error) {
                            req.payloadInfo = baseErrorResponse(req.payloadInfo, err, 400);
                        } else {
                            const body = { id: user.id, username: user.username };
                            logger.info(`Logging in user ID ${user.id} username ${user.username}.`);
                            const token = jwt.sign(body, secret, {
                                expiresIn: '1h'
                            });
                            logger.info(`Generated JWT ${token}.`);
                            res.cookie('token', token);
                            data = {
                                token,
                                id: user.id,
                                username: user.username,
                                loggedIn: true
                            };
                        }
                    });
                }

                req.payloadInfo = {
                    ...req.payloadInfo,
                    data
                };
                next();

            })(req, res, next);

        } else {
            req.payloadInfo = baseErrorResponse(req.payloadInfo, 'Username/email is already taken.', 400);
            next();
        }
    } else {
        next();
    }



}, prepareResponse);

module.exports = router;