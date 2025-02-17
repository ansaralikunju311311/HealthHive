



// import mongoose from 'mongoose';

// const appointmentScheduleSchema = new mongoose.Schema({
//     doctorId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Doctor',
//         required: true,
//         index: true
//     },
//     appointments: [
//         {
//             // Appointment date (e.g., Feb 14, 2025)
//             appointmentDate: {
//                 type: String, 
//                 required: true
//             },
//             // Slot timing (e.g., '10:00 AM - 11:00 AM')
//             slotTime: {
//                 type: String, 
//                 required: true
//             },
//             // Booking timestamp (e.g., when it was booked on Feb 10, 2025, at 01:01 AM)
//             bookingTime: {
//                 type: Date, 
//                 required: true
//             },
//             // Is the slot booked?
//             isBooked: {
//                 type: Boolean,
//                 default: false
//             },
//             isExpired: {
//                 type: Boolean,
//                 default: false
//             }
//         }

//     ],
    
// }, { timestamps: true });

// // Index to ensure only one schedule per doctor
// appointmentScheduleSchema.index({ doctorId: 1 }, { unique: true });

// const AppointmentSchedule = mongoose.model('AppointmentSchedule', appointmentScheduleSchema);

// export default AppointmentSchedule;

import mongoose from 'mongoose';

const appointmentScheduleSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
        // Removed index: true here to avoid duplicate index definition
    },
    appointments: [
        {
            // Appointment date (e.g., Feb 14, 2025)
            appointmentDate: {
                type: String, 
                required: true
            },
            // Slot timing (e.g., '10:00 AM - 11:00 AM')
            slotTime: {
                type: String, 
                required: true
            },
            // Booking timestamp (e.g., when it was booked on Feb 10, 2025, at 01:01 AM)
            bookingTime: {
                type: Date, 
                required: true
            },
            // Is the slot booked?
            isBooked: {
                type: Boolean,
                default: false
            },
            isExpired: {
                type: Boolean,
                default: false
            }
        }
    ],
    
}, { timestamps: true });

// Index to ensure only one schedule per doctor
appointmentScheduleSchema.index({ doctorId: 1 }, { unique: true });

const AppointmentSchedule = mongoose.model('AppointmentSchedule', appointmentScheduleSchema);

export default AppointmentSchedule;
