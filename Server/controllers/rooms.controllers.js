const Room = require('../models/rooms.models');
const User = require('../models/user.model');
const Message = require('../models/message.model');
const { io } = require('../app')

exports.createRoom = async (req, res) => {
    try {
        const { roomName, description, userId } = req.body

        if (!roomName || !description) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        const existingRoom = await Room.findOne({ name: roomName });

        if (existingRoom) {
            return res.status(400).json({ message: `Room with "${roomName}" name already exist. Try another one.` })
        }

        const newRoom = new Room({
            name: roomName,
            description: description,
            createdBy: userId,
            members: [userId],
        });

        await User.findByIdAndUpdate(userId, {
            $push: { rooms: newRoom._id }
        });

        await newRoom.save();

        return res.status(201).json({
            newRoom
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server during creating the room. Please Try Again.' });
    }
}

exports.getAllRooms = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate('rooms');

        if (!user || !user.rooms.length) {
            return res.status(404).json({ message: 'No rooms found for this user.' });
        }

        return res.status(200).json({
            rooms: user.rooms
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error during fetching the rooms. Please try again.' });
    }
};

exports.findRoomByName = async (req, res) => {
    try {
        const { roomName } = req.params;

        const room = await Room.findOne({ name: roomName });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const isUserMember = room.members.includes(req.userId);

        if (isUserMember) {
            return res.status(200).json({ joinroom: false, message: 'You are already a member of this room.', room });
        }

        return res.status(200).json({ joinroom: true, room });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error during fetching the room. Please try again.' });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const { roomName, userId, roomId } = req.body;

        const room = await Room.findById(roomId);

        if (!room) { return res.status(404).json({ message: 'Room not found' }); }

        await User.findByIdAndUpdate(userId, {
            $push: { rooms: room._id }
        });

        await Room.findByIdAndUpdate(roomId, {
            $push: { members: userId }
        });

        return res.status(200).json({ message: 'You have successfully joined the room.', room });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error during joining the room. Please try again.' });
    }
}

exports.leaveRoom = async (req, res) => {
    const { roomName } = req.params;
    const userId = req.userId; // Extracted from auth middleware
  
    try {
      // Find the room
      const room = await Room.findOne({ name: roomName });
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      // Check if the user is a member
      if (!room.members.includes(userId)) {
        return res.status(400).json({ message: 'Not a member of this room' });
      }
  
      // Remove the user from the room
      room.members = room.members.filter(id => id.toString() !== userId);
      await room.save();
  
      // Optionally, update the user's room list
      await User.findByIdAndUpdate(userId, { $pull: { rooms: room._id } });
  
      res.status(200).json({ message: 'Left room successfully' });
    } catch (error) {
      console.error('Error leaving room:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

exports.getRoomInfo = async (req, res) => {
    const { roomName } = req.params;

    try {
        // Find the room
        const room = await Room.findOne({ name: roomName }).populate('createdBy', 'username').populate('members', 'username');
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json(room);
    } catch (e) {
        console.error('Error fetching room information:', e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateRoom = async (req, res) => {
    try {

    } catch (e) {

    }
}


exports.deleteRoom = async (req, res) => {
    try {
        const { roomName } = req.params;
        const userId = req.userId;
        const room = await Room.findOne({ name: roomName });

        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (room.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this room.' });
        }

        const messages = await Message.find({ room: room.name });

        if (messages.length) {
            await Message.deleteMany({ room: room.name }).exec();
        }

        await User.updateMany({ rooms: room._id }, { $pull: { rooms: room._id } });

        await Room.findByIdAndDelete(room._id);

        console.log('hello')
        
        return res.status(200).json({ message: 'Room deleted successfully' });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error during deleting the room. Please try again.' });
    }
}