// models/StaffModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    address: { type: String },
    gender: { type: String, required: true },
    age: { type: Number },
    profileImage: { type: String },
    department: { type: String },
    phone: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "staff", "manager", "accountant", "trainer"],
      default: "staff",
      required: true,
    },
    // ✅ Add this line
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    salary: { type: Number },
    hireDate: { type: Date, default: Date.now },
    experience: { type: Number },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    skill:{type: String,enum:["yoga","power training","zumba","cycling","cardio","meditation","others"]},
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const StaffModel = mongoose.model("staffs", staffSchema);
module.exports = StaffModel;
