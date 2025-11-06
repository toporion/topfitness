const PaymentModel = require('../models/PaymentModel');
const UserModel = require('../models/UserModel');
const EnrollmentModel = require('../models/EnrollModel');

/**
 * @description Get business-wide stats for the admin dashboard.
 * Only accessible by admins.
 */
const getAdminStats = async (req, res) => {
    // Security check - even if a middleware exists, it's good to double-check.
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(403).json({ message: "Forbidden: Access denied." });
    }

    try {
        // 1. Get Total Revenue
        const revenueResult = await PaymentModel.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // 2. Get Total Clients
        const totalClients = await UserModel.countDocuments({ role: 'client' });
        
        // 3. Get Total Trainers (assuming 'trainer' and 'staff' are staff roles)
        const totalTrainers = await UserModel.countDocuments({ role: { $in: ['trainer', 'staff'] } });

        // 4. Get Recent Enrollments (last 5)
        const recentEnrollments = await EnrollmentModel.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('client', 'name email')
            .populate('classId', 'name');

        // 5. Get Revenue Data for Charts (e.g., last 30 days)
        // This is a more advanced query.
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const revenueData = await PaymentModel.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    dailyRevenue: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }, // Sort by date
            { $project: { date: "$_id", revenue: "$dailyRevenue", _id: 0 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                totalClients,
                totalTrainers,
                recentEnrollments,
                revenueData
            }
        });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    getAdminStats
};
