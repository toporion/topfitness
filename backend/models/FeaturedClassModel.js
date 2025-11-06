// models/ClassModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., Yoga Basics, Power Training
    description: { type: String },
    duration: { type: Number, required: true }, // in minutes
    price: { type: Number, required: true },
    capacity: { type: Number, default: 10 }, // max participants

    // ✅ Assign a trainer (reference to StaffModel)
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffs", // matches your StaffModel collection name
      required: true,
    },

    // Optional - Track which user/admin created it
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

    // Optional - Time slots
    schedule: {
      day: { type: String }, // e.g., Monday
      startTime: { type: String }, // e.g., "10:00 AM"
      endTime: { type: String },   // e.g., "11:00 AM"
    },
    coverImage: { type: String },

    // Optional - Class status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const FeaturedClassModel = mongoose.model("featuredClasses", classSchema);
module.exports = FeaturedClassModel;
