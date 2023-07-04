const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
    name: String,
    msg: [{ type: String }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const MessModel = mongoose.model('Newmsg', messSchema);

module.exports = { MessModel };
