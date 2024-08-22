const mongoose = require('mongoose');

// Message Schema
const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;