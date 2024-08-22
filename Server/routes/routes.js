const { register, login, logout, getUser, updateUser, deleteUser } = require('../controllers/users.controllers');
const { createRoom, joinRoom, findRoomByName, getAllRooms, leaveRoom, getRoomInfo, deleteRoom, updateRoom } = require('../controllers/rooms.controllers')
const authantication = require('../middleware/authantication')
const express = require('express')
const router = express.Router()

const Message = require('../models/message.model');

// Auth Routes
router.post('/auth/register', register)
router.post('/auth/login', login)
router.post('/auth/logout', logout)

//User Routes
router.get('/user', authantication, getUser)
router.put('/user', authantication, updateUser)
router.delete('/user/delete', authantication, deleteUser)

//Rooms Routes
router.post('/chatroom/create', createRoom)
router.get('/chatroom/all', authantication, getAllRooms)
router.get('/chatroom/find/:roomName', authantication, findRoomByName)
router.post('/chatroom/join/:roomname', authantication, joinRoom)
router.post('/chatroom/leave/:roomName', authantication, leaveRoom)
router.get('/chatroom/info/:roomName', authantication, getRoomInfo)
router.delete('/chatroom/delete/:roomName', authantication, deleteRoom)
router.put('/chatroom/update/:roomName', authantication, updateRoom)

router.get('/messages', async (req, res) => {
    try {
      const { roomId } = req.query;
      const messages = await Message.find({ room: roomId })
        .populate('sender', 'username')
        .sort({ createdAt: 1 });
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });
  

module.exports = router;

