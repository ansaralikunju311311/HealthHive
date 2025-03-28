import Prescription from "../../Model/prescriptions.js";
import STATUS_CODE from "../../StatusCode/StatusCode.js";
export const sendPrescription = async (req, res) => { 
    try {
      const { doctorId, userId, uniquePre } = req.params;
      const data = req.body;  
      console.log("doctorId", uniquePre);
      console.log("userId", userId);
      console.log("data", data);
      const prescription = new Prescription({
        doctorId,
        userId,
        prescriptions: data.prescriptions,
        diagnosis: data.diagnosis,
        uniquePre,
        description:data.description
      });
      await prescription.save();
      res.status(STATUS_CODE.OK).json({ message: 'Prescription sent successfully' });
    } catch (error) {
      console.error('Error in sendPrescription:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: 'Error sending prescription',
        error: error.message
      });
    }
  }