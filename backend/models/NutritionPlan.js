
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealSchema = new Schema({
    day:{type:String,enum:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], required:true},
    mealType:{type:String,enum:['Breakfast','Lunch','Dinner','Snack'], required:true},
    details:{type:String},
},{_id:false});


const NutritionPlanSchema = new Schema({
    planName:{type: String, required: true},
    client:{type:mongoose.Schema.Types.ObjectId, ref:'users', required:true},
    trainer:{type:mongoose.Schema.Types.ObjectId, ref:'users', required:true},
    planDetails:[MealSchema],
    generalNotes:{type:String},
    status:{type:String, enum:['active','inactive'], default:'active'},
    foodImage:{type:String}


},{timestamps:true});

module.exports = mongoose.model('nutritionPlans', NutritionPlanSchema);