const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema=new Schema({
    enrollmentId:{type:mongoose.Schema.Types.ObjectId,ref:"enrollments",required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users",required:true},
    amount:{type:Number,required:true},
    email:{type:String,required:true},
    name:{type:String},

},{timestamps:true})

const PaymentModel=mongoose.model("payments",paymentSchema);
module.exports=PaymentModel