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
    phone: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    // otp: {
    //     type: String,
    //     required: false,
    //     default: null
    // },
    // otpExpiresAt: {
    //     type: Date,
    //     required: false,
    //     default: null
    // },
   
});
const User = mongoose.model('User', userSchema);

export default User;