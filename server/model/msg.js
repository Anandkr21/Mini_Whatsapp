const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
    name: String,
    msg: [{ type: String }],
    timestamp: {
        type: Date,
        default: Date.now
    }
},{
    versionKey : false
});

const MessModel = mongoose.model('messages', messSchema);

module.exports = { MessModel };
