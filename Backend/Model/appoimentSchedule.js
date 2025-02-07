import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
}, { _id: false });

const scheduleEntrySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    timeSlots: [timeSlotSchema]
}, { _id: false });

const appoimentScheduleSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
        index: true
    },
    schedules: [scheduleEntrySchema]
}, { 
    timestamps: true 
});

// Unique index for doctor's schedules
appoimentScheduleSchema.index({ doctorId: 1 }, { unique: true });

const AppoimentSchedule = mongoose.model('AppoimentSchedule', appoimentScheduleSchema);

export default AppoimentSchedule;
