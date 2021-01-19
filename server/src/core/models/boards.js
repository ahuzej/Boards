const mongoose = require('mongoose');
const { Schema } = mongoose;

const boardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: false
    }
});

const boardVisitorSchema = new Schema({
    board: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true ,
        ref: 'Users'
    },
    dateTime: {
        type: Date,
        required: true
    }
});

let Board = mongoose.model('Board', boardSchema);
let BoardVisitor = mongoose.model('BoardVisitor', boardVisitorSchema);

module.exports = {
    model: Board,
    schema: boardSchema,
    visitor: {
        model: BoardVisitor,
        schema: boardVisitorSchema
    }
};