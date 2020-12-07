const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
    type: { // upvote, downvote
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        required: true
    },
    rated: {
        type: Schema.Types.ObjectId,
        required: true
    },
    ratedBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    thread: {
        type: Schema.Types.ObjectId,
        required: true
    },
    dateTime: {
        type: Date,
        required: false
    }
});

let Rating = mongoose.model('Rating', ratingSchema);

module.exports = {
    model: Rating,
    schema: ratingSchema
};