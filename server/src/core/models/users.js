const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const saltRounds = 10;

const userSchema = new Schema({
    username: { type: String, required: true, minlength: 3 },
    password: { type: String, required: true, minlength: 3 },
    firstName: { type: String, required: false, minlength: 2 },
    lastName: { type: String, required: false, minlength: 2 },
    registrationDate: { type: Date, required: false },
    boards: 
        [
        {
            type: Schema.Types.ObjectId,
            required: false,
            ref: 'Board'
        }
        ]
});

userSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('password')) {
        bcrypt.hash(this.password, saltRounds,
            function (err, hashedPassword) {
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

userSchema.pre('findOneAndUpdate', async function (next) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    bcrypt.hash(docToUpdate.password, saltRounds, function (err, hashedPassword) {
        if (err) {
            next(err);
        } else {
            docToUpdate.password = hashedPassword;
            next();
        }
    });
});

userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

var User = mongoose.model('User', userSchema);

module.exports = {
    model: User,
    schema: userSchema
};