const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    initialized: { 
        time: Date,
        data: {}
    },
    finalized: {
        time: Date,
        data: {}
    },
    ip: String
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;