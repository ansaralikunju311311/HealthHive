import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import user from './Routes/userRoutes.js';
import doctor from './Routes/doctorRoutes.js';
import admin from './Routes/adminRoutes.js';
import Razorpay from 'razorpay';
import { Server } from 'socket.io';
import http from 'http';
import Chat from './Model/chatModel.js';

import cookieParser from 'cookie-parser';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://healthhive.ansar.sbs',
        credentials: true
    }
});


const chatNamespace = io.of('/chat');

const onlineUsers = new Map();
const activeVideoRooms = new Map();

chatNamespace.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected to chat namespace`);

    socket.on('userConnected', ({ userId, type }) => {
        onlineUsers.set(userId, { socketId: socket.id, type });
        
        chatNamespace.emit('userStatus', { userId, online: true, type });
        onlineUsers.forEach((value, key) => {
            socket.emit('userStatus', {
                userId: key,
                online: true,
                type: value.type
            });
        });
    });

    socket.on('joinRoom', ({ doctorId, userId, type }) => {
        const roomId = `${doctorId}_${userId}`;
        socket.join(roomId);

        if (type === 'user') {
            chatNamespace.to(roomId).emit('userStatus', { 
                userId: userId, 
                online: onlineUsers.has(userId), 
                type: 'user' 
            });
            chatNamespace.to(roomId).emit('userStatus', { 
                userId: doctorId, 
                online: onlineUsers.has(doctorId), 
                type: 'doctor' 
            });
        } else {
            chatNamespace.to(roomId).emit('userStatus', { 
                userId: doctorId, 
                online: onlineUsers.has(doctorId), 
                type: 'doctor' 
            });
            chatNamespace.to(roomId).emit('userStatus', { 
                userId: userId, 
                online: onlineUsers.has(userId), 
                type: 'user' 
            });
        }
    });

    socket.on('drmessage',  async ({doctorId,userId,message}) => {
        const roomId = `${doctorId}_${userId}`;  

           try {
            
            const newMessage = new Chat({
                roomId:roomId,
                message:message,
                doctorId:doctorId,
                userId:userId,
                sender:'doctor',
                reciever:'user',
                date:new Date()
            })
            await newMessage.save();
            chatNamespace.to(roomId).emit('drmessage', message);

           } catch (error) {
            console.log(error);
           }    


    });

      
    socket.on('doctortyping', ({ doctorId, userId, isTyping }) => {
        const roomId = `${doctorId}_${userId}`;
        chatNamespace.to(roomId).emit('doctortyping', { isTyping });
    });


     socket.on('usermessage', async({doctorId,userId,message}) => {
        const roomId = `${doctorId}_${userId}`;
        console.log('Message received from user:', message);

       

        try {
            const newMessage = new Chat({
                roomId:roomId,
                message:message,
                doctorId:doctorId,
                userId:userId,
                sender:'user',
                reciever:'doctor',
                date:new Date()
            })
            await newMessage.save();
            chatNamespace.to(roomId).emit('usermessage', message);

        } catch (error) {
            console.log(error);
            
        }
    });

    socket.on('usertyping', ({ doctorId, userId, isTyping }) => {
        const roomId = `${doctorId}_${userId}`;
        chatNamespace.to(roomId).emit('usertyping', { isTyping });
    });

    // Video call events
    socket.on('initiateVideoCall', ({ doctorId, userId, roomId }) => {
        const userSocket = onlineUsers.get(userId);
        if (userSocket && userSocket.socketId) {
            chatNamespace.to(userSocket.socketId).emit('incomingVideoCall', { roomId });
            activeVideoRooms.set(roomId, { doctorId, userId });
        }
    });

    socket.on('acceptVideoCall', ({ doctorId, userId, roomId }) => {
        const doctorSocket = onlineUsers.get(doctorId);
        if (doctorSocket && doctorSocket.socketId) {
            chatNamespace.to(doctorSocket.socketId).emit('videoCallAccepted', { roomId });
        }
    });

    socket.on('rejectVideoCall', ({ doctorId, userId }) => {
        const doctorSocket = onlineUsers.get(doctorId);
        if (doctorSocket && doctorSocket.socketId) {
            chatNamespace.to(doctorSocket.socketId).emit('videoCallRejected');
        }
    });

    socket.on('endVideoCall', ({ doctorId, userId, endedBy }) => {
        const doctorSocket = onlineUsers.get(doctorId);
        const userSocket = onlineUsers.get(userId);
        
        if (doctorSocket && doctorSocket.socketId) {
            chatNamespace.to(doctorSocket.socketId).emit('videoCallEnded', { endedBy });
        }
        if (userSocket && userSocket.socketId) {
            chatNamespace.to(userSocket.socketId).emit('videoCallEnded', { endedBy });
        }
    });

    socket.on('disconnect', () => {
        let disconnectedUserId = null;
        let disconnectedUserType = null;

        for (const [userId, data] of onlineUsers.entries()) {
            if (data.socketId === socket.id) {
                disconnectedUserId = userId;
                disconnectedUserType = data.type;
                onlineUsers.delete(userId);
                break;
            }
        }

        if (disconnectedUserId) {
            chatNamespace.emit('userStatus', { 
                userId: disconnectedUserId, 
                online: false, 
                type: disconnectedUserType 
            });
        }

        console.log(`Socket ${socket.id} disconnected`);
    });
});

dotenv.config();

app.use(cors({
    origin: 'https://healthhive.ansar.sbs',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders:["Content-Type","Authorization","cookie"],
    exposedHeaders: ["set-cookie"],
}));
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true}));

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO + 'HealthHive', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
        process.exit(1); 
    }
};
app.use('/api/user', user);
app.use('/api/doctor', doctor);
app.use('/api/admin', admin);


ConnectDB();
server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
