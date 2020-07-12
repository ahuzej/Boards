const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true, minlength: 3},
    password: {type: String, required: true, minlength: 8},
    firstName: {type: String, required: true, minlength: 2},
    lastName: {type: String, required: true, minlength: 2},
    registrationDate: {type: Date, default: Date.now}
});

var User = mongoose.model('User', userSchema);


module.exports = User;
