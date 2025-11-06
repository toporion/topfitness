// backend/controllers/EnrllController.js

const EnrollmentModel = require("../models/EnrollModel");
const FeaturedClassModel = require("../models/FeaturedClassModel");

const createEnoll = async (req, res) => {
    console.log('see details', req.user)
    try {
        // 1. Get classId and note from the body. DO NOT get userId from the body.
        const { classId, note } = req.body;

        // 2. Get the user's ID securely from the req.user object set by your verifyToken middleware.
        const userId = req.user.id;
        console.log(userId);
        const createdBy = req.user._id; // The user enrolling is also the creator.

        // Check if the user is already enrolled
        const existingEnroll = await EnrollmentModel.findOne({ classId, userId, status: "active" });
        if (existingEnroll) {
            return res.status(400).json({ message: "You are already enrolled in this class" });
        }

        // Find the class to get the price
        const selectedClass = await FeaturedClassModel.findById(classId);
        if (!selectedClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        const paymentAmount = selectedClass.price;

        const newEnroll = new EnrollmentModel({
            classId,
            userId, // Use the secure userId from req.user
            createdBy,
            paymentAmount,
            paymentStatus: "pending",
            note
        });

        await newEnroll.save();

        res.status(201).json({
            success: true,
            message: "User enrolled successfully",
            data: newEnroll
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
// Add this new function to your EnrllController.js

const getMyEnrolledClasses = async (req, res) => {
    try {
        const userId = req.user.id;
        const enrollments = await EnrollmentModel.find({ userId: userId })
            .populate({
                path: "classId", // The field in the EnrollmentSchema
                select: "name price trainer", // Specify which class fields you want
                populate: {
                    path: "trainer", // Nested populate to get trainer details
                    select: "name profileImage" // Only get the trainer's name and image
                }
            })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: enrollments })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "internal server error", error: error.message })
    }
}

module.exports = { createEnoll, getMyEnrolledClasses };