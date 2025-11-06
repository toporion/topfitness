const EnrollmentModel = require("../models/EnrollModel");
const PaymentModel = require("../models/PaymentModel");
const FeaturedClassModel = require("../models/FeaturedClassModel");
const mongoose = require("mongoose");
const StaffModel = require("../models/SatffModel");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ==========================================================
// FUNCTION 1: createCheckoutSession
// ==========================================================
const createCheckoutSession = async (req, res) => {
    try {
        const { enrollmentId } = req.body;
        console.log('see enrollmentId', enrollmentId);
        const enrollment = await EnrollmentModel.findById(enrollmentId).populate('classId');
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: enrollment.classId?.name || "Class",
                    },
                    unit_amount: enrollment.paymentAmount * 100
                },
                quantity: 1,
            }],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/payment-success/?enrollmentId=${enrollmentId}`,
            cancel_url: "http://localhost:3000/payment-cancel",
        })
        res.status(200).json({ url: session.url })
    } catch (error) {
        console.log('stripe error', error);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
};

// ==========================================================
// FUNCTION 2: confirmPayment (THIS HAS THE KEY FIX)
// ==========================================================
const confirmPayment = async (req, res) => {
    try {
        const {enrollmentId} = req.body;
        
        // ✅ --- THIS IS THE FIX ---
        // It must be req.user.id (from your token)
        const userId = req.user.id; 
        
        if (!userId) {
            console.log("CRITICAL ERROR: User ID is undefined in confirmPayment.");
            return res.status(403).json({message: "Invalid user token."});
        }

        const enroll = await EnrollmentModel.findByIdAndUpdate(
            enrollmentId,
            {paymentStatus:"paid"},
            {new:true}
        )
        .populate("classId")
        .populate("userId","name email") // This gets name/email from the enrollment doc
        
        if(!enroll){
            return res.status(404).json({message:"Enrollment not found"})
        }

        // We create the payment using the correct userId
        const payment = await PaymentModel.findOneAndUpdate(
            {enrollmentId},
            {
                enrollmentId,
                userId: userId, // ✅ This will now be the client's ID
                amount: enroll.paymentAmount,
                email: enroll.userId.email, // This is a good fallback
                name: enroll.userId.name   // This is a good fallback
            },
            {new:true,upsert:true}
        )
        res.status(200).json({success:true,message:"Payment confirmed successfully", data:payment})
    } catch (error) {
        console.log('stripe error', error);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
};

// ==========================================================
// FUNCTION 3: getPaymentHistory (THIS IS ALSO CORRECT)
// ==========================================================
const getPaymentHistory = async (req, res) => {
    console.log(`getPaymentHistory called by user: ${req.user.email}, role: ${req.user.role}`);
    try {
        const { role, id: loggedInUserId } = req.user;
        let payments = [];

        // --- ROLE 1: ADMIN ---
        if (role === 'admin') {
            console.log('Fetching payments for ADMIN');
            payments = await PaymentModel.find()
                .populate({
                    path: 'enrollmentId',
                    select: 'classId client',
                    populate: {
                        path: 'classId',
                        select: 'name trainer',
                        populate: {
                            path: 'trainer',
                            select: 'name email' 
                        }
                    }
                })
                // ✅ We ask for profileImage
                .populate('userId', 'name email profileImage')
                .sort({ createdAt: -1 });
        }

        // --- ROLE 2: TRAINER / STAFF ---
        else if (role === 'trainer' || role === 'staff') {
            console.log(`Fetching payments for TRAINER (User ID: ${loggedInUserId})`);
            
            const staffMember = await StaffModel.findOne({ userId: loggedInUserId });
            if (!staffMember) {
                console.log("No matching staff profile found for this user.");
                return res.status(200).json({ success: true, data: [] });
            }
            const staffId = staffMember._id; 
            console.log(`Found matching Staff ID: ${staffId}`);
            
            payments = await PaymentModel.aggregate([
                { $lookup: { from: EnrollmentModel.collection.name, localField: 'enrollmentId', foreignField: '_id', as: 'enrollment' } },
                { $unwind: '$enrollment' },
                { $lookup: { from: FeaturedClassModel.collection.name, localField: 'enrollment.classId', foreignField: '_id', as: 'classDetails' } },
                { $unwind: '$classDetails' },
                { $match: { 'classDetails.trainer': staffId } },
                { $sort: { createdAt: -1 } },
                
                // ✅ We look up the client's details
                { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userDetails' } },
                { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
                
                {
                    $project: {
                        _id: 1,
                        amount: 1,
                        email: 1, // The email from the payment doc
                        name: 1,  // The name from the payment doc
                        createdAt: 1,
                        enrollmentDetails: '$enrollment',
                        classDetails: '$classDetails',
                        userDetails: { // The full user object (with image)
                            _id: '$userDetails._id',
                            name: '$userDetails.name',
                            email: '$userDetails.email',
                            profileImage: '$userDetails.profileImage'
                        }
                    }
                }
            ]);
        }

        // --- ROLE 3: CLIENT/USER ---
        else {
            console.log('Fetching payments for USER:', loggedInUserId);
            payments = await PaymentModel.find({ userId: loggedInUserId })
                .populate({
                    path: 'enrollmentId',
                    select: 'classId',
                    populate: {
                        path: 'classId',
                        select: 'name'
                    }
                })
                .sort({ createdAt: -1 });
        }
        console.log(`Found ${payments.length} payments for user ${req.user.email}`);
        res.status(200).json({ success: true, data: payments });

    } catch (error) {
        console.log('getPaymentHistory error', error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports = { createCheckoutSession, confirmPayment, getPaymentHistory };