import mongoose from "mongoose";
// import Appointment from "./appoiment";
const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    appoimentdate: {
        type: String,
        required: true
    },
    slot: {
        type: String,
        required: true
    },
    orderId : {
        type: String,
        required: true
    },
    paymentId : {
        type: String,
        required: true
    },

    
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);