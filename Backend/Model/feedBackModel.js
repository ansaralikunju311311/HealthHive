import mongoose from 'mongoose';
const feedBackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: { 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    // userImage: {
    //     type: String
    // },
    // doctorImage: {
    //     type: String
    // }
}, { timestamps: true });
const FeedBack = mongoose.model('FeedBack', feedBackSchema);
export default FeedBack;