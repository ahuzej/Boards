const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    users: [{
        type: [mongoose.Types.ObjectId],
        required: false
    }],
    owners: [{
        type: [mongoose.Types.ObjectId],
        required: false
    }],
    tasks: [{
        name: {
            type: String,
            required: true
        },
        priority: {
            type: Object,
            required: true
        },
        startDate: {
            type: Date,
            required: false
        },
        endDate: {
            type: Date,
            required: false
        }
    }]
});

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;