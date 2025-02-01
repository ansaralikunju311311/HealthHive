import Doctor from "../Model/doctorModel.js";

export const fetchDoctors = async (req, res) => {
    try {
        // Using _id for sorting as it contains timestamp
        const doctors = await Doctor.find({ 
            isActive: true, 
            isBlocked: false,
        
        })
        .sort({ _id: -1 }) // Sort by _id descending (most recent first)

        console.log("Fetched doctors:", doctors);
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: error.message });
    }
};
