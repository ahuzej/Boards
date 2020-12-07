const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: false
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    thread: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Thread'
    },
    dateTime: {
        type: Date,
        required: false
    }
});

let Comment = mongoose.model('Comment', commentSchema);

module.exports = {
    model: Comment,
    schema: commentSchema
};