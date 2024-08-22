const mongoose = require('mongoose');

// Room Schema
const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;