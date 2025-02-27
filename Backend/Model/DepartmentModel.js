import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    Departmentname: {
        type: String,
        required: true,
        set: function(value) {
        
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },
    status: {
        type: String,
        default: 'Listed'
    },
    Description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


departmentSchema.index({ Departmentname: 1 }, { 
    unique: true,
    collation: { locale: 'en', strength: 2 }
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;