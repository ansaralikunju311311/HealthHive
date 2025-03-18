import mongoose from "mongoose";
const doctorWalletSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },  
}, { timestamps: true });
const DoctorWallet = mongoose.model('DoctorWallet', doctorWalletSchema);
export default DoctorWallet;
