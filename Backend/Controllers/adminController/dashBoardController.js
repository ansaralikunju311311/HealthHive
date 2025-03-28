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
                groupByFormat = '%H:00';
                break;
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(now);
                endDate.setHours(23, 59, 59, 999);
                groupByFormat = '%Y-%m-%d';
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                groupByFormat = '%Y-%m-%d';
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                groupByFormat = '%Y-%m';
                break;
            default:
                return res.status(400).json({ message: 'Invalid filter type' });
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
            {
                $sort: { _id: 1 }
            }
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
                const hourLabel = hour.toString().padStart(2, '0') + ':00';
                const revenueFound = revenueResult.find(item => item._id === hourLabel);
                const userFound = userResult.find(item => item._id === hourLabel);
                const doctorFound = doctorResult.find(item => item._id === hourLabel);
                formattedData.labels.push(hourLabel);
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        } else if (filter === 'weekly') {
            for (let i = 0; i < 7; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                // Use locale format 'en-CA' to match the aggregation (YYYY-MM-DD)
                const dateStr = date.toLocaleDateString('en-CA');
                const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
                const revenueFound = revenueResult.find(item => item._id === dateStr);
                const userFound = userResult.find(item => item._id === dateStr);
                const doctorFound = doctorResult.find(item => item._id === dateStr);
                formattedData.labels.push(dayLabel);
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        } else if (filter === 'monthly') {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(now.getFullYear(), now.getMonth(), day);
                const dateStr = date.toISOString().split('T')[0];
                const revenueFound = revenueResult.find(item => item._id === dateStr);
                const userFound = userResult.find(item => item._id === dateStr);
                const doctorFound = doctorResult.find(item => item._id === dateStr);
                formattedData.labels.push(day.toString());
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        } else if (filter === 'yearly') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let month = 0; month < 12; month++) {
                const monthStr = `${now.getFullYear()}-${(month + 1).toString().padStart(2, '0')}`;
                const revenueFound = revenueResult.find(item => item._id === monthStr);
                const userFound = userResult.find(item => item._id === monthStr);
                const doctorFound = doctorResult.find(item => item._id === monthStr);
                formattedData.labels.push(months[month]);
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