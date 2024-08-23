const { io } = require('../app')
const jwt = require('jsonwebtoken')
const Message = require('../models/message.model');

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('joinRoom', async ({ roomId, token }) => {
        try {
            const userId = decode(token);
            if (!userId) throw new Error('Invalid token');

            console.log(`UserID: ${userId} joined room ${roomId}`);
            socket.join(roomId);
        } catch (error) {
            console.error('Error joining room:', error.message);
            socket.emit('error', 'Failed to join room');
        }
    });

    socket.on('send_message', async (data) => {
        console.log('Message received:', data);

        try {
            const userId = decode(data.token);

            // Create a new message
            const newMessage = new Message({
                content: data.content,
                sender: userId,
                room: data.room,
                date: data.date,
                time: data.time,
            });

            // Save the message
            await newMessage.save();

            // Populate the sender field with the user's username
            await newMessage.populate('sender', 'username');

            // Emit the message to everyone in the room
            io.to(data.room).emit('message', {
                content: newMessage.content,
                date: newMessage.date,
                time: newMessage.createdAt,
                room: newMessage.room,
                sender: newMessage.sender.username, // Assuming you want to send the username
            });
        } catch (error) {
            console.error('Error saving message:', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const decode = (token) => {
    const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return id;
};
