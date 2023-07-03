const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        unique: true,
        minlength: [5],
        select: false
    }
})

const userModel = new mongoose.model('user', schema)

module.exports = {userModel}