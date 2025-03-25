import mongoose from 'mongoose';
const prescriptionSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prescriptions: [{
        medicines: {
            type: String,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        }
    }],
    diagnosis: {
        type: String,
        required: true
    },
    uniquePre: {
        type: String,   
        required: true
    },
    description:{
        type:String,
        required:true
    },
    
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;