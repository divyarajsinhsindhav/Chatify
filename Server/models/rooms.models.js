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
    }],
    subroomList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubRoom',
    }]
}, { timestamps: true });

const subRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'voice', 'music', 'youtube', 'spotify', 'video'],
        required: true,
    },
    topic: {
        type: String,
        default: 'Off Topic',
        required: true
    },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
const SubRoom = mongoose.model('SubRoom', subRoomSchema);

module.exports = {
    Room,
    SubRoom,
};