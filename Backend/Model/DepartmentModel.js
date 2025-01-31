import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    Departmentname: {
        type: String,
        required: true
    },
    // status: {
    //     type: String,
    //     enum: ['Listed', 'Unlisted'],
    //     default: 'Listed'
    // }
}, {
    timestamps: true
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;