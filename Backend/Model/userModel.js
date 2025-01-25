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
        default: ''
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isDoctor: {
        type: Boolean,
        default: false,
    },
    serialNumber: {
        type: Number,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    bloodGroup: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
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