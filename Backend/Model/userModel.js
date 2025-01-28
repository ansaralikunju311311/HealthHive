import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    phone: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    
    
    isActive: {
        type: Boolean,
        default: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    
    otp: {
        type: String,
        required: false,
    },
    otpExpiresAt: {
        type: Date,
        required: false,
    }
});

const User = mongoose.model('User', userSchema);
export default User;