const passport = require('passport');
const jwt = require('jsonwebtoken');
const secret = 'secretssh';

const authenticationMiddleware = function(req, res, next) {
    console.log('Entered authenticationMiddleware');
    passport.authenticate('login', {session: false}, async (err, user, info) => {
        try {
            if(err || !user) {
                res.status(400).json(info);
                return;
            }

            req.login(user, {session: false}, async (error) => {
                if(error) return next(error);

                const body = {_id: user._id, username: user.username};

                const token = jwt.sign(body, secret, {
                    expiresIn: '1h'
                });

                res.cookie('token', token);

                return res.json({token: token});

            });
        } catch(error) {
            return next(error);
        }
    })(req, res, next);
}

module.exports = authenticationMiddleware;