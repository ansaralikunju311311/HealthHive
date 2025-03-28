import User from '../../Model/userModel.js';
import Transaction from '../../Model/transactionModel.js';
import STATUS_CODE from '../../StatusCode/StatusCode.js';
import Doctor from '../../Model/doctorModel.js';
export const getDashboardData = async(req,res)=>{ 
    try {
        const {filter} = req.params;
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();
        let groupByFormat;

        switch (filter) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                groupByFormat = '%H';
                break;
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                groupByFormat = '%Y-%m-%d';
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                groupByFormat = '%d';
                break;
            case 'yearly':
            default:
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                groupByFormat = '%m';
        }

        const revenuePipeline = [
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' } },
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ];
        const userPipeline = [
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ];
        const doctorPipeline = [
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    isActive: true
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ];
        const reports = [
            {
                $match:{
                    createdAt:{
                        $gte:startDate,$lte:endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' }
                    },
                    details:{
                        $push:{
                            DoctorName :'$doctorName',
                            Fee :'$amount',
                            Date : '$createdAt',
                        }
                    }
                }
            },


        ]
                const findReports = await Transaction.aggregate(reports);
                console.log("find",findReports)
        
        const [revenueResult, userResult, doctorResult] = await Promise.all([
            Transaction.aggregate(revenuePipeline),
            User.aggregate(userPipeline),
            Doctor.aggregate(doctorPipeline)
        ]);

        let formattedData = {
            labels: [],
            revenueData: [],
            userData: [],
            doctorData: [],
            filter: filter || 'yearly',
            startDate: startDate,
            endDate: endDate
        };

        if (filter === 'today') {
            for (let hour = 0; hour < 24; hour++) {
                const hourStr = hour.toString().padStart(2, '0');
                const revenueFound = revenueResult.find(item => item._id === hourStr);
                const userFound = userResult.find(item => item._id === hourStr);
                const doctorFound = doctorResult.find(item => item._id === hourStr);
                formattedData.labels.push(`${hourStr}:00`);
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        } else if (filter === 'weekly') {
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const revenueFound = revenueResult.find(item => item._id === dateStr);
                const userFound = userResult.find(item => item._id === dateStr);
                const doctorFound = doctorResult.find(item => item._id === dateStr);
                formattedData.labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        } else if (filter === 'monthly') {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayStr = day.toString().padStart(2, '0');
                const revenueFound = revenueResult.find(item => item._id === dayStr);
                const userFound = userResult.find(item => item._id === dayStr);
                const doctorFound = doctorResult.find(item => item._id === dayStr);
                formattedData.labels.push(day.toString());
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        } else if (filter === 'yearly') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let month = 1; month <= 12; month++) {
                const monthStr = month.toString().padStart(2, '0');
                const revenueFound = revenueResult.find(item => item._id === monthStr);
                const userFound = userResult.find(item => item._id === monthStr);
                const doctorFound = doctorResult.find(item => item._id === monthStr);
                formattedData.labels.push(months[month - 1]);
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        }

        res.status(STATUS_CODE.OK).json({ data: formattedData,findReports });
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}