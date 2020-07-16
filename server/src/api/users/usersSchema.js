const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const saltRounds = 10;

const userSchema = new Schema({
    username: {type: String, required: true, minlength: 3},
    password: {type: String, required: true, minlength: 3},
    firstName: {type: String, required: true, minlength: 2},
    lastName: {type: String, required: true, minlength: 2},
    registrationDate: {type: Date, default: Date.now}
});

userSchema.pre('save', function(next) {
    if(this.isNew || this.isModified('password')) {
        bcrypt.hash(this.password, saltRounds, 
            function(err, hashedPassword) {
                if (err) {
                    next(err);
                } else {
                    this.password = hashedPassword;
                    next();
                }
            }.bind(this));
    } else {
        next();
    }
});

userSchema.methods.isCorrectPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

var User = mongoose.model('User', userSchema);


module.exports = User;
