import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    Departmentname: {
        type: String,
        required: true,
        set: function(value) {
            // Capitalize first letter, rest as is
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },
    status: {
        type: String,
        default: 'Listed'
    }
}, {
    timestamps: true
});

// Create a case-insensitive index
departmentSchema.index({ Departmentname: 1 }, { 
    unique: true,
    collation: { locale: 'en', strength: 2 }
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;