
const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const chatModel = require('./models/chat.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });




        socket.on('sendMessage', async (data) => {
            try {
                const { senderId, receiverId, message } = data;
        
                // Save message in database
                const chatMessage = new chatModel({
                    senderId,
                    receiverId,
                    message
                });
                await chatMessage.save();
        
                // Find receiver
                const receiver = await userModel.findById(receiverId) || await captainModel.findById(receiverId);
        
                if (receiver && receiver.socketId) {
                    io.to(receiver.socketId).emit('receiveMessage', chatMessage);
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });
        
    });




}

// handle real time messaging




const sendMessageToSocketId = (socketId, messageOject) => {
     console.log(`Sending message to ${socketId}:`, messageOject);


     if (io) {
        io.to(socketId).emit(messageOject.event, messageOject.data);
     }else{
        console.log('Socket not initialized');
        
     }
}

module.exports = { initializeSocket, sendMessageToSocketId };
