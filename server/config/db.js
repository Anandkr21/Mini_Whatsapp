const mongoose = require('mongoose');
require("dotenv").config();

// connecting with mongoDB
const connection = mongoose.connect(process.env.mongoURL);

module.exports = {connection}