const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
