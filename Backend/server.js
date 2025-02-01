import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import user from './Routes/userRoutes.js';
import doctor from './Routes/doctorRoutes.js';
import admin from './Routes/adminRoutes.js';
import landing from './Routes/landingRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false}));

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
app.use('/api/landing', landing);

ConnectDB();
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
