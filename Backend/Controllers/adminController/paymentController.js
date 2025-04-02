import Transaction from '../../Model/transactionModel.js';
import STATUS_CODE from '../../StatusCode/StatusCode.js';
import Doctor from '../../Model/doctorModel.js';
// import appointment from '../../Model/appointmentModel.js';
import appointment from '../../Model/appoimentModel.js'
export const earnings = async (req, res) => {
    const {page,limit} = req.query;
   try {
       const page = +(req.query.page || 1);
       const limit = +(req.query.limit || 10);
       const skip = (page - 1) * limit;
       const transaction =  await Transaction.find().skip(skip).limit(limit).sort({createdAt: -1});
       const totalpage = Math.ceil(await Transaction.countDocuments() / limit);
       const count = await Transaction.countDocuments();

       const eranings = await Transaction.aggregate([
           {
               $group: {
                   _id: null,
                   totalAmount: { $sum: "$amount" }
               }
           }
       ]);
       const totalAmount = eranings[0]?.totalAmount || 0;
       const totalEarnings = totalAmount*0.1;
      res.status(STATUS_CODE.OK).json({transaction,totalpage,totalEarnings,count});
   } catch (error) {
       console.log(error);
       res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
   }
}
export const fetchDoctorPayments = async (req, res) => {
   try {
   const Drtransaction = await Transaction.find().populate({
       path: 'doctor',
       select: 'name email specialization profileImage',
       populate: {
           path: 'specialization',
           select: 'Departmentname'
       }
   });
       
       const appointmentCounts = await appointment.aggregate([
           {
               $group: {
                   _id: '$doctor',
                   appointmentCount: { $sum: 1 }
               }
           }
       ]);

       const appointmentCountMap = appointmentCounts.reduce((acc, curr) => {
           acc[curr._id.toString()] = curr.appointmentCount;
           return acc;
       }, {});

       const doctorWiseTotals = Drtransaction.reduce((acc, transaction) => {
           const doctorId = transaction.doctor._id.toString();
           if (!acc[doctorId]) {
               acc[doctorId] = {
                   doctorId: doctorId,
                   doctorName: transaction.doctor.name,
                   email: transaction.doctor.email,
                   specialization: transaction.doctor.specialization,
                   profileImage: transaction.doctor.profileImage,
                   appointmentCount: appointmentCountMap[doctorId] || 0,
                   transactions: [],
                   totalAmount: 0
               };
           }
           acc[doctorId].transactions.push(transaction);
           acc[doctorId].totalAmount += transaction.amount;
           return acc;
       }, {});

       const totalAmount = Object.values(doctorWiseTotals).reduce((sum, doctor) => sum + doctor.totalAmount, 0);

       res.status(STATUS_CODE.OK).json({
           doctorWiseTotals: Object.values(doctorWiseTotals),
           totalAmount
       });
   } catch (error) {
       console.log(error);
       res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
   }
}
export const getDoctorPayments = async (req, res) => {
 try {
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 5;
   const skip = (page - 1) * limit;
   const totalDoctors = await Doctor.countDocuments();
   const totalPages = Math.ceil(totalDoctors / limit);

   const doctorWiseTotals = await Doctor.aggregate([
     {
       $lookup: {
         from: 'appointments',
         localField: '_id',
         foreignField: 'doctor',
         as: 'appointments'
       }
     },
     {
       $project: {
         doctorName: '$name',
         specialization: '$specialization',
         totalAmount: { $multiply: ['$consultFee', { $size: '$appointments' }] },
         appointmentCount: { $size: '$appointments' }
       }
     },
     { $skip: skip },
     { $limit: limit }
   ]);

   const totalAmount = await appointment.aggregate([
     {
       $lookup: {
         from: 'doctors',
         localField: 'doctor',
         foreignField: '_id',
         as: 'doctorInfo'
       }
     },
     {
       $unwind: '$doctorInfo'
     },
     {
       $group: {
         _id: null,
         total: { $sum: '$doctorInfo.consultFee' }
       }
     }
   ]);

   res.json({
     doctorWiseTotals,
     totalAmount: totalAmount[0]?.total || 0,
     currentPage: page,
     totalPages,
     hasMore: page < totalPages
   });

 } catch (error) {
   console.error('Error in getDoctorPayments:', error);
   res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
 }
};