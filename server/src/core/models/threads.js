const mongoose = require('mongoose');
const { Schema } = mongoose;

const threadSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: false
    },
    dateTime: {
        type: Date,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    board: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Board'
    },
    locked: {
        type: Boolean,
        required: true
    },
    sticky: {
        type: Boolean,
        required: true
    }
});

const threadVisitorSchema = new Schema({
    thread: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    dateTime: {
        type: Date,
        required: true
    }
});

let Thread = mongoose.model('Thread', threadSchema);
let ThreadVisitor = mongoose.model('ThreadVisitor', threadVisitorSchema);

module.exports = {
    model: Thread,
    schema: threadSchema,
    visitor: {
        model: ThreadVisitor,
        schema: threadVisitorSchema
    }
};