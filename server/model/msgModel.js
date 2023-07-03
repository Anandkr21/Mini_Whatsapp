const mongoose = require('mongoose');

const Message = mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }, 
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    message:{
        type:String,
        required:true
    },
    timestamap: {
        type:Date, 
        default:Date.now 
    }
})

const msgModel = new mongoose.model('message', Message)

module.exports = {msgModel}