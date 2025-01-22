import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './Routes/userRoutes.js';
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO,{
            useNewUrlParser: true,
            useUnifiedTopology: true    
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
};
app.use('/api/user',router);
ConnectDB();
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
