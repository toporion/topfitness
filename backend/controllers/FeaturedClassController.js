const FeaturedClassModel = require("../models/FeaturedClassModel");
const StaffModel = require("../models/SatffModel");

const createClss = async (req, res) => {
    try {
        const { trainerId } = req.body;
        console.log(req.body);
        const trainer = await StaffModel.findOne({ _id: trainerId, role: "trainer" });
        if (!trainer) {
            return res.status(400).json({ message: "Trainer not found" });
        }
        const coverImage = req.file ? req.file.path : null;
        const newClass = new FeaturedClassModel({
            ...req.body,
            coverImage,
            trainer: trainer._id,
            createdBy: req.user?._id

        });
        await newClass.save();
        res.status(201).json({
            success: true,
            message: "Class created successfully",
            data: newClass
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
}

const getAllClasses = async (req, res) => {
    try {
        const classes = await FeaturedClassModel.find()
            .populate("trainer", "name email profileImage skill") // show trainer info
            .populate("createdBy", "name email"); // optional

        res.status(200).json({ success: true, data: classes });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getSingleClass = async (req, res) => {
    try {
        const { id } = req.params;
        const singleClass = await FeaturedClassModel.findById(id)
            .populate("trainer") // show trainer info
            .populate("createdBy", "name email"); // optional
        res.status(200).json({ success: true, data: singleClass });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



module.exports = { createClss, getAllClasses, getSingleClass };