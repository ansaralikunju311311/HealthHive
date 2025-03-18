import mongoose from 'mongoose';
const doctorSchema = new mongoose.Schema({
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
    yearsOfExperience: {
        type: Number,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        required: true,
    },
    medicalLicense: {
        type: String,
        required: true,
    },
    idProof: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    consultFee: {
        type: String,
        required: true,
    }
});
const RejectedDoctor = mongoose.model('rejectedDoctor', doctorSchema)
export default RejectedDoctor;