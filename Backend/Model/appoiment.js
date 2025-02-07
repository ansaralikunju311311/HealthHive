// import mongoose from "mongoose";

// const appoimentSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     doctorId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Doctor',
//         required: true
//     },
//     date: {
//         type: String,
//         required: true
//     },
//     time: {
//         type: String,
//         required: true
//     },
//     // status: {
//     //     type: String,
//     //     default: 'pending'
//     // }
// })

// const Appoiment = mongoose.model('Appoiment', appoimentSchema);
// export default Appoiment


import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    slot: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;