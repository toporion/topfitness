const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    gender: { type: String, required: true },
    age: { type: Number },
    profileImage: { type: String },
    phone: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
}, { timestamps: true });

const ClientModel = mongoose.model("clients", clientSchema);
module.exports = ClientModel;