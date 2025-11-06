const mongoose = require("mongoose");
const EnrollmentSchema = new mongoose.Schema(
    {
        client:{type:mongoose.Schema.Types.ObjectId,ref:"clients"},
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "featuredClasses", required: true },
        enrolledDate: { type: Date, default: Date.now },
        status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
        paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
        paymentAmount: { type: Number, required: false },
        note: { type: String, trim: true, },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId, ref: "User", // admin or staff who enrolled the client
            required: false,
        },
    },
    { timestamps: true }
);

const EnrollmentModel = mongoose.model("enrollments", EnrollmentSchema);

module.exports = EnrollmentModel;
