const passport = require('passport');
const { model: User} = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const secret = 'secretssh';

passport.use('login', new LocalStrategy({}, async function(username, password, done) {
    try {
        const user = await User.findOne({ username }).select('+password');

        if(!user) {
            return done(null, false, { message: 'User not found.'});
        }
        
        const validate = await user.isCorrectPassword(password);

        if(!validate) {
            return done(null, false, {message: 'Wrong password.'});
        }

        return done(null, user, {message: 'Logged in succesfully.'});
        
    } catch(error) {
        done(error);
    }
}));

passport.use(new JWTStrategy(
    { 
        secretOrKey: secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, (token, done) => {
        try {
            return done(null, token._id);
        } catch(error) {
            done(error);
        }
    } 
));
