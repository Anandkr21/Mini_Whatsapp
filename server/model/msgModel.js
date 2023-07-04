const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const groupSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    groupDetails: { type: String },
    chat: [messageSchema],
});

const msgModel = mongoose.model('Group', groupSchema);

module.exports = { msgModel };
