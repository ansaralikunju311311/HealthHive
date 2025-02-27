

import mongoose from 'mongoose';

const appointmentScheduleSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    appointments: [
        {
            appointmentDate: {
                type: String, 
                required: true
            },
            slotTime: {
                type: String, 
                required: true
            },
            bookingTime: {
                type: Date, 
                required: true
            },
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

appointmentScheduleSchema.index({ doctorId: 1 }, { unique: true });

const AppointmentSchedule = mongoose.model('AppointmentSchedule', appointmentScheduleSchema);

export default AppointmentSchedule;
