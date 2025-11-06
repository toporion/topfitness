const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema =new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    role: { type: String, enum: ['user', 'admin','staff','trainer','manager','client'] },
}, { timestamps: true });

const UserModel=mongoose.model('users', userSchema);
module.exports=UserModel;