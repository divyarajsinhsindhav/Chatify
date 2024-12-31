const { io } = require('../app');
const jwt = require('jsonwebtoken');
const Message = require('../models/message.model');

// Middleware for authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        socket.userId = id;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.userId);

    socket.on('joinRoom', async ({ roomId, token }) => {
        try {
            const userId = decode(token);
            if (!userId) throw new Error('Invalid token');
            console.log(`UserID: ${userId} joined room ${roomId}`);
            socket.join(roomId);
        } catch (error) {
            console.error('Error joining room:', error.message);
            socket.emit('error', { code: 400, message: 'Failed to join room' });
        }
    });

    socket.on('send_message', async (data) => {
        console.log('Message received:', data);

        try {
            const userId = decode(data.token);
            if (!socket.rooms.has(data.room)) {
                return socket.emit('error', { code: 403, message: 'You are not in this room.' });
            }

            // Create a new message
            const newMessage = new Message({
                content: data.content,
                sender: userId,
                room: data.room,
                date: data.date,
                time: data.time,
            });

            if (data.replyTo) {
                const repliedMessage = await Message.findById(data.replyTo);
                if (repliedMessage && repliedMessage.room === data.room) {
                    newMessage.replyTo = repliedMessage._id;
                } else {
                    console.error('ReplyTo message is invalid or not in the same room.');
                    return socket.emit('error', { code: 400, message: 'Invalid reply message.' });
                }
            }

            // Save the message
            await newMessage.save();

            // Populate the sender and replyTo fields
            await newMessage
                .populate('sender', 'username')

            // Emit the message to everyone in the room
            io.to(data.room).emit('message', {
                content: newMessage.content,
                date: newMessage.date,
                time: newMessage.time,
                room: newMessage.room,
                sender: newMessage.sender.username,
            });
        } catch (error) {
            console.error('Error saving message:', error.message);
            socket.emit('error', { code: 500, message: 'Failed to send message' });
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.userId);
    });
});

// Decode function
const decode = (token) => {
    try {
        const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return id;
    } catch (error) {
        console.error('Token decoding error:', error.message);
        return null;
    }
};
