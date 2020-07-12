const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: [mongoose.Types.ObjectId],
        required: false
    },
    tasks: [{
        name: {
            type: String,
            required: true
        },
        priority: {
            type: Object,
            required: true
        }
    }]
});

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;