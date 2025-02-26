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
import Chat from './Model/chat.js';


import cookieParser from 'cookie-parser';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);


    socket.on('joinRoom', ({ doctorId, userId }) => {
        console.log("DoctorId and userId==================  inside the  function", doctorId, userId)
        const roomId = `${doctorId}_${userId}`;
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
    });


    
    socket.on('drmessage',  async ({doctorId,userId,message}) => {
        console.log("DoctorId and userId==================  inside the  function   messGIN FROM THE DOCTOR", doctorId, userId)
        console.log('Message received from doctor:', message);
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
            io.to(roomId).emit('drmessage', message);

           } catch (error) {
            console.log(error);
           }    


    });

      
    socket.on('doctortyping', ({ doctorId, userId, isTyping }) => {
        const roomId = `${doctorId}_${userId}`;
        io.to(roomId).emit('doctortyping', { isTyping });
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
            io.to(roomId).emit('usermessage', message);

        } catch (error) {
            console.log(error);
            
        }
    });

    socket.on('usertyping', ({ doctorId, userId, isTyping }) => {
        const roomId = `${doctorId}_${userId}`;
        io.to(roomId).emit('usertyping', { isTyping });
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
});

dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
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
        await mongoose.connect(process.env.MONGO,{  
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
    }
};
app.use('/api/user', user);
app.use('/api/doctor', doctor);
app.use('/api/admin', admin);


ConnectDB();
server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
